import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export { deviceWidth, deviceHeight };

export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 56,
  "5xl": 64,
} as const;

export const avatarSize = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  "2xl": 128,
} as const;

export const badgeSize = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export const controlHeight = {
  xs: 32,
  sm: 36,
  md: 44,
  lg: 52,
} as const;

// Apple HIG / Material minimum recommended touch target.
export const minHitSlop = 44;
