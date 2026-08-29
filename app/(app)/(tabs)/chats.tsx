import { BubbleChatIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import emptyConversationImage from "@/assets/images/states/empty-conversation.png";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import { requestOnlineUsers } from "../../../src/core/socket/chat-socket";
import { usePresenceStore } from "../../../src/core/socket/presence.store";
import { useAuthStore } from "../../../src/domain/auth/store/auth.store";
import { useConversations } from "../../../src/domain/conversations/hooks/conversations.hooks";
import type { Conversation } from "../../../src/domain/conversations/types/conversations.types";
import { getConversationDisplay } from "../../../src/domain/conversations/utils/conversation-display";
import { useFadeTransition } from "../../../src/hooks/useFadeTransition";
import { useTalkToMaya } from "../../../src/hooks/useTalkToMaya";
import { formatTime } from "../../../src/utils/date";

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

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = { paddingTop: Math.max(insets.top, spacing.lg) };
  const [filter, setFilter] = useState<ChatFilter>("all");
  const [newSheetVisible, setNewSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUserId = useAuthStore((state) => state.user?.id);
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);
  const {
    data: conversations,
    isPending,
    isError,
    refetch,
  } = useConversations();
  const { loadingOpacity, contentOpacity } = useFadeTransition({
    isLoading: isPending,
    loadingDuration: 250,
  });
  const handleTalkToMaya = useTalkToMaya();

  useEffect(() => {
    requestOnlineUsers();
  }, []);

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
          onCtaPress={handleTalkToMaya}
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
                (
                  { conversation, title, avatarSource, otherParticipantId },
                  index,
                ) => (
                  <Reanimated.View
                    key={conversation.id}
                    layout={LinearTransition}
                    entering={FadeIn.delay(index * 40).duration(250)}
                    exiting={FadeOut}
                  >
                    <ConversationListItem
                      title={title}
                      avatarSource={avatarSource}
                      online={
                        otherParticipantId
                          ? onlineUserIds.has(otherParticipantId)
                          : false
                      }
                      time={formatTime(conversation.lastMessageAt)}
                      message={
                        typeof conversation.lastMessagePreview === "string"
                          ? conversation.lastMessagePreview
                          : "No messages yet"
                      }
                      unreadCount={conversation.unreadCount ?? 0}
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
