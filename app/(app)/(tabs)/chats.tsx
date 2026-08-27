import { BubbleChatIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import mayaAvatarLarge from "@/assets/images/avatars/maya-avatar-large.png";
import emptyConversationImage from "@/assets/images/states/empty-conversation.png";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Reanimated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import {
  ChatsShimmer,
  ConversationListItem,
  EmptyState,
  ErrorState,
  FilterChip,
  NoSearchResults,
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
import { useAuthStore } from "../../../src/domain/auth/store/auth.store";
import { useConversations } from "../../../src/domain/conversations/hooks/conversations.hooks";
import type { Conversation } from "../../../src/domain/conversations/types/conversations.types";
import { useFadeTransition } from "../../../src/hooks/useFadeTransition";

type ChatFilter = "maya" | "all" | "work" | "groups";

const FILTERS: { key: ChatFilter; label: string }[] = [
  { key: "maya", label: "Maya" },
  { key: "all", label: "All Chats" },
  { key: "work", label: "Work" },
  { key: "groups", label: "Groups" },
];

function matchesFilter(conversation: Conversation, filter: ChatFilter): boolean {
  switch (filter) {
    case "maya":
      return conversation.type === "MAYA";
    case "groups":
      return conversation.isGroup;
    case "work":
    case "all":
    default:
      return true;
  }
}

function formatTime(iso: unknown): string {
  if (typeof iso !== "string") {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getConversationDisplay(
  conversation: Conversation,
  currentUserId?: string,
) {
  const isMaya = conversation.type === "MAYA";

  if (isMaya) {
    return { title: "Maya - Personal Assistant", avatarSource: mayaAvatarLarge };
  }

  if (conversation.isGroup) {
    return {
      title:
        typeof conversation.name === "string" ? conversation.name : "Group chat",
      avatarSource:
        typeof conversation.avatar === "string"
          ? { uri: conversation.avatar }
          : undefined,
    };
  }

  const other = conversation.participants.find(
    (participant) => participant.userId !== currentUserId,
  )?.user;

  return {
    title: other?.fullName ?? "Unknown",
    avatarSource:
      other && typeof other.avatar === "string"
        ? { uri: other.avatar }
        : undefined,
  };
}

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = { paddingTop: Math.max(insets.top, spacing.lg) };
  const [filter, setFilter] = useState<ChatFilter>("all");
  const [newSheetVisible, setNewSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUserId = useAuthStore((state) => state.user?.id);
  const {
    data: conversations,
    isPending,
    isError,
    refetch,
  } = useConversations();
  const { loadingOpacity, contentOpacity } = useFadeTransition({
    isLoading: isPending,
  });

  const displayConversations = useMemo(
    () =>
      (conversations ?? []).map((conversation) => ({
        conversation,
        ...getConversationDisplay(conversation, currentUserId),
      })),
    [conversations, currentUserId],
  );

  const categoryConversations = displayConversations.filter(({ conversation }) =>
    matchesFilter(conversation, filter),
  );

  const query = searchQuery.trim().toLowerCase();
  const filteredConversations = query
    ? categoryConversations.filter(
        ({ title, conversation }) =>
          title.toLowerCase().includes(query) ||
          (typeof conversation.lastMessagePreview === "string" &&
            conversation.lastMessagePreview.toLowerCase().includes(query)),
      )
    : categoryConversations;

  const selectedFilterLabel = FILTERS.find(({ key }) => key === filter)?.label ?? "";

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
          value={searchQuery}
          onChangeText={setSearchQuery}
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

      <View style={styles.body}>
        <Animated.View
          style={[styles.absoluteFill, { opacity: loadingOpacity }]}
          pointerEvents={isPending ? "auto" : "none"}
        >
          <ChatsShimmer />
        </Animated.View>

        <Animated.View style={[styles.body, { opacity: contentOpacity }]}>
          {isError ? (
            <View style={styles.stateContainer}>
              <ErrorState
                title="Something went wrong"
                subtitle="We couldn't load your chats. Please try again."
                onRetry={() => refetch()}
              />
            </View>
          ) : displayConversations.length === 0 ? (
            <View style={styles.stateContainer}>
              <EmptyState
                image={emptyConversationImage}
                title="No conversations yet"
                subtitle="Start a new chat with Maya or add a contact to get going."
              />
            </View>
          ) : filteredConversations.length === 0 ? (
            <View style={styles.stateContainer}>
              <NoSearchResults
                title="No matches found"
                subtitle={
                  query
                    ? `We couldn't find any conversations matching "${searchQuery}".`
                    : `You don't have any conversations under "${selectedFilterLabel}" yet.`
                }
              />
            </View>
          ) : (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {filteredConversations.map(
                ({ conversation, title, avatarSource }, index) => (
                  <Reanimated.View
                    key={conversation.id}
                    layout={LinearTransition}
                    entering={FadeIn}
                    exiting={FadeOut}
                  >
                    <ConversationListItem
                      title={title}
                      avatarSource={avatarSource}
                      time={formatTime(conversation.lastMessageAt)}
                      message={
                        typeof conversation.lastMessagePreview === "string"
                          ? conversation.lastMessagePreview
                          : "No messages yet"
                      }
                      showDivider={index < filteredConversations.length - 1}
                      onPress={() =>
                        router.push(ROUTES.conversation(String(conversation.id)))
                      }
                    />
                  </Reanimated.View>
                ),
              )}
            </ScrollView>
          )}
        </Animated.View>
      </View>

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
  body: {
    flex: 1,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
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
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: spacing.lg,
  },
});
