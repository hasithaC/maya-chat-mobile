import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MailThreadListItem,
  PrimaryPressable,
  PrimarySearchInput,
  TabHeader,
  type MailThreadParticipant,
} from "../../../src/components";
import {
  borderRadius,
  colors,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  minHitSlop,
  spacing,
} from "../../../src/constants/tokens";
import { useTalkToMaya } from "../../../src/hooks/useTalkToMaya";

interface MailThread {
  id: string;
  title: string;
  summary: string;
  participants: MailThreadParticipant[];
  newThreadsCount?: number;
  pinned?: boolean;
}

const THREADS: MailThread[] = [
  {
    id: "maya-assistant",
    title: "Maya - Personal Assistant",
    summary:
      "Quick summary of the latest updates and next steps shared in the conversation.",
    participants: [
      { id: "you", name: "You" },
      { id: "maya", name: "Maya (PA)" },
    ],
    pinned: true,
  },
  {
    id: "high-core-threads",
    title: "High Core Threads - Group",
    summary:
      "Quick summary of the latest updates and next steps shared in the conversation.",
    participants: [
      { id: "you", name: "You" },
      { id: "kate", name: "Kate Roberts" },
      { id: "maya", name: "Maya (PA)" },
    ],
    newThreadsCount: 2,
  },
  {
    id: "budget-planning",
    title: "Budget & Planning Review",
    summary:
      "A few points were raised about cost breakdowns and upcoming planning milestones.",
    participants: [
      { id: "you", name: "You" },
      { id: "adam", name: "Adam Sopheres" },
      { id: "kate", name: "Kate Roberts" },
    ],
  },
];

export default function MailsScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = { paddingTop: Math.max(insets.top, spacing.lg) };
  const handleTalkToMaya = useTalkToMaya();
  const [searchQuery, setSearchQuery] = useState("");
  const [syncBannerVisible, setSyncBannerVisible] = useState(true);

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <View style={styles.content}>
        <TabHeader title="Email Threads" onCtaPress={handleTalkToMaya} />
        <PrimarySearchInput
          placeholder="Search for threads"
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
        {syncBannerVisible ? (
          <View style={styles.syncBanner}>
            <View>
              <Pressable
                style={styles.syncCloseButton}
                onPress={() => setSyncBannerVisible(false)}
                hitSlop={minHitSlop}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={iconSize.xs}
                  color={colors.textSecondary}
                />
              </Pressable>
              <Text style={styles.syncText}>
                We found a few new messages. Sync your inbox to load the latest
                threads.
              </Text>
            </View>
            <View style={styles.syncButtonWrapper}>
              <PrimaryPressable
                size="sm"
                text="Sync Now"
                onPress={() => setSyncBannerVisible(false)}
              />
            </View>
          </View>
        ) : null}

        <View>
          {THREADS.map((thread, index) => (
            <MailThreadListItem
              key={thread.id}
              title={thread.title}
              summary={thread.summary}
              participants={thread.participants}
              newThreadsCount={thread.newThreadsCount}
              pinned={thread.pinned}
              showDivider={index < THREADS.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    gap: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  syncBanner: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  syncCloseButton: {
    alignSelf: "flex-end",
  },
  syncText: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  syncButtonWrapper: {
    alignSelf: "flex-end",
  },
});
