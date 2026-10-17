import mayaAvatar from "@/assets/images/avatars/maya-avatar-large.png";
import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import {
  avatarSize,
  colors,
  controlHeight,
  fontSize,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

const ringSize = controlHeight["3xl"];
const ringStrokeWidth = 4;
const ringRadius = (ringSize - ringStrokeWidth) / 2;
const ringCircumference = 2 * Math.PI * ringRadius;

interface SetupHeaderProps {
  mutedTitle: string;
  title: string;
  progress: number;
}

export function SetupHeader({ mutedTitle, title, progress }: SetupHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        <Text style={styles.titleMuted}>{mutedTitle}</Text>
        {title}
      </Text>
      <View style={styles.avatar}>
        <Image source={mayaAvatar} style={styles.avatarImage} />
        <Svg width={ringSize} height={ringSize} style={styles.ring}>
          <Circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            stroke={colors.buttonPrimary}
            strokeWidth={ringStrokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${ringCircumference * progress} ${ringCircumference}`}
            fill="none"
            rotation="-90"
            origin={`${ringSize / 2}, ${ringSize / 2}`}
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontFamily: manrope.bold,
    fontSize: fontSize["3xl"],
    lineHeight: lineHeight["3xl"],
    color: colors.textPrimary,
  },
  titleMuted: {
    color: colors.textSecondary,
  },
  avatar: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: ringSize,
    height: ringSize,
  },
  avatarImage: {
    width: avatarSize.xl,
    height: avatarSize.xl,
    borderRadius: avatarSize.xl / 2,
  },
  ring: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
