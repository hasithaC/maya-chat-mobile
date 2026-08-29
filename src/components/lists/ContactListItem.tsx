import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  avatarColors,
  avatarSize,
  borderWidth,
  colors,
  fontSize,
  geist,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

interface ContactListItemProps {
  avatarSource?: ImageSourcePropType;
  name: string;
  phone: string;
  query?: string;
  onPress?: () => void;
  showDivider?: boolean;
}

function colorForName(name: string) {
  const sum = Array.from(name).reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );
  return avatarColors[sum % avatarColors.length];
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
  name,
  phone,
  query,
  onPress,
}: ContactListItemProps) {
  const avatarColor = colorForName(name);

  return (
    <Pressable style={[styles.container, styles.divider]} onPress={onPress}>
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
        <Text style={styles.phone}>{phone}</Text>
      </View>
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
    width: avatarSize.md,
    height: avatarSize.md,
    borderRadius: avatarSize.md / 2,
  },
  avatarFallback: {
    width: avatarSize.md,
    height: avatarSize.md,
    borderRadius: avatarSize.md / 2,
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
});
