import {
  Call02Icon,
  Chatting01Icon,
  MoreVerticalIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CalendarPickerSheet,
  CallSummaryEmptyState,
  CallSummaryShimmer,
  ConversationHeader,
  FilterChip,
  MayaMessageCard,
  PrimaryPressable,
} from "../../../src/components";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  minHitSlop,
  spacing,
} from "../../../src/constants/tokens";
import { useCallSummary } from "../../../src/domain/calls/hooks/calls.hooks";
import { useCallSummaryActionDispatch } from "../../../src/domain/calls/hooks/useCallSummaryActionDispatch";
import type {
  CallSummaryAction,
  CallSummaryData,
  CallSummaryMessage,
} from "../../../src/domain/calls/types/calls.types";

function ActionPillButton({
  icon,
  label,
}: {
  icon: IconSvgElement;
  label: string;
}) {
  return (
    <Pressable style={styles.pillButton}>
      <HugeiconsIcon icon={icon} size={iconSize.sm} color={colors.textAccent} />
      <Text style={styles.pillButtonText}>{label}</Text>
    </Pressable>
  );
}

// Some backends send an ISO timestamp, others send a call-elapsed offset
// (e.g. "00:23") — fall back to the raw string when it isn't a real date.
function formatTranscriptTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function TranscriptRow({ message }: { message: CallSummaryMessage }) {
  return (
    <View style={styles.transcriptRow}>
      <Text style={styles.transcriptTime}>
        {formatTranscriptTimestamp(message.timestamp)}
      </Text>
      <Text style={styles.transcriptText}>
        <Text style={styles.transcriptName}>{message.sender.name}</Text>
        {"  "}
        {message.text}
      </Text>
    </View>
  );
}

function CallSummaryActionCard({ action }: { action: CallSummaryAction }) {
  const [dismissed, setDismissed] = useState(false);
  const { dispatch, loading, calendarPicker } = useCallSummaryActionDispatch();
  if (dismissed) return null;

  return (
    <View style={styles.plainBubble}>
      <Text style={styles.plainBubbleText}>
        {action.payload.title || action.label}
      </Text>
      {action.payload.date ? (
        <View style={styles.suggestionRow}>
          <View style={styles.suggestionPill}>
            <Text style={styles.suggestionPillText}>{action.payload.date}</Text>
          </View>
        </View>
      ) : null}
      <View style={styles.suggestionActions}>
        <View style={styles.suggestionActionButton}>
          <PrimaryPressable
            size="sm"
            appearance="outline"
            text="Not Now"
            disabled={loading}
            onPress={() => setDismissed(true)}
          />
        </View>
        <View style={styles.suggestionActionButton}>
          <PrimaryPressable
            size="sm"
            text={action.label}
            disabled={loading}
            onPress={() => dispatch(action)}
          />
        </View>
      </View>
      <CalendarPickerSheet
        calendars={calendarPicker.calendars}
        onSelect={calendarPicker.onSelect}
        onCancel={calendarPicker.onCancel}
      />
    </View>
  );
}

function CallSummaryTabContent({ data }: { data: CallSummaryData }) {
  return (
    <View style={styles.nutshell}>
      {data.introMessage ? (
        <MayaMessageCard name={data.agent?.name} message={data.introMessage} />
      ) : null}
      {data.summary ? (
        <View style={styles.plainBubble}>
          <Text style={styles.plainBubbleText}>{data.summary}</Text>
        </View>
      ) : null}
      {data.ai?.actions.map((action) => (
        <CallSummaryActionCard key={action.id} action={action} />
      ))}
      {data.messages && data.messages.length > 0 ? (
        <View style={styles.transcript}>
          {data.messages.map((message) => (
            <TranscriptRow key={message.id} message={message} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function CallSummaryScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = { paddingTop: Math.max(insets.top, spacing.lg) };
  const { id, title, time, direction, otherUserId, avatarUrl } = useLocalSearchParams<{
    id: string;
    title?: string;
    time?: string;
    direction?: string;
    otherUserId?: string;
    avatarUrl?: string;
  }>();
  const { data, isLoading } = useCallSummary(id);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabs = data?.tabs ?? [];
  const activeTab = tabs[activeTabIndex];
  const directionLabel =
    direction === "missed"
      ? "Missed"
      : direction === "outgoing"
        ? "Outgoing Call"
        : "Incoming Call";

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <ConversationHeader
        title={title || "Call Summary"}
        status={directionLabel}
        id={otherUserId}
        avatarSource={avatarUrl ? { uri: avatarUrl } : undefined}
        trailing={
          <Pressable style={styles.menuButton} hitSlop={minHitSlop}>
            <HugeiconsIcon
              icon={MoreVerticalIcon}
              size={iconSize.md}
              color={colors.textPrimary}
            />
          </Pressable>
        }
      />

      <View style={styles.actionsRow}>
        <ActionPillButton icon={Chatting01Icon} label="Chat" />
        <ActionPillButton icon={Call02Icon} label="Audio" />
        <ActionPillButton icon={Video01Icon} label="Video" />
      </View>

      <View style={styles.callInfoCard}>
        <View style={styles.callInfoRow}>
          <Text style={styles.callInfoDate}>{time}</Text>
        </View>
        <View style={styles.callInfoStatusRow}>
          <HugeiconsIcon
            icon={Call02Icon}
            size={iconSize.sm}
            color={colors.textSecondary}
          />
          <Text style={styles.callInfoStatus}>
            {direction === "missed" ? "Call Missed" : "Call Answered"}
          </Text>
        </View>
      </View>

      {tabs.length > 0 ? (
        <View style={styles.tabs}>
          {tabs.map((tab, index) => (
            <FilterChip
              key={tab.title}
              label={tab.title}
              selected={index === activeTabIndex}
              onPress={() => setActiveTabIndex(index)}
            />
          ))}
        </View>
      ) : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <CallSummaryShimmer />
        ) : activeTab ? (
          <CallSummaryTabContent data={activeTab.data} />
        ) : (
          <View style={styles.emptyStateWrapper}>
            <CallSummaryEmptyState
              title="No summary available"
              subtitle="We couldn't generate a summary for this call."
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  menuButton: {
    width: controlHeight.xs,
    height: controlHeight.xs,
    borderRadius: controlHeight.xs / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  pillButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: controlHeight.sm,
    borderRadius: controlHeight.sm / 2,
    backgroundColor: colors.backgroundSecondary,
  },
  pillButtonText: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  callInfoCard: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  callInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  callInfoDate: {
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  callInfoStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  callInfoStatus: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  tabs: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyStateWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  nutshell: {
    gap: spacing.sm,
  },
  plainBubble: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    overflow: "hidden",
  },
  plainBubbleText: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  suggestionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  suggestionPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    backgroundColor: colors.backgroundPrimary,
  },
  suggestionPillText: {
    fontFamily: geist.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  suggestionActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  suggestionActionButton: {
    flex: 1,
  },
  transcript: {
    gap: spacing.lg,
  },
  transcriptRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  transcriptTime: {
    width: 36,
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.sm,
    color: colors.textSecondary,
  },
  transcriptText: {
    flex: 1,
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  transcriptName: {
    fontFamily: manrope.bold,
    color: colors.textPrimary,
  },
});
