import {
  ArrowDown01Icon,
  Calendar01Icon,
  Call02Icon,
  Chatting01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FilterChip,
  MayaMessageCard,
  PrimarySearchInput,
  ReminderEventBar,
  ReminderListItem,
  TabHeader,
} from "../../../src/components";
import {
  badgeSize,
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  controlWidth,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  palette,
  spacing,
} from "../../../src/constants/tokens";
import { useTalkToMaya } from "../../../src/hooks/useTalkToMaya";

interface ReminderItem {
  id: string;
  icon: IconSvgElement;
  title: string;
  subtitle: string;
  time: string;
  date: string;
  color: string;
  assignedByAssistant?: boolean;
  completed?: boolean;
  // Index into TIME_SLOTS — only reminders with an actual scheduled slot
  // show up on the calendar view.
  slotIndex?: number;
}

type ReminderView = "list" | "calendar";

const MINUTES_PER_SLOT = 30;
const SLOTS_PER_DAY = (24 * 60) / MINUTES_PER_SLOT;

function generateTimeSlots(): string[] {
  return Array.from({ length: SLOTS_PER_DAY }, (_, index) => {
    const totalMinutes = index * MINUTES_PER_SLOT;
    const hour24 = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour24 < 12 ? "AM" : "PM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")}${period}`;
  });
}

const TIME_SLOTS = generateTimeSlots();
const slotHeight = controlHeight.lg;
const timeLabelWidth = controlWidth.xl;

// A small set of vivid accent colors kept separate from the app's semantic
// palette, applied at low alpha for the calendar chips so they read as
// eye-catching tints rather than solid blocks.
const EVENT_COLORS = {
  blue: palette.blue[500],
  purple: "#8B5CF6",
  orange: "#F97316",
  teal: "#14B8A6",
};

const REMINDERS: ReminderItem[] = [
  {
    id: "voice-call",
    icon: Call02Icon,
    title: "Voice Call",
    subtitle: "Threads Finding",
    time: "03:00PM",
    date: "Monday, 08 Dec 2025",
    assignedByAssistant: true,
    color: EVENT_COLORS.purple,
  },
  {
    id: "conference-call",
    icon: Video01Icon,
    title: "Conference Call",
    subtitle: "Management Updates - Group",
    time: "05:30PM",
    date: "Monday, 08 Dec 2025",
    assignedByAssistant: true,
    color: EVENT_COLORS.blue,
    slotIndex: 35,
  },
  {
    id: "scheduled-event",
    icon: Calendar01Icon,
    title: "Scheduled Calendar Event",
    subtitle: "Fullsnack Designers",
    time: "11:00AM",
    date: "Monday, 08 Dec 2025",
    color: EVENT_COLORS.orange,
    slotIndex: 22,
  },
  {
    id: "other-task",
    icon: Chatting01Icon,
    title: "Other Task",
    subtitle: "Design Team - Group",
    time: "08:00AM",
    date: "Sunday, 07 Dec 2025",
    completed: true,
    color: EVENT_COLORS.teal,
  },
];

function CalendarTimeline({ reminders }: { reminders: ReminderItem[] }) {
  const scheduled = reminders.filter(
    (reminder) => reminder.slotIndex !== undefined,
  );

  return (
    <View style={[styles.timeline, { height: TIME_SLOTS.length * slotHeight }]}>
      {TIME_SLOTS.map((label) => (
        <View key={label} style={styles.timeSlot}>
          <Text style={styles.timeLabel}>{label}</Text>
          <View style={styles.timeLine} />
        </View>
      ))}
      {scheduled.map((reminder) => (
        <ReminderEventBar
          key={reminder.id}
          icon={reminder.icon}
          title={reminder.title}
          subtitle={reminder.subtitle}
          color={reminder.color}
          style={{
            top: (reminder.slotIndex ?? 0) * slotHeight + spacing.xs,
            left: timeLabelWidth + spacing.md,
            height: slotHeight - spacing.xs * 2,
          }}
        />
      ))}
    </View>
  );
}

export default function RemindScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = { paddingTop: Math.max(insets.top, spacing.lg) };
  const handleTalkToMaya = useTalkToMaya();
  const [view, setView] = useState<ReminderView>("list");

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <View style={styles.content}>
        <TabHeader title="Reminders" onCtaPress={handleTalkToMaya} />
        <PrimarySearchInput
          placeholder="Search for reminders"
          onSearch={() => {}}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MayaMessageCard message="Hey Robert, you have 2 reminders pending for today! You can check the list below." />

        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>Open for Today</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{REMINDERS.length}</Text>
            </View>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>Sat, 29 Nov 2025</Text>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={iconSize.md}
              color={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.filters}>
          <View style={styles.filterItem}>
            <FilterChip
              label="All Reminders"
              selected={view === "list"}
              onPress={() => setView("list")}
            />
          </View>
          <View style={styles.filterItem}>
            <FilterChip
              label="Calendar View"
              selected={view === "calendar"}
              onPress={() => setView("calendar")}
            />
          </View>
        </View>

        {view === "list" ? (
          <View style={styles.list}>
            {REMINDERS.map((reminder) => (
              <ReminderListItem
                key={reminder.id}
                icon={reminder.icon}
                iconColor={reminder.color}
                title={reminder.title}
                subtitle={reminder.subtitle}
                time={reminder.time}
                date={reminder.date}
                assignedByAssistant={reminder.assignedByAssistant}
                completed={reminder.completed}
              />
            ))}
          </View>
        ) : (
          <CalendarTimeline reminders={REMINDERS} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  summaryTitle: {
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  countBadge: {
    minWidth: badgeSize.lg,
    height: badgeSize.lg,
    paddingHorizontal: spacing.xs,
    borderRadius: badgeSize.lg / 2,
    backgroundColor: colors.buttonPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontFamily: geist.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textInverse,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dateText: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  filters: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  filterItem: {
    flex: 1,
  },
  list: {
    gap: spacing.md,
  },
  timeline: {
    position: "relative",
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    height: slotHeight,
  },
  timeLabel: {
    width: timeLabelWidth,
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  timeLine: {
    flex: 1,
    height: borderWidth.thin,
    marginTop: lineHeight.xs / 2,
    backgroundColor: colors.border,
  },
});
