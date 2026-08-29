import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import mayaAvatar from "@/assets/images/avatars/maya-avatar.png";
import emptyThreadImage from "@/assets/images/states/empty-conversation-thread.png";
import { router, useLocalSearchParams } from "expo-router";
import type { ReactNode } from "react";
import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import type { ImageSourcePropType, ListRenderItemInfo } from "react-native";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ConversationHeader,
  ConversationShimmer,
  DateSeparator,
  EmptyState,
  ErrorState,
  MessageBubble,
  MessageCard,
  MessageGroup,
  MessageInputBar,
  PrimaryPressable,
  VoiceNotePlayer,
} from "../../../src/components";
import {
  colors,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  minHitSlop,
  spacing,
} from "../../../src/constants/tokens";
import { ROUTES } from "../../../src/constants/routes";
import { useAuthStore } from "../../../src/domain/auth/store/auth.store";
import {
  useConversation,
  useConversationMessages,
} from "../../../src/domain/conversations/hooks/conversations.hooks";
import type {
  Action,
  Attachment,
  ConversationMessage,
} from "../../../src/domain/conversations/types/conversations.types";
import { getConversationDisplay } from "../../../src/domain/conversations/utils/conversation-display";
import { usePresenceStore } from "../../../src/core/socket/presence.store";
import { useFadeTransition } from "../../../src/hooks/useFadeTransition";
import { formatDateLabel, formatTime } from "../../../src/utils/date";

type Segment =
  | { kind: "date"; id: string; label: string }
  | { kind: "outgoing"; id: string; message: ConversationMessage }
  | {
      kind: "incoming";
      id: string;
      senderId: string;
      messages: ConversationMessage[];
    };

function buildSegments(
  messages: ConversationMessage[],
  currentUserId?: string,
): Segment[] {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const segments: Segment[] = [];
  let lastDayKey: string | null = null;

  for (const message of sorted) {
    const dayKey = message.createdAt.slice(0, 10);
    if (dayKey !== lastDayKey) {
      segments.push({
        kind: "date",
        id: `date-${dayKey}`,
        label: formatDateLabel(message.createdAt),
      });
      lastDayKey = dayKey;
    }

    if (message.senderId === currentUserId) {
      segments.push({ kind: "outgoing", id: `msg-${message.id}`, message });
      continue;
    }

    const last = segments[segments.length - 1];
    if (last?.kind === "incoming" && last.senderId === message.senderId) {
      last.messages.push(message);
    } else {
      segments.push({
        kind: "incoming",
        id: `group-${message.id}`,
        senderId: message.senderId,
        messages: [message],
      });
    }
  }

  return segments;
}

function isImageAttachment(attachment: Attachment) {
  return attachment.type?.toLowerCase().includes("image");
}

function isVoiceAttachment(attachment: Attachment) {
  const type = attachment.type?.toLowerCase() ?? "";
  return type.includes("audio") || type.includes("voice");
}

function handleActionPress(action: Action) {
  if (action.actionType === "CHAT" && action.payload.conversationId != null) {
    router.push(ROUTES.conversation(String(action.payload.conversationId)));
  }
}

function ActionCard({ action }: { action: Action }) {
  const isPrimary = action.priority === "PRIMARY";
  const children: ReactNode[] = [];

  if (action.payload.isVoiceNote && action.payload.audioUrl) {
    children.push(
      <VoiceNotePlayer key="voice" audioUrl={action.payload.audioUrl} />,
    );
  }

  if (
    typeof action.payload.content === "string" &&
    action.payload.content.length > 0
  ) {
    children.push(
      <Text key="content" style={styles.cardText}>
        {action.payload.content}
      </Text>,
    );
  }

  if (isPrimary) {
    children.push(
      <PrimaryPressable
        key="button"
        text={action.label}
        size="sm"
        onPress={() => handleActionPress(action)}
      />,
    );
  } else {
    children.push(
      <Text key="label" style={styles.cardText}>
        {action.label}
      </Text>,
    );
  }

  return <MessageCard>{children}</MessageCard>;
}

