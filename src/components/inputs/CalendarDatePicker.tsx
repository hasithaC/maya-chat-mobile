import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
} from "../../constants/tokens";
import { PrimaryPressable } from "../buttons/PrimaryPressable";

interface CalendarDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  // Called after either action button is pressed (confirming the current
  // value, or resetting to today) — lets the parent close whatever it's
  // presenting this picker in.
  onDone?: () => void;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const CELL_COUNT_PER_ROW = 7;
// A month can span at most 6 weeks (e.g. a 31-day month starting on a
// Saturday) — always padding to that many rows keeps the grid's height
// constant as the visible month changes, instead of resizing between 4-6
// rows depending on how the days line up.
const ROW_COUNT = 6;
const CELL_COUNT = CELL_COUNT_PER_ROW * ROW_COUNT;

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

// Returns one calendar grid's worth of cells for the given month — null
// entries pad the leading/trailing days that belong to adjacent months.
function buildCalendarGrid(monthStart: Date): (Date | null)[] {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length < CELL_COUNT) {
    cells.push(null);
  }
  return cells;
}

// A plain JS/RN calendar grid, deliberately not using the native
// @react-native-community/datetimepicker widget — its "spinner" display
// behaved inconsistently on Android, and this renders identically on both
// platforms since it's built entirely from our own components.
export function CalendarDatePicker({
  value,
  onChange,
  onDone,
}: CalendarDatePickerProps) {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1),
  );
  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => buildCalendarGrid(visibleMonth), [visibleMonth]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setVisibleMonth((month) => addMonths(month, -1))}
          hitSlop={minHitSlop}
          style={[styles.navButton, styles.navButtonBack]}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={iconSize.md}
            color={colors.textLink}
          />
        </Pressable>
        <Text style={styles.monthLabel}>
          {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </Text>
        <Pressable
          onPress={() => setVisibleMonth((month) => addMonths(month, 1))}
          hitSlop={minHitSlop}
          style={[styles.navButton, styles.navButtonForward]}
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={iconSize.md}
            color={colors.textLink}
          />
        </Pressable>
      </View>

      <View style={styles.divider} />

      <View style={styles.body}>
        <View style={styles.weekdayRow}>
          {WEEKDAY_LABELS.map((label, index) => (
            <Text key={index} style={styles.weekdayLabel}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {days.map((day, index) => {
            if (!day) {
              return <View key={index} style={styles.cell} />;
            }

            const selected = isSameDay(day, value);
            const isToday = !selected && isSameDay(day, today);

            return (
              <Pressable
                key={index}
                style={styles.cell}
                onPress={() => onChange(day)}
              >
                <View
                  style={[
                    styles.dayCircle,
                    selected && styles.dayCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isToday && styles.dayTextToday,
                      selected && styles.dayTextSelected,
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <PrimaryPressable
            text="Reset to Today"
            appearance="outline"
            size="sm"
            onPress={() => {
              onChange(new Date());
              onDone?.();
            }}
          />
        </View>
        <View style={styles.actionButton}>
          <PrimaryPressable
            text="Set Date"
            size="sm"
            onPress={() => onDone?.()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.xl,
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    width: controlHeight.xs,
    height: controlHeight.xs,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.buttonSecondary,
  },
  navButtonBack: {
    borderTopLeftRadius: controlHeight.xs / 2,
    borderBottomLeftRadius: controlHeight.xs / 2,
    borderTopRightRadius: controlHeight.xs / 4,
    borderBottomRightRadius: controlHeight.xs / 4,
  },
  navButtonForward: {
    borderTopRightRadius: controlHeight.xs / 2,
    borderBottomRightRadius: controlHeight.xs / 2,
    borderTopLeftRadius: controlHeight.xs / 4,
    borderBottomLeftRadius: controlHeight.xs / 4,
  },
  monthLabel: {
    flex: 1,
    textAlign: "center",
    fontFamily: manrope.semiBold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    color: colors.textPrimary,
  },
  body: {
    gap: spacing.md,
  },
  weekdayRow: {
    flexDirection: "row",
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  cell: {
    width: `${80 / CELL_COUNT_PER_ROW}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: controlHeight.xs,
    height: controlHeight.xs,
    borderRadius: controlHeight.xs / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleSelected: {
    backgroundColor: colors.buttonPrimaryMuted,
  },
  dayText: {
    fontFamily: geist.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  dayTextToday: {
    fontFamily: geist.semiBold,
    color: colors.textPrimary,
  },
  dayTextSelected: {
    fontFamily: geist.semiBold,
    color: colors.textInverse,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  divider: {
    height: borderWidth.thin,
    backgroundColor: colors.border,
  },
});
