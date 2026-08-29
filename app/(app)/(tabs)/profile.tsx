import { WhatsappIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  NoSearchResults,
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

interface SettingsItem {
  label: string;
  icon?: IconSvgElement;
  iconColor?: string;
  disabled?: boolean;
}

interface SettingsSection {
  label: string;
  items: SettingsItem[];
}

const SECTIONS: SettingsSection[] = [
  {
    label: "Connectors",
    items: [
      { label: "WhatsApp", icon: WhatsappIcon, iconColor: palette.green[600] },
    ],
  },
  {
    label: "Account Settings",
    items: [
      { label: "Manage Email Address" },
      { label: "Change Phone Number", disabled: true },
      { label: "Two-factor Authentication", disabled: true },
      { label: "Delete My Account" },
    ],
  },
  {
    label: "Privacy",
    items: [
      { label: "Last Seen & Online" },
      { label: "Blocked Users" },
      { label: "Chat Backup" },
    ],
  },
  {
    label: "Other",
    items: [
      { label: "Maya (Personal Assistant)" },
      { label: "System Notifications" },
      { label: "Device Access Permissions" },
    ],
  },
];

export default function ProfileScreen() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const containerInsetStyle = { paddingTop: Math.max(insets.top, spacing.lg) };
  const handleTalkToMaya = useTalkToMaya();
  const avatarSource =
    typeof user?.avatar === "string" ? { uri: user.avatar } : undefined;
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();
  const filteredSections = useMemo(() => {
    if (!query) return SECTIONS;

    return SECTIONS.map((section) => {
      if (section.label.toLowerCase().includes(query)) return section;
      return {
        ...section,
        items: section.items.filter((item) =>
          item.label.toLowerCase().includes(query),
        ),
      };
    }).filter((section) => section.items.length > 0);
  }, [query]);

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <View style={styles.content}>
        <TabHeader title="Profile & More" onCtaPress={handleTalkToMaya} />
        <PrimarySearchInput
          placeholder="Search for profile, settings and more"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={() => {}}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.push(ROUTES.myProfile)}>
          <ProfileSummaryCard
            name={user?.fullName ?? ""}
            phone={user?.phone ?? ""}
            avatarSource={avatarSource}
          />
        </Pressable>

        {filteredSections.length === 0 ? (
          <NoSearchResults
            title="No matches found"
            subtitle={`We couldn't find any settings matching "${searchQuery}".`}
          />
        ) : (
          filteredSections.map((section) => (
            <View key={section.label} style={styles.section}>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              <View style={styles.sectionDivider}>
                {section.items.map((item, index) => (
                  <SettingsRow
                    key={item.label}
                    icon={item.icon}
                    iconColor={item.iconColor}
                    label={item.label}
                    disabled={item.disabled}
                    showDivider={index < section.items.length - 1}
                  />
                ))}
              </View>
            </View>
          ))
        )}
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
