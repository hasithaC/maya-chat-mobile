import type * as ExpoCalendar from "expo-calendar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  borderWidth,
  colors,
  fontSize,
  geist,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";
import { classifyCalendarSource } from "../../domain/device-calendar/utils/classify-calendar-source";
import { CalendarSourceBadge } from "../cards/CalendarSourceBadge";
import { PopupMenu } from "./PopupMenu";

interface CalendarPickerSheetProps {
  calendars: ExpoCalendar.Calendar[] | null;
  onSelect: (calendar: ExpoCalendar.Calendar) => void;
  onCancel: () => void;
}

// Lets the user choose which device calendar an AI-suggested event gets
// saved to, instead of silently picking one for them.
export function CalendarPickerSheet({
  calendars,
  onSelect,
  onCancel,
}: CalendarPickerSheetProps) {
  return (
    <PopupMenu visible={calendars != null} onClose={onCancel}>
      <View style={styles.container}>
        <Text style={styles.title}>Add to which calendar?</Text>
        {(calendars ?? []).map((calendar, index) => (
          <Pressable
            key={calendar.id}
            style={[
              styles.row,
              index < (calendars?.length ?? 0) - 1 && styles.rowDivider,
            ]}
            onPress={() => onSelect(calendar)}
          >
            <CalendarSourceBadge sourceKind={classifyCalendarSource(calendar.source)} />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {calendar.title}
              </Text>
              <Text style={styles.rowSubtitle} numberOfLines={1}>
                {calendar.source.name}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </PopupMenu>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  title: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.border,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  rowTitle: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  rowSubtitle: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
});
