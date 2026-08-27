import type { ReactNode } from "react";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  shadows,
  spacing,
} from "../../constants/tokens";

interface MessageCardProps {
  dividers?: boolean;
  children: ReactNode[];
}

export function MessageCard({ dividers = false, children }: MessageCardProps) {
  return (
    <View style={styles.container}>
      {children.map((child, index) => (
        <Fragment key={index}>
          {child}
          {dividers && index < children.length - 1 ? (
            <View style={styles.divider} />
          ) : null}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    width: "85%",
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    backgroundColor: colors.backgroundPrimary,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  divider: {
    height: borderWidth.thin,
    backgroundColor: colors.border,
  },
});
