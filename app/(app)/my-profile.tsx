import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackHeader,
  PrimaryPressable,
  PrimaryTextInput,
} from "../../src/components";
import {
  avatarSize,
  colors,
  iconSize,
  spacing,
} from "../../src/constants/tokens";
import { useAuthStore } from "../../src/domain/auth/store/auth.store";

export default function MyProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();
  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };

  const email = typeof user?.email === "string" ? user.email : "";

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <BackHeader title="My Profile" />

      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          {typeof user?.avatar === "string" ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <HugeiconsIcon
              icon={UserIcon}
              size={iconSize["5xl"]}
              color={colors.textSecondary}
            />
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fields}>
          <PrimaryTextInput
            leftIcon="person-outline"
            value={user?.fullName ?? ""}
            editable={false}
          />
          <PrimaryTextInput
            leftIcon="call-outline"
            value={user?.phone ?? ""}
            editable={false}
          />
          <PrimaryTextInput
            leftIcon="mail-outline"
            value={email}
            placeholder="Not set"
            disabled
          />
          <PrimaryTextInput
            leftIcon="briefcase-outline"
            value=""
            placeholder="Not set"
            editable={false}
          />
        </View>
      </ScrollView>
      <PrimaryPressable
        text="Edit Profile Details"
        appearance="outline"
        size="md"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  scroll: {
    flex: 1,
  },
  avatarRow: {
    alignItems: "center",
    marginTop: spacing["2xl"],
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: spacing["2xl"],
  },
  avatar: {
    width: avatarSize["2xl"],
    height: avatarSize["2xl"],
    borderRadius: avatarSize["2xl"] / 2,
    backgroundColor: colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  fields: {
    gap: spacing.lg,
  },
});
