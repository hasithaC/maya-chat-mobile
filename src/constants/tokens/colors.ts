// Raw swatches from the Figma "used colors" dump, grouped by hue and
// deduplicated (near-identical exports of the same swatch, and opacity
// variants, were collapsed to one representative hex each).
export const palette = {
  green: {
    50: "#F2FDF9",
    100: "#EDFCF8",
    200: "#CAECE2",
    300: "#AFE9D7",
    400: "#77F8D2",
    500: "#26D9A0",
    600: "#1CAE81",
    700: "#18956F",
    800: "#11694E",
    900: "#03664F",
  },
  red: {
    50: "#FEF1F1",
    100: "#FCE6E3",
    300: "#DE6A68",
    600: "#EC221F",
    800: "#A52531",
  },
  amber: {
    100: "#FFF1CC",
    300: "#FBD177",
    500: "#FFBF18",
    700: "#F5B100",
  },
  blue: {
    100: "#ECF4FD",
    300: "#519EF6",
    500: "#2F80ED",
    600: "#0088FF",
    900: "#222B59",
  },
  ink: {
    300: "#767F7F",
    400: "#646867",
    500: "#A1A5A4",
    600: "#505352",
    700: "#3B3F3F",
    800: "#333333",
    900: "#03120D",
  },
  border: {
    100: "#EFF0F0",
    200: "#E0E1E1",
    300: "#F3F3F5",
    400: "#CBCDCC",
    500: "#B5BABA",
    700: "#A1A5A4",
    900: "#8D9190",
  },
  surface: {
    white: "#FFFFFF",
    black: "#000000",
    50: "#FCFDFD",
    100: "#F3F3F5",
    200: "#F7F8F8",
    300: "#F4F5F5",
    900: "#04130E",
  },
} as const;

// Dedicated palette for avatar-color cycling (fallback initials), kept
// separate from `palette` since it doesn't belong to any semantic hue scale.
// 45 neon colors spread evenly around the hue wheel (alternating lightness
// for extra variety) so avatar-initial text stays legible on top.
export const avatarColors = [
  "#EF0606",
  "#D12005",
  "#EF4406",
  "#D15705",
  "#EF8206",
  "#D18D05",
  "#EFC006",
  "#D1C305",
  "#DFEF06",
  "#A8D105",
  "#A1EF06",
  "#72D105",
  "#63EF06",
  "#3CD105",
  "#25EF06",
  "#05D105",
  "#06EF25",
  "#05D13C",
  "#06EF63",
  "#05D172",
  "#06EFA1",
  "#05D1A8",
  "#06EFDF",
  "#05C3D1",
  "#06C0EF",
  "#058DD1",
  "#0682EF",
  "#0557D1",
  "#0644EF",
  "#0520D1",
  "#0606EF",
  "#2005D1",
  "#4406EF",
  "#5705D1",
  "#8206EF",
  "#8D05D1",
  "#C006EF",
  "#C305D1",
  "#EF06DF",
  "#D105A8",
  "#EF06A1",
  "#D10572",
  "#EF0663",
  "#D1053C",
  "#EF0625",
] as const;

// Deterministically picks an avatar color for a given identity. Prefer a
// stable id (user id, conversation id) over a display name/title so the
// color doesn't shift if that name changes later.
export function getAvatarColor(seed: string): string {
  const sum = Array.from(seed).reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );
  return avatarColors[sum % avatarColors.length];
}

export function withAlpha(hex: string, opacity: number): string {
  const normalized = hex.replace("#", "");
  const alpha = Math.round(Math.min(Math.max(opacity, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
  return `#${normalized}${alpha}`;
}

export const colors = {
  backgroundPrimary: palette.surface.white, //verified
  backgroundSecondary: palette.surface[300], //verified
  backgroundSecondaryStrong: palette.border[400],
  backgroundTertiary: palette.surface[200],
  backgroundAccent: palette.green[200],
  backgroundAccentStrong: palette.green[400],
  backgroundInverse: palette.surface.black,
  backgroundInverseSecondary: withAlpha(palette.surface.white, 0.2),
  scrim: withAlpha(palette.surface.black, 0.4),

  textPrimary: palette.ink[900], //verified
  textSecondary: palette.ink[500], //verified
  textInverse: palette.surface.white,
  textInverseSecondary: withAlpha(palette.surface.white, 0.6),
  textLink: palette.green[900],
  textAccent: palette.green[600],
 
  border: palette.border[300], //verified
  borderStrong: palette.border[700],
  borderAccent: palette.green[600], //verified
  borderInverse: palette.surface.white,

  buttonPrimary: palette.green[600],
  buttonDanger: palette.red[600],
  buttonDisabled: palette.border[400],
  buttonSecondary: palette.green[100], //verified
  buttonPrimaryMuted: palette.green[500], //verified
  buttonSecondaryDisabled: palette.border[100], //verified

  success: palette.green[600],
  warning: palette.amber[700],
  error: palette.red[600],
  info: palette.blue[500],

  overlay: withAlpha(palette.surface[900], 0.16),
} as const;