function MessageWithActions({
  message,
  variant,
}: {
  message: ConversationMessage;
  variant: "incoming" | "outgoing";
}) {
  const images = (message.attachments ?? [])
    .filter(isImageAttachment)
    .map((attachment) => attachment.url);
  const voiceAttachment = (message.attachments ?? []).find(isVoiceAttachment);
  const actions = message.metadata?.ai?.actions ?? [];

  return (
    <Fragment>
      <MessageBubble
        variant={variant}
        text={message.content}
        time={formatTime(message.createdAt)}
        images={images.length > 0 ? images : undefined}
        voiceUrl={voiceAttachment?.url}
      />
      {actions.map((action) => (
        <ActionCard key={action.id} action={action} />
      ))}
    </Fragment>
  );
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
  };
  const inputBarInsetStyle = {
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };
  const [draft, setDraft] = useState("");

  const currentUserId = useAuthStore((state) => state.user?.id);
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);
  const { data: conversation, isPending: isConversationPending } = useConversation(id);
  const {
    data: messages,
    isPending,
    isError,
    refetch,
  } = useConversationMessages(id);
  const { loadingOpacity, contentOpacity } = useFadeTransition({
    isLoading: isPending,
    loadingDuration: 250,
  });

  const header = conversation
    ? getConversationDisplay(conversation, currentUserId)
    : { title: "Chat", avatarSource: undefined };

  const participantsById = useMemo(() => {
    const map = new Map<
      string,
      { name: string; avatarSource?: ImageSourcePropType }
    >();
    conversation?.participants.forEach((participant) => {
      const isMayaSender =
        conversation.type === "MAYA" && participant.userId !== currentUserId;
      map.set(participant.userId, {
        name: participant.user.fullName,
        avatarSource: isMayaSender
          ? mayaAvatar
          : typeof participant.user.avatar === "string"
            ? { uri: participant.user.avatar }
            : undefined,
      });
    });
    return map;
  }, [conversation, currentUserId]);

  const segments = useMemo(
    () => buildSegments(messages ?? [], currentUserId),
    [messages, currentUserId],
  );
  const listRef = useRef<FlatList<Segment>>(null);

  const renderSegment = useCallback(
    ({ item: segment }: ListRenderItemInfo<Segment>) => {
      if (segment.kind === "date") {
        return <DateSeparator label={segment.label} />;
      }

      if (segment.kind === "outgoing") {
        return <MessageWithActions message={segment.message} variant="outgoing" />;
      }

      const sender = participantsById.get(segment.senderId);

      return (
        <MessageGroup
          avatarSource={sender?.avatarSource}
          name={sender?.name ?? "Unknown"}
        >
          {segment.messages.map((message) => (
            <MessageWithActions
              key={message.id}
              message={message}
              variant="incoming"
            />
          ))}
        </MessageGroup>
      );
    },
    [participantsById],
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{...containerInsetStyle,paddingHorizontal: spacing.lg,}}>
          <ConversationHeader
            avatarSource={header.avatarSource}
            title={header.title}
            status={
              conversation?.isGroup
                ? "Group"
                : header.otherParticipantId &&
                    onlineUserIds.has(header.otherParticipantId)
                  ? "Online"
                  : "Offline"
            }
            loading={isConversationPending}
            trailing={
              <Pressable style={styles.moreButton} hitSlop={minHitSlop}>
                <HugeiconsIcon
                  icon={MoreVerticalIcon}
                  size={iconSize.md}
                  color={colors.textPrimary}
                />
              </Pressable>
            }
          />
        </View>

        <View style={{...styles.body,backgroundColor: colors.backgroundTertiary}}>
          <Animated.View
            style={[styles.absoluteFill, { opacity: loadingOpacity, padding: spacing.lg }]}
            pointerEvents={isPending ? "auto" : "none"}
          >
            <View style={styles.scrollContent}>
              <ConversationShimmer />
            </View>
          </Animated.View>

          <Animated.View style={[styles.body, { opacity: contentOpacity }]}>
            {isError ? (
              <View style={styles.stateContainer}>
                <ErrorState
                  title="Something went wrong"
                  subtitle="We couldn't load this conversation. Please try again."
                  onRetry={() => refetch()}
                />
              </View>
            ) : messages && messages.length === 0 ? (
              <View style={styles.stateContainer}>
                <EmptyState
                  image={emptyThreadImage}
                  title="No messages yet"
                  subtitle="Send a message to start the conversation."
                />
              </View>
            ) : (
              <FlatList
                ref={listRef}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                data={segments}
                keyExtractor={(segment) => segment.id}
                renderItem={renderSegment}
                onContentSizeChange={() =>
                  listRef.current?.scrollToEnd({ animated: false })
                }
              />
            )}
          </Animated.View>
        </View>

        <View style={{...inputBarInsetStyle, paddingHorizontal: spacing.lg,}}>
          <MessageInputBar value={draft} onChangeText={setDraft} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  moreButton: {
    marginLeft: "auto",
  },
  keyboardView: {
    flex: 1,
    gap: spacing.xs,
    
  },
  body: {
    flex: 1,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  scroll: {
    flex: 1,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  cardText: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
});
