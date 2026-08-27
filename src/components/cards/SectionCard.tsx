import type { ReactNode } from "react";
import { Fragment } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  badgeSize,
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  lineHeight,
  manrope,
  geist,
  shadows,
  spacing,
} from "../../constants/tokens";

interface SectionCardProps {
  title: string;
  count: number;
  actionLabel?: string;
  onActionPress?: () => void;
  footer?: ReactNode;
  children: ReactNode[];
}

export function SectionCard({
  title,
  count,
  actionLabel,
  onActionPress,
  footer,
  children,
}: SectionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </View>
        {actionLabel ? (
          <Pressable onPress={onActionPress}>
            <Text style={styles.action}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.body}>
        {children.map((child, index) => (
          <Fragment key={index}>
            {child}
            {index < children.length - 1 ? (
              <View style={styles.divider} />
            ) : null}
          </Fragment>
        ))}
      </View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  countBadge: {
    minWidth: badgeSize.md,
    height: badgeSize.md,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.full,
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
  action: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textLink,
  },
  body: {
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    backgroundColor: colors.backgroundPrimary,
  },
  divider: {
    height: borderWidth.thin,
    backgroundColor: colors.border,
  },
  footer: {
    padding: spacing.lg,
    alignItems: "center",
  },
});
