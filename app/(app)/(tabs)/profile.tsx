import { WhatsappIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  PrimarySearchInput,
  ProfileSummaryCard,
  SettingsRow,
  TabHeader,
} from "../../../src/components";
import {
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  lineHeight,
  manrope,
  palette,
  spacing,
} from "../../../src/constants/tokens";
import { ROUTES } from "../../../src/constants/routes";
import { useAuthStore } from "../../../src/domain/auth/store/auth.store";
import { useTalkToMaya } from "../../../src/hooks/useTalkToMaya";

export default function ProfileScreen() {
  const logout = useAuthStore((s) => s.logout);
  const insets = useSafeAreaInsets();
  const containerInsetStyle = { paddingTop: Math.max(insets.top, spacing.lg) };
  const handleTalkToMaya = useTalkToMaya();

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <View style={styles.content}>
        <TabHeader title="Profile & More" onCtaPress={handleTalkToMaya} />
        <PrimarySearchInput
          placeholder="Search for profile, settings and more"
          onSearch={() => {}}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.push(ROUTES.myProfile)}>
          <ProfileSummaryCard name="Robert Williams" phone="+94 75 123 4567" />
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Connectors</Text>
          <View style={styles.sectionDivider}>
            <SettingsRow
              icon={WhatsappIcon}
              iconColor={palette.green[600]}
              label="WhatsApp"
              showDivider={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Settings</Text>
          <View style={styles.sectionDivider}>
            <SettingsRow label="Manage Email Address" />
            <SettingsRow label="Change Phone Number" disabled />
            <SettingsRow label="Two-factor Authentication" disabled />
            <SettingsRow label="Delete My Account" showDivider={false} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Privacy</Text>
          <View style={styles.sectionDivider}>
            <SettingsRow label="Last Seen & Online" />
            <SettingsRow label="Blocked Users" />
            <SettingsRow label="Chat Backup" showDivider={false} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Other</Text>
          <View style={styles.sectionDivider}>
            <SettingsRow label="Maya (Personal Assistant)" />
            <SettingsRow label="System Notifications" />
            <SettingsRow
              label="Device Access Permissions"
              showDivider={false}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  sectionDivider: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.border,
  },
  sectionLabel: {
    fontFamily: manrope.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
    textTransform: "uppercase",
  },
  signOutButton: {
    alignItems: "center",
    paddingVertical: spacing.md,
    backgroundColor: colors.buttonDanger,
    borderRadius: borderRadius.full,
  },
  signOutText: {
    fontFamily: manrope.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textInverse,
  },
});
