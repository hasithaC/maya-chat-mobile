import mayaAvatar from "@/assets/images/avatars/maya-avatar.png";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  MessageBubble,
  MessageGroup,
  MessageInputBar,
  PrimaryPressable,
  SetupHeader,
} from "../../../src/components";
import { ROUTES } from "../../../src/constants/routes";
import { colors, spacing } from "../../../src/constants/tokens";
import { showToast } from "../../../src/core/toast/toast.store";
import { useAuthStore } from "../../../src/domain/auth/store/auth.store";
import { mayaApi } from "../../../src/domain/maya/api/maya.api";
import { formatTime } from "../../../src/utils/date";

const TRAINING_STEP_COUNT = 7;

interface ChatMessage {
  id: number;
  from: "maya" | "user";
  text: string;
  options: string[];
  createdAt: string;
}

type Segment =
  | { kind: "maya"; id: string; messages: ChatMessage[] }
  | { kind: "user"; id: string; message: ChatMessage };

function buildSegments(messages: ChatMessage[]): Segment[] {
  const segments: Segment[] = [];
  for (const message of messages) {
    if (message.from === "user") {
      segments.push({ kind: "user", id: `user-${message.id}`, message });
      continue;
    }
    const last = segments[segments.length - 1];
    if (last?.kind === "maya") {
      last.messages.push(message);
    } else {
      segments.push({ kind: "maya", id: `maya-${message.id}`, messages: [message] });
    }
  }
  return segments;
}

const OPTIONS_PER_ROW = 2;

function chunkOptions(options: string[]): string[][] {
  const rows: string[][] = [];
  for (let index = 0; index < options.length; index += OPTIONS_PER_ROW) {
    rows.push(options.slice(index, index + OPTIONS_PER_ROW));
  }
  return rows;
}

function parseOptions(raw: string | undefined): string[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((option): option is string => typeof option === "string")
      : [];
  } catch {
    return [];
  }
}

export default function AboutYouScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const { initialMessage, initialOptions } = useLocalSearchParams<{
    initialMessage?: string;
    initialOptions?: string;
  }>();

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialMessage
      ? [{
          id: 1,
          from: "maya",
          text: initialMessage,
          options: parseOptions(initialOptions),
          createdAt: new Date().toISOString(),
        }]
      : [],
  );
  const [progress, setProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [draft, setDraft] = useState("");
  const nextIdRef = useRef(2);
  const scrollRef = useRef<ScrollView>(null);

  const hasPendingOptions = messages[messages.length - 1]?.options.length > 0;

  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
  };
  const inputBarInsetStyle = {
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };

  async function sendAnswer(text: string) {
    const answer = text.trim();
    if (!answer || !user || isSending) return;

    const userMessage: ChatMessage = {
      id: nextIdRef.current++,
      from: "user",
      text: answer,
      options: [],
      createdAt: new Date().toISOString(),
    };
    setMessages((previous) => [
      ...previous.map((message) => ({ ...message, options: [] })),
      userMessage,
    ]);
    setDraft("");
    setIsSending(true);

    try {
      const response = await mayaApi.trainVoiceAgent(user.id, answer);
      if (!response.success || !response.response) {
        showToast(response.message || "Failed to send message. Please try again.");
        return;
      }

      const step = response.response;
      const mayaMessage: ChatMessage = {
        id: nextIdRef.current++,
        from: "maya",
        text: step.message,
        options: step.options ?? [],
        createdAt: new Date().toISOString(),
      };
      setMessages((previous) => [...previous, mayaMessage]);
      setProgress((previous) => Math.min(previous + 1 / TRAINING_STEP_COUNT, 1));

      if (step.completed) {
        const completion = await mayaApi.trainingComplete(user.id);
        if (completion.success) {
          router.dismissTo(ROUTES.dashboard);
        } else {
          showToast(completion.message || "Failed to finish Maya setup. Please try again.");
        }
      }
    } catch (error) {
      showToast(
        error instanceof Error && error.message
          ? error.message
          : "Failed to send message. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, containerInsetStyle]}>
        <SetupHeader
          mutedTitle="Tell Me About You"
          title=", Let's start with what you do."
          progress={progress}
        />

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {buildSegments(messages).map((segment) => {
            if (segment.kind === "user") {
              return (
                <MessageBubble
                  key={segment.id}
                  variant="outgoing"
                  text={segment.message.text}
                  time={formatTime(segment.message.createdAt)}
                />
              );
            }
            return (
              <MessageGroup key={segment.id} avatarSource={mayaAvatar} name="Maya">
                {segment.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    variant="incoming"
                    text={message.text}
                    time={formatTime(message.createdAt)}
                  >
                    {message.options.length > 0 ? (
                      <View style={styles.optionList}>
                        {chunkOptions(message.options).map((row) => (
                          <View key={row.join("|")} style={styles.optionRow}>
                            {row.map((option) => (
                              <View key={option} style={styles.optionCell}>
                                <PrimaryPressable
                                  size="sm"
                                  text={option}
                                  onPress={() => sendAnswer(option)}
                                />
                              </View>
                            ))}
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </MessageBubble>
                ))}
              </MessageGroup>
            );
          })}
        </ScrollView>

        <View style={inputBarInsetStyle}>
          <MessageInputBar
            value={draft}
            onChangeText={setDraft}
            onSend={() => void sendAnswer(draft)}
            placeholder="Type your answer here..."
            disabled={hasPendingOptions || isSending}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  container: {
    flex: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  optionList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  optionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  optionCell: {
    flex: 1,
  },
});
