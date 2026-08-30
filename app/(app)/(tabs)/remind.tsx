import { ArrowDown01Icon, Calendar01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CalendarDatePicker,
  FilterChip,
  MayaMessageCard,
  PopupMenu,
  PrimarySearchInput,
  RemindersEmptyState,
  ReminderEventBar,
  ReminderListItem,
  ReminderListShimmer,
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
import { useDeviceCalendarEvents } from "../../../src/domain/device-calendar/hooks/useDeviceCalendarEvents";
import type {
  CalendarSourceKind,
  DeviceCalendarEvent,
} from "../../../src/domain/device-calendar/types/device-calendar.types";
import { useTalkToMaya } from "../../../src/hooks/useTalkToMaya";

interface ReminderItem {
  id: string;
  icon: IconSvgElement;
  title: string;
  subtitle: string;
  time: string;
  date: string;
  color: string;
  sourceKind?: CalendarSourceKind;
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

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Built manually (not toLocaleDateString) so the format stays consistent
// across locales/platforms, e.g. "Sat, 29 Nov 2025".
function formatReminderDate(date: Date): string {
  const weekday = WEEKDAY_LABELS[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTH_LABELS[date.getMonth()];
  return `${weekday}, ${day} ${month} ${date.getFullYear()}`;
}

const TIME_SLOTS = generateTimeSlots();
const slotHeight = controlHeight.lg;
const timeLabelWidth = controlWidth.xl;

// A small set of vivid accent colors kept separate from the app's semantic
// palette, applied at low alpha for the calendar chips so they read as
// eye-catching tints rather than solid blocks. Used as a fallback when a
// device calendar doesn't supply its own color.
const EVENT_COLORS = {
  blue: palette.blue[500],
  purple: "#8B5CF6",
  orange: "#F97316",
  teal: "#14B8A6",
};
const EVENT_COLOR_CYCLE = [
  EVENT_COLORS.blue,
  EVENT_COLORS.purple,
  EVENT_COLORS.orange,
  EVENT_COLORS.teal,
];

// Reuses the same manual AM/PM formatting as generateTimeSlots so event
// times read consistently with the timeline labels.
function formatEventTime(date: Date): string {
  const hour24 = date.getHours();
  const minute = date.getMinutes();
  const period = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")}${period}`;
}

function mapEventToReminderItem(
  event: DeviceCalendarEvent,
  index: number,
): ReminderItem {
  const minutesFromMidnight = event.startDate.getHours() * 60 + event.startDate.getMinutes();
  return {
    id: event.id,
    icon: Calendar01Icon,
    title: event.title,
    subtitle: event.location || event.calendarTitle,
    time: event.allDay ? "All Day" : formatEventTime(event.startDate),
    date: formatReminderDate(event.startDate),
    color: event.calendarColor ?? EVENT_COLOR_CYCLE[index % EVENT_COLOR_CYCLE.length],
    sourceKind: event.sourceKind,
    slotIndex: event.allDay
      ? undefined
      : Math.min(
          SLOTS_PER_DAY - 1,
          Math.floor(minutesFromMidnight / MINUTES_PER_SLOT),
        ),
  };
}

function CalendarTimeline({ reminders }: { reminders: ReminderItem[] }) {
  const scheduled = reminders.filter(
    (reminder) => reminder.slotIndex !== undefined,
  );

  return (
    <View style={styles.timeline}>
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
          sourceKind={reminder.sourceKind}
          style={[
            styles.eventBar,
            { top: (reminder.slotIndex ?? 0) * slotHeight + spacing.xs },
          ]}
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data, isLoading } = useDeviceCalendarEvents(selectedDate);
  const reminders = useMemo(
    () => (data?.events ?? []).map(mapEventToReminderItem),
    [data],
  );
  const permissionDenied = data?.permissionGranted === false;

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
        <MayaMessageCard
          message={`Hey Robert, you have ${reminders.length} reminder${reminders.length === 1 ? "" : "s"} pending for today! You can check the list below.`}
        />

        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>Open Reminders</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{reminders.length}</Text>
            </View>
          </View>
          <Pressable
            style={styles.dateRow}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {formatReminderDate(selectedDate)}
            </Text>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={iconSize.md}
              color={colors.textSecondary}
            />
          </Pressable>
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

        {permissionDenied ? (
          <View style={styles.emptyStateWrapper}>
            <RemindersEmptyState
              title="Calendar access needed"
              subtitle="Allow calendar access in Settings to see your events here."
            />
          </View>
        ) : isLoading ? (
          <ReminderListShimmer />
        ) : reminders.length === 0 ? (
          <View style={styles.emptyStateWrapper}>
            <RemindersEmptyState
              title="No reminders for this day"
              subtitle="You're all caught up — nothing on your calendars for this day."
            />
          </View>
        ) : view === "list" ? (
          <View style={styles.list}>
            {reminders.map((reminder) => (
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
                sourceKind={reminder.sourceKind}
              />
            ))}
          </View>
        ) : (
          <CalendarTimeline reminders={reminders} />
        )}
      </ScrollView>

      <PopupMenu
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
      >
        <View style={styles.datePicker}>
          <CalendarDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            onDone={() => setShowDatePicker(false)}
          />
        </View>
      </PopupMenu>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  container: {
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  datePicker: {
    alignItems: "center",
    padding: spacing.lg,
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
  emptyStateWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  timeline: {
    position: "relative",
    height: TIME_SLOTS.length * slotHeight,
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
  eventBar: {
    left: timeLabelWidth + spacing.md,
    height: slotHeight - spacing.xs * 2,
  },
});
