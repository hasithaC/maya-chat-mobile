import { ImageNotFound01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Shimmer, ShimmerProvider } from "react-native-fast-shimmer";
import {
  borderRadius,
  colors,
  fontSize,
  iconSize,
  lineHeight,
  manrope,
  spacing,
  withAlpha,
} from "../../constants/tokens";
import { downloadAttachment } from "../../domain/attachments/utils/download-attachment";

interface MessageImageGridProps {
  images: string[];
}

interface GridImageProps {
  uri: string;
  width: number;
  height: number;
}

const shimmerGray: string[] = [
  colors.backgroundSecondary,
  colors.border,
  colors.backgroundSecondary,
];

function isLocalUri(uri: string) {
  return (
    uri.startsWith("file://") ||
    uri.startsWith("content://") ||
    uri.startsWith("ph://") ||
    uri.startsWith("assets-library://")
  );
}

function GridImage({ uri, width, height }: GridImageProps) {
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const dimensionStyle = {
    width,
    height,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
  };

  useEffect(() => {
    let cancelled = false;
    setLocalUri(null);
    setFailed(false);

    // A locally-picked image (still uploading, or shown optimistically
    // before a real S3 url exists) is already a usable local URI — no
    // presign-download round trip needed.
    if (isLocalUri(uri)) {
      setLocalUri(uri);
      return;
    }

    downloadAttachment(uri).then((result) => {
      if (cancelled) return;
      if (result.success) {
        setLocalUri(result.localUri);
      } else {
        setFailed(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [uri]);

  if (failed) {
    return (
      <View style={[dimensionStyle, styles.fallback]}>
        <HugeiconsIcon
          icon={ImageNotFound01Icon}
          size={iconSize.lg}
          color={colors.textSecondary}
        />
      </View>
    );
  }

  if (!localUri) {
    return (
      <ShimmerProvider duration={1500}>
        <Shimmer style={dimensionStyle} linearGradients={shimmerGray} />
      </ShimmerProvider>
    );
  }

  return (
    <Image
      source={{ uri: localUri }}
      style={dimensionStyle}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

export function MessageImageGrid({ images }: MessageImageGridProps) {
  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return <GridImage uri={images[0]} width={GRID_WIDTH} height={SINGLE_HEIGHT} />;
  }

  if (images.length === 2) {
    return (
      <View style={styles.row}>
        <GridImage uri={images[0]} width={CELL_WIDTH} height={CELL_WIDTH} />
        <GridImage uri={images[1]} width={CELL_WIDTH} height={CELL_WIDTH} />
      </View>
    );
  }

  if (images.length === 3) {
    return (
      <View style={styles.grid}>
        <GridImage uri={images[0]} width={GRID_WIDTH} height={WIDE_HEIGHT} />
        <View style={styles.row}>
          <GridImage uri={images[1]} width={CELL_WIDTH} height={CELL_WIDTH} />
          <GridImage uri={images[2]} width={CELL_WIDTH} height={CELL_WIDTH} />
        </View>
      </View>
    );
  }

  const remaining = images.length - 4;

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <GridImage uri={images[0]} width={CELL_WIDTH} height={CELL_WIDTH} />
        <GridImage uri={images[1]} width={CELL_WIDTH} height={CELL_WIDTH} />
      </View>
      <View style={styles.row}>
        <GridImage uri={images[2]} width={CELL_WIDTH} height={CELL_WIDTH} />
        <View style={styles.quarterWrapper}>
          <GridImage uri={images[3]} width={CELL_WIDTH} height={CELL_WIDTH} />
          {remaining > 0 ? (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>+{remaining}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const GRID_WIDTH = 220;
const CELL_WIDTH = (GRID_WIDTH - spacing.xs) / 2;
const SINGLE_HEIGHT = (GRID_WIDTH * 3) / 4;
const WIDE_HEIGHT = (GRID_WIDTH * 9) / 16;

const styles = StyleSheet.create({
  grid: {
    width: GRID_WIDTH,
    gap: spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  quarterWrapper: {
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  fallback: {
    backgroundColor: colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: withAlpha(colors.textPrimary, 0.5),
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: {
    fontFamily: manrope.medium,
    fontSize: fontSize["3xl"],
    lineHeight: lineHeight["3xl"],
    color: colors.textInverse,
  },
});
