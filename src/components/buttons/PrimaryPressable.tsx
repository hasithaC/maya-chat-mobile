import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  lineHeight,
  primaryFontFamily,
  spacing,
} from "../../constants/tokens";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface PrimaryPressableProps {
  text: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  appearance?: "default" | "inverted";
}

export function PrimaryPressable({
  text,
  onPress,
  disabled = false,
  appearance = "default",
}: PrimaryPressableProps) {
  const [loading, setLoading] = useState(false);
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading) {
      shimmer.setValue(0);
      return;
    }

    const sweep = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: false,
        }),
      ]),
    );
    sweep.start();

    return () => sweep.stop();
  }, [loading, shimmer]);

  const baseColor =
    appearance === "default" ? colors.buttonPrimary : colors.backgroundPrimary;
  const backgroundColor = disabled ? colors.buttonPrimaryMuted : baseColor;
  const textColor =
    appearance === "default" ? colors.textInverse : colors.textPrimary;

  const gradientColors = loading
    ? ([backgroundColor, colors.buttonPrimaryMuted] as const)
    : ([backgroundColor, backgroundColor] as const);

  const gradientStartX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-1, 1],
  });
  const gradientEndX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const handlePress = async () => {
    try {
      setLoading(true);
      await onPress();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        disabled={disabled || loading}
        onPress={handlePress}
        style={styles.pressable}
      >
        <AnimatedLinearGradient
          colors={gradientColors}
          start={{ x: gradientStartX, y: 0 } as unknown as { x: number; y: number }}
          end={{ x: gradientEndX, y: 0 } as unknown as { x: number; y: number }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: controlHeight.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  text: {
    fontFamily: primaryFontFamily.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    textAlign: "center",
  },
});
