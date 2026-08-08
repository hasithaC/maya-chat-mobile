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
    900: "#04130E"
  },
} as const;

// opacity is 0-1 (e.g. 0.24), not a 0-100 percentage.
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
  backgroundSecondary: palette.surface[200],//verified

  textPrimary: palette.ink[900], //verified
  textSecondary: palette.ink[500], //verified
  textInverse: palette.surface.white,
  textLink: palette.green[600],

  border: palette.border[300], //verified
  borderStrong: palette.border[700],
  borderAccent: palette.green[600], //verified

  buttonPrimary: palette.green[600],
  buttonDanger: palette.red[600],
  buttonDisabled: palette.border[400],
  buttonSecondary: palette.green[100], //verified
  buttonPrimaryMuted: palette.green[500], //verified
  buttonSecondaryDisabled: palette.border[100], //verified

  success: palette.green[600],
  warning: palette.amber[500],
  error: palette.red[600],
  info: palette.blue[500],

  overlay: withAlpha(palette.surface[900], 0.16),
} as const;
