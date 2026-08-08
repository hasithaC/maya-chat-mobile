import { Ionicons } from "@expo/vector-icons";
import type { PropsWithChildren, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  iconSize,
  lineHeight,
  minHitSlop,
  primaryFontFamily,
  spacing,
} from "../../constants/tokens";
import { SafeAreaContainer } from "../layout";

interface BottomSheetProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  title?: string;
  header?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  header,
  contentStyle,
  children,
}: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <SafeAreaContainer
            edges={["bottom", "left", "right"]}
            style={styles.sheetContent}
          >
            <View style={styles.handle} />

            {header ??
              (title !== undefined && (
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  <Pressable onPress={onClose} hitSlop={minHitSlop}>
                    <Ionicons
                      name="close-outline"
                      size={iconSize.sm}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>
              ))}

            <View style={[styles.body, contentStyle]}>{children}</View>
          </SafeAreaContainer>
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
    height: "80%",
    backgroundColor: colors.backgroundPrimary,
    borderTopLeftRadius: borderRadius["2xl"],
    borderTopRightRadius: borderRadius["2xl"],
  },
  sheetContent: {
    padding: spacing.lg,
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
    fontFamily: primaryFontFamily.bold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textPrimary,
  },
  body: {
    flex: 1,
    gap: spacing.xl,
  },
});
