import { BubbleChatAddIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useEffect, useRef, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  avatarSize,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  geist,
  getAvatarColor,
  iconSize,
  lineHeight,
  manrope,
  minHitSlop,
  spacing,
} from "../../constants/tokens";

interface ContactListItemProps {
  avatarSource?: ImageSourcePropType;
  id?: string | number;
  name: string;
  phone?: string;
  email?: string;
  query?: string;
  onPress?: () => void;
  showDivider?: boolean;
  // Shows a trailing "start chat" icon button that pulses while pending.
  onStartChat?: () => void | Promise<void>;
}

function PulsingActionButton({
  icon,
  onPress,
}: {
  icon: IconSvgElement;
  onPress: () => void | Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pending) {
      scale.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    return () => loop.stop();
  }, [pending, scale]);

  const handlePress = async () => {
    if (pending) return;
    setPending(true);
    try {
      await onPress();
    } finally {
      setPending(false);
    }
  };

  return (
    <Pressable
      style={styles.actionButton}
      onPress={handlePress}
      disabled={pending}
      hitSlop={minHitSlop}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <HugeiconsIcon icon={icon} size={iconSize.sm} color={colors.textInverse} />
      </Animated.View>
    </Pressable>
  );
}

function HighlightedName({ name, query }: { name: string; query?: string }) {
  const index = query ? name.toLowerCase().indexOf(query.toLowerCase()) : -1;

  if (!query || index === -1) {
    return (
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    );
  }

  const before = name.slice(0, index);
  const match = name.slice(index, index + query.length);
  const after = name.slice(index + query.length);

  return (
    <Text style={styles.name} numberOfLines={1}>
      {before}
      <Text style={styles.nameMatch}>{match}</Text>
      {after}
    </Text>
  );
}

export function ContactListItem({
  avatarSource,
  id,
  name,
  phone,
  email,
  query,
  onPress,
  showDivider,
  onStartChat,
}: ContactListItemProps) {
  const avatarColor = getAvatarColor(id != null ? String(id) : name);
  const subtitle = phone || email || "";

  return (
    <Pressable
      style={[styles.container, showDivider !== false && styles.divider]}
      onPress={onPress}
    >
      {avatarSource ? (
        <Image source={avatarSource} style={styles.avatarImage} />
      ) : (
        <View style={[styles.avatarFallback, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarInitial}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <HighlightedName name={name} query={query} />
        <Text style={styles.phone}>{subtitle}</Text>
      </View>

      {onStartChat ? (
        <PulsingActionButton icon={BubbleChatAddIcon} onPress={onStartChat} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  divider: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.border,
  },
  avatarImage: {
    width: avatarSize.lg,
    height: avatarSize.lg,
    borderRadius: avatarSize.lg / 2,
  },
  avatarFallback: {
    width: avatarSize.lg,
    height: avatarSize.lg,
    borderRadius: avatarSize.lg / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontFamily: manrope.bold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textInverse,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  nameMatch: {
    fontFamily: manrope.bold,
    color: colors.textAccent,
  },
  phone: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  actionButton: {
    width: controlHeight.xs,
    height: controlHeight.xs,
    borderRadius: controlHeight.xs / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.buttonPrimary,
  },
});
