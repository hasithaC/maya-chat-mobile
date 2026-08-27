import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import type { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface SelectableOptionButtonProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void | Promise<void>;
  style?: StyleProp<ViewStyle>;
}

export function SelectableOptionButton({
  label,
  selected = false,
  disabled = false,
  onPress,
  style,
}: SelectableOptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const borderProgress = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderProgress, {
      toValue: selected ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selected, borderProgress]);

  useEffect(() => {
    if (!isLoading) {
      shimmer.setValue(0);
      return;
    }

    const sweep = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: false,
        }),
      ]),
    );
    sweep.start();

    return () => sweep.stop();
  }, [isLoading, shimmer]);

  const borderColor = borderProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderAccent],
  });

  const gradientStartX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-1, 1],
  });
  const gradientEndX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const gradientColors = isLoading
    ? ([colors.buttonSecondary, colors.buttonSecondaryDisabled] as const)
    : selected
      ? ([colors.buttonSecondary, colors.buttonSecondary] as const)
      : ([colors.buttonSecondaryDisabled, colors.buttonSecondaryDisabled] as const);

  const handlePress = (event: GestureResponderEvent) => {
    const result = onPress?.(event);
    if (result instanceof Promise) {
      setIsLoading(true);
      result.finally(() => setIsLoading(false));
    }
  };

  return (
    <View style={[styles.wrapper, style]}>
      <AnimatedPressable
        onPress={handlePress}
        disabled={disabled || isLoading}
        style={[styles.button, { borderColor }]}
      >
        <AnimatedLinearGradient
          colors={gradientColors}
          start={{ x: gradientStartX, y: 0 } as unknown as { x: number; y: number }}
          end={{ x: gradientEndX, y: 0 } as unknown as { x: number; y: number }}
          style={StyleSheet.absoluteFill}
        />
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.label}>
          {label}
        </Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  button: {
    height: spacing["3xl"],
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  label: {
    fontFamily: manrope.medium,
    lineHeight: lineHeight.xs,
    fontSize: fontSize.xs,
    color: colors.textPrimary,
  },
});
