import { CheckCheckIcon, CheckIcon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  shadows,
  spacing,
} from "../../constants/tokens";
import { MessageImageGrid } from "./MessageImageGrid";
import { VoiceNotePlayer } from "./VoiceNotePlayer";

export type MessageReadStatus = "sending" | "sent" | "delivered" | "read";

interface MessageBubbleProps {
  variant: "incoming" | "outgoing" | "outgoing-plain";
  text: string;
  time?: string;
  images?: string[];
  voiceUrl?: string;
  readStatus?: MessageReadStatus;
}

function ReadStatusIcon({ status }: { status: MessageReadStatus }) {
  if (status === "sending") {
    return (
      <HugeiconsIcon icon={Clock01Icon} size={iconSize.sm} color={colors.textSecondary} />
    );
  }

  if (status === "read") {
    return (
      <HugeiconsIcon icon={CheckCheckIcon} size={iconSize.sm} color={colors.buttonPrimary} />
    );
  }

  if (status === "delivered") {
    return (
      <HugeiconsIcon icon={CheckCheckIcon} size={iconSize.sm} color={colors.textSecondary} />
    );
  }

  return <HugeiconsIcon icon={CheckIcon} size={iconSize.sm} color={colors.textSecondary} />;
}

const MENTION_PATTERN = /@\w+(?:\s\w+)?/g;

function renderTextWithMentions(text: string, textStyle: StyleProp<TextStyle>) {
  const matches = Array.from(text.matchAll(MENTION_PATTERN));

  if (matches.length === 0) {
    return <Text style={textStyle}>{text}</Text>;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match, index) => {
    const start = match.index ?? 0;
    if (start > cursor) {
      parts.push(text.slice(cursor, start));
    }
    parts.push(
      <Text key={index} style={styles.mention}>
        {match[0]}
      </Text>,
    );
    cursor = start + match[0].length;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <Text style={textStyle}>{parts}</Text>;
}

export function MessageBubble({
  variant,
  text,
  time,
  images,
  voiceUrl,
  readStatus,
}: MessageBubbleProps) {
  return (
    <View
      style={[
        styles.container,
        variant === "incoming" && styles.incoming,
        variant === "outgoing" && styles.outgoing,
        variant === "outgoing-plain" && styles.outgoingPlain,
      ]}
    >
      {voiceUrl ? <VoiceNotePlayer audioUrl={voiceUrl} /> : null}
      {images && images.length > 0 ? <MessageImageGrid images={images} /> : null}
      {text.trim().length > 0 ? renderTextWithMentions(text, styles.text) : null}
      {time ? (
        <View style={styles.footer}>
          <Text style={styles.time}>{time}</Text>
          {readStatus ? <ReadStatusIcon status={readStatus} /> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "85%",
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  incoming: {
    alignSelf: "flex-start",
    backgroundColor: colors.backgroundPrimary,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    ...shadows.sm,
  },
  outgoing: {
    alignSelf: "flex-end",
    backgroundColor: colors.backgroundAccent,
  },
  outgoingPlain: {
    alignSelf: "flex-end",
    backgroundColor: colors.backgroundSecondary,
  },
  text: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  mention: {
    fontFamily: manrope.bold,
  },
  footer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  time: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
});
