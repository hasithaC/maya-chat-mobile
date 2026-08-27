import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import mayaAvatar from "@/assets/images/avatars/maya-avatar.png";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ConversationHeader,
  DateSeparator,
  MessageBubble,
  MessageCard,
  MessageGroup,
  MessageInputBar,
  PrimaryPressable,
  VoiceNotePlayer,
} from "../../../src/components";
import {
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  minHitSlop,
  spacing,
} from "../../../src/constants/tokens";

export default function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };
  const [draft, setDraft] = useState("");

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ConversationHeader
          avatarSource={mayaAvatar}
          title="Maya - Personal Assistant"
          status="Online"
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

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DateSeparator label="Saturday, 29 Nov 2025" />

          <MessageGroup avatarSource={mayaAvatar} name="Maya (PA)">
            <MessageBubble
              variant="incoming"
              text="Hi Robert, how can I help you today? you have 1 remaining task to complete in the morning another one in the afternoon."
              time="16:04"
            />
            <MessageCard dividers={true}>
              {[
                <Text key="text" style={styles.cardText}>
                  You need to send an email to Kate Roberts regarding the
                  threads and other possible materials.
                </Text>,
                <View key="actions" style={styles.buttonRow}>
                  <View style={styles.buttonHalf}>
                    <PrimaryPressable
                      text="Maybe Later"
                      appearance="outline"
                      size="sm"
                      onPress={() => {}}
                    />
                  </View>
                  <View style={styles.buttonHalf}>
                    <PrimaryPressable
                      text="Let's Draft"
                      size="sm"
                      onPress={() => {}}
                    />
                  </View>
                </View>,
              ]}
            </MessageCard>
            <MessageCard dividers={true}>
              {[
                <Text key="text" style={styles.cardText}>
                  You have a scheduled team's meet today to finalize material
                  selections and keep production on track?
                </Text>,
                <>
                  <View key="date" style={styles.dateRow}>
                    <View style={styles.dateChip}>
                      <Text style={styles.dateChipText}>4 Dec, 2025</Text>
                    </View>
                    <View style={styles.dateChip}>
                      <Text style={styles.dateChipText}>05:45PM</Text>
                    </View>
                  </View>
                  ,
                  <PrimaryPressable
                    key="join"
                    text="Join Now"
                    onPress={() => {}}
                  />
                </>,
              ]}
            </MessageCard>
          </MessageGroup>

          <MessageBubble
            variant="outgoing"
            text="Before sending a draft I need to send a message to @Threads Finding group"
            time="16:04"
          />
          <MessageBubble
            variant="outgoing-plain"
            text="See what happened this week!"
          />

          <MessageGroup avatarSource={mayaAvatar} name="Maya (PA)">
            <MessageBubble
              variant="incoming"
              text="Yeah sure, what I need to send there?"
              time="16:04"
            />
          </MessageGroup>

          <MessageBubble
            variant="outgoing"
            text="See what happened within the group last week, and say that I found a place to buy good threads."
            time="16:04"
          />

          <MessageGroup avatarSource={mayaAvatar} name="Maya (PA)">
            <MessageBubble
              variant="incoming"
              text="Sure, let me draft a message below."
              time="16:04"
            />
            <MessageCard dividers={true}>
              {[
                <Text key="draft" style={styles.cardText}>
                  Hi everyone, I have found a place to buy high quality threads.
                  I would like to have a discussion with you all regarding this.
                  Let me know a good time to schedule a call !
                </Text>,
                <>
                  <Text key="prompt" style={styles.promptText}>
                    Is this good enough to send as a message?
                  </Text>
                  ,
                  <View key="actions" style={styles.buttonRow}>
                    <View style={styles.buttonHalf}>
                      <PrimaryPressable
                        text="Try Another"
                        appearance="outline"
                        size="sm"
                        onPress={() => {}}
                      />
                    </View>
                    <View style={styles.buttonHalf}>
                      <PrimaryPressable
                        text="Yes, Send Now"
                        size="sm"
                        onPress={() => {}}
                      />
                    </View>
                  </View>
                </>,
              ]}
            </MessageCard>
          </MessageGroup>

          <MessageBubble
            variant="outgoing"
            text="Hey I need to send a voice note to @Alan Louis mentioning that we can have the meeting today evening around 6PM."
            time="16:04"
          />

          <MessageGroup avatarSource={mayaAvatar} name="Maya (PA)">
            <MessageBubble
              variant="incoming"
              text="Sure, let me draft a voice note below."
              time="16:04"
            />
            <MessageCard dividers={true}>
              {[
                <VoiceNotePlayer key="player" duration="00:24" />,
                <>
                  <Text key="prompt" style={styles.promptText}>
                    Is this good enough to send as a voice note?
                  </Text>
                  ,
                  <View key="actions" style={styles.buttonRow}>
                    <View style={styles.buttonHalf}>
                      <PrimaryPressable
                        text="Try Another"
                        appearance="outline"
                        size="sm"
                        onPress={() => {}}
                      />
                    </View>
                    <View style={styles.buttonHalf}>
                      <PrimaryPressable
                        text="Send to Alan"
                        size="sm"
                        onPress={() => {}}
                      />
                    </View>
                  </View>
                </>,
              ]}
            </MessageCard>
          </MessageGroup>
        </ScrollView>

        <MessageInputBar value={draft} onChangeText={setDraft} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  moreButton: {
    marginLeft: "auto",
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  cardText: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  promptText: {
    fontFamily: manrope.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  buttonHalf: {
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dateChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
    alignItems: "center",
  },
  dateChipText: {
    fontFamily: geist.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
});
