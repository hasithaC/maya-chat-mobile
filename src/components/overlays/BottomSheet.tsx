import { Ionicons } from "@expo/vector-icons";
import type { PropsWithChildren, ReactNode } from "react";
import type { DimensionValue, StyleProp, ViewStyle } from "react-native";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  iconSize,
  lineHeight,
  minHitSlop,
  manrope,
  spacing,
} from "../../constants/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  title?: string;
  header?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  // Fixed height for sheets whose content size varies (e.g. a filterable
  // list) — without it, the sheet hugs its content and shrinks when there's
  // little of it, which looks broken for a list that's meant to stay put.
  height?: DimensionValue;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  header,
  contentStyle,
  height,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const isFixedHeight = height !== undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, isFixedHeight && { height }]}>
          <View
            style={[
              styles.sheetContent,
              isFixedHeight && styles.sheetContentFill,
              { paddingBottom: Math.max(spacing.lg, insets.bottom) },
            ]}
          >
            <View style={styles.handle} />

            {header ??
              (title !== undefined && (
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  <Pressable onPress={onClose} hitSlop={minHitSlop}>
                    <Ionicons
                      name="close-outline"
                      size={iconSize.lg}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>
              ))}

            <View style={[styles.body, isFixedHeight && styles.bodyFill, contentStyle]}>
              {children}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: "80%",
    backgroundColor: colors.backgroundPrimary,
    borderTopLeftRadius: borderRadius["2xl"],
    borderTopRightRadius: borderRadius["2xl"],
  },
  sheetContent: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: "auto",
    padding: spacing.lg,
  },
  sheetContentFill: {
    flexGrow: 1,
    flexBasis: 0,
  },
  handle: {
    alignSelf: "center",
    width: spacing["5xl"],
    height: borderWidth.thick,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  title: {
    flex: 1,
    fontFamily: manrope.bold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textPrimary,
  },
  body: {
    flexShrink: 1,
    gap: spacing.xl,
  },
  bodyFill: {
    flex: 1,
  },
});
