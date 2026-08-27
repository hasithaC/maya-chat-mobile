import { BubbleChatIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ConversationListItem,
  FilterChip,
  PopupMenu,
  PrimarySearchInput,
  SheetOptionRow,
  TabHeader,
} from "../../../src/components";
import {
  borderRadius,
  colors,
  controlHeight,
  fontSize,
  lineHeight,
  manrope,
  spacing,
} from "../../../src/constants/tokens";
import { ROUTES } from "../../../src/constants/routes";

type ChatFilter = "maya" | "all" | "work" | "groups";

const FILTERS: { key: ChatFilter; label: string }[] = [
  { key: "maya", label: "Maya" },
  { key: "all", label: "All Chats" },
  { key: "work", label: "Work" },
  { key: "groups", label: "Groups" },
];

const CHATS = [
  {
    id: "maya-pa",
    title: "Maya - Personal Assistant",
    time: "16.04",
    message: "Maya: Shared the updated mockups. Please review.",
    pinned: true,
    unreadCount: 1,
  },
  {
    title: "Design Team - Group",
    time: "16.04",
    message: "Olivia: Shared the updated mockups. Please review.",
    online: true,
    unreadCount: 5,
  },
  {
    title: "Threads Finding",
    time: "15.41",
    message:
      "You: We've finalized the test results. Let's confirm the next steps.",
  },
  {
    title: "Production & QC - Group",
    time: "15.20",
    message: "Peter: The new samples look good. Waiting for your approval.",
    online: true,
  },
  {
    title: "Management Updates - Group",
    time: "13.01",
    message: "You: Please check the timeline document. Added the changes.",
  },
  {
    title: "Supplier Coordination - Group",
    time: "11.33",
    message: "James: We received the revised quotation. Need your sign-off.",
  },
];

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = { paddingTop: Math.max(insets.top, spacing.lg) };
  const [filter, setFilter] = useState<ChatFilter>("all");
  const [newSheetVisible, setNewSheetVisible] = useState(false);

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <View style={styles.content}>
        <TabHeader
          title="My Chats"
          trailing={
            <Pressable
              style={styles.newButton}
              onPress={() => setNewSheetVisible(true)}
            >
              <Text style={styles.newButtonText}>New</Text>
            </Pressable>
          }
        />
        <PrimarySearchInput
          placeholder="Search for contacts & groups"
          onSearch={() => {}}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map(({ key, label }) => (
            <FilterChip
              key={key}
              label={label}
              selected={filter === key}
              onPress={() => setFilter(key)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {CHATS.map((chat, index) => (
          <ConversationListItem
            key={chat.title}
            title={chat.title}
            time={chat.time}
            message={chat.message}
            online={chat.online}
            pinned={chat.pinned}
            unreadCount={chat.unreadCount}
            showDivider={index < CHATS.length - 1}
            onPress={
              chat.id ? () => router.push(ROUTES.conversation(chat.id)) : undefined
            }
          />
        ))}
      </ScrollView>

      <PopupMenu
        visible={newSheetVisible}
        onClose={() => setNewSheetVisible(false)}
      >
        <SheetOptionRow
          icon={BubbleChatIcon}
          title="New Contact"
          description="Send a message to your contact"
          onPress={() => {
            setNewSheetVisible(false);
            router.push(ROUTES.addContacts);
          }}
        />
        <SheetOptionRow
          icon={UserGroupIcon}
          title="New Group"
          description="Create a group by adding your community"
          onPress={() => setNewSheetVisible(false)}
        />
      </PopupMenu>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xs,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  newButton: {
    paddingHorizontal: spacing.lg,
    height: controlHeight.sm,
    justifyContent: "center",
    borderRadius: controlHeight.sm / 2,
    backgroundColor: colors.buttonPrimary,
  },
  newButtonText: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textInverse,
  },
  filters: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: spacing.lg,
  },
});
