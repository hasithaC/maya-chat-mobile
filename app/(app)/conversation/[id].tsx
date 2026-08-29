import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import mayaAvatar from "@/assets/images/avatars/maya-avatar.png";
import emptyThreadImage from "@/assets/images/states/empty-conversation-thread.png";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import type { ReactNode } from "react";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ImageSourcePropType, ListRenderItemInfo } from "react-native";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ConversationHeader,
  ConversationShimmer,
  DateSeparator,
  EmptyState,
  ErrorState,
  MessageBubble,
  MessageCard,
  MessageGroup,
  MessageInputBar,
  PrimaryPressable,
  VoiceNotePlayer,
  type MessageReadStatus,
} from "../../../src/components";
import {
  colors,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  minHitSlop,
  spacing,
} from "../../../src/constants/tokens";
import { ROUTES } from "../../../src/constants/routes";
import { useAuthStore } from "../../../src/domain/auth/store/auth.store";
import {
  useConversation,
  useConversationMessages,
} from "../../../src/domain/conversations/hooks/conversations.hooks";
import type {
  Action,
  Attachment,
  ConversationMessage,
} from "../../../src/domain/conversations/types/conversations.types";
import { getConversationDisplay } from "../../../src/domain/conversations/utils/conversation-display";
import { useContacts } from "../../../src/domain/contacts/hooks/contacts.hooks";
import { useAttachmentDraftStore } from "../../../src/domain/attachments/store/attachment-draft.store";
import { uploadAttachment } from "../../../src/domain/attachments/utils/upload-attachment";
import {
  joinConversation,
  leaveConversation,
  markMessageRead,
  offMessageAck,
  offMessageError,
  offMessageStatusUpdate,
  offReadReceipt,
  offReceiveMessage,
  offUserTyping,
  onMessageAck,
  onMessageError,
  onMessageStatusUpdate,
  onReadReceipt,
  onReceiveMessage,
  onUserTyping,
  requestOnlineUsers,
  sendMessage,
  sendTyping,
  updateMessageStatus,
  type MessageAckPayload,
  type MessageErrorPayload,
  type MessageReadReceiptPayload,
  type MessageStatusUpdatePayload,
} from "../../../src/core/socket/chat-socket";
import { usePresenceStore } from "../../../src/core/socket/presence.store";
import { useFadeTransition } from "../../../src/hooks/useFadeTransition";
import { formatDateLabel, formatTime } from "../../../src/utils/date";

type Segment =
  | { kind: "date"; id: string; label: string }
  | { kind: "outgoing"; id: string; message: ConversationMessage }
  | {
      kind: "incoming";
      id: string;
      senderId: string;
      messages: ConversationMessage[];
    };

function buildSegments(
  messages: ConversationMessage[],
  currentUserId?: string,
): Segment[] {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const segments: Segment[] = [];
  let lastDayKey: string | null = null;

  for (const message of sorted) {
    const dayKey = message.createdAt.slice(0, 10);
    if (dayKey !== lastDayKey) {
      segments.push({
        kind: "date",
        id: `date-${dayKey}`,
        label: formatDateLabel(message.createdAt),
      });
      lastDayKey = dayKey;
    }

    if (message.senderId === currentUserId) {
      segments.push({ kind: "outgoing", id: `msg-${message.id}`, message });
      continue;
    }

    const last = segments[segments.length - 1];
    if (last?.kind === "incoming" && last.senderId === message.senderId) {
      last.messages.push(message);
    } else {
      segments.push({
        kind: "incoming",
        id: `group-${message.id}`,
        senderId: message.senderId,
        messages: [message],
      });
    }
  }

  return segments;
}

function isImageAttachment(attachment: Attachment) {
  return attachment.type?.toLowerCase().includes("image");
}

function isVoiceAttachment(attachment: Attachment) {
  const type = attachment.type?.toLowerCase() ?? "";
  return type.includes("audio") || type.includes("voice");
}

function handleActionPress(action: Action) {
  if (action.actionType === "CHAT" && action.payload.conversationId != null) {
    router.push(ROUTES.conversation(String(action.payload.conversationId)));
  }
}

function ActionCard({ action }: { action: Action }) {
  const isPrimary = action.priority === "PRIMARY";
  const children: ReactNode[] = [];

  if (action.payload.isVoiceNote && action.payload.audioUrl) {
    children.push(
      <VoiceNotePlayer key="voice" audioUrl={action.payload.audioUrl} />,
    );
  }

  if (
    typeof action.payload.content === "string" &&
    action.payload.content.length > 0
  ) {
    children.push(
      <Text key="content" style={styles.cardText}>
        {action.payload.content}
      </Text>,
    );
  }

  if (isPrimary) {
    children.push(
      <PrimaryPressable
        key="button"
        text={action.label}
        size="sm"
        onPress={() => handleActionPress(action)}
      />,
    );
  } else {
    children.push(
      <Text key="label" style={styles.cardText}>
        {action.label}
      </Text>,
    );
  }

  return <MessageCard>{children}</MessageCard>;
}

function getReadStatus(
  message: ConversationMessage,
  pendingStatus?: "sending" | "failed",
): MessageReadStatus | undefined {
  if (pendingStatus === "sending") return "sending";
  if (pendingStatus === "failed") return undefined;
  if (message.readAt) return "read";
  if (message.status?.toUpperCase() === "DELIVERED") return "delivered";
  return "sent";
}

function MessageWithActions({
  message,
  variant,
  pendingStatus,
  onRetry,
}: {
  message: ConversationMessage;
  variant: "incoming" | "outgoing";
  pendingStatus?: "sending" | "failed";
  onRetry?: () => void;
}) {
  const images = (message.attachments ?? [])
    .filter(isImageAttachment)
    .map((attachment) => attachment.url);
  const voiceAttachment = (message.attachments ?? []).find(isVoiceAttachment);
  const actions = message.metadata?.ai?.actions ?? [];

  return (
    <Fragment>
      <View style={pendingStatus === "sending" ? styles.sendingBubble : undefined}>
        <MessageBubble
          variant={variant}
          text={message.content}
          time={formatTime(message.createdAt)}
          images={images.length > 0 ? images : undefined}
          voiceUrl={voiceAttachment?.url}
          readStatus={
            variant === "outgoing"
              ? getReadStatus(message, pendingStatus)
              : undefined
          }
        />
      </View>
      {pendingStatus === "failed" ? (
        <Pressable onPress={onRetry} style={styles.retryRow}>
          <Text style={styles.retryText}>Failed to send · Tap to retry</Text>
        </Pressable>
      ) : null}
      {actions.map((action) => (
        <ActionCard key={action.id} action={action} />
      ))}
    </Fragment>
  );
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
  };
  const inputBarInsetStyle = {
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };
  const [draft, setDraft] = useState("");
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [pendingStatusById, setPendingStatusById] = useState<
    Map<number, "sending" | "failed">
  >(new Map());
  const isTypingRef = useRef(false);
  const stopTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTempIdRef = useRef<Map<string, number>>(new Map());
  const markedReadIdsRef = useRef<Set<number>>(new Set());
  const pendingUploadRef = useRef<
    Map<number, { localUri: string; fileName: string; contentType: string }[]>
  >(new Map());
  const listRef = useRef<FlatList<Segment>>(null);

  const currentUserId = useAuthStore((state) => state.user?.id);
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);
  const queryClient = useQueryClient();
  const { data: conversation, isPending: isConversationPending } = useConversation(id);
  const { data: contactsData } = useContacts();
  const contactNameByUserId = useMemo(
    () =>
      new Map(
        (contactsData?.contacts ?? []).map((contact) => [
          String(contact.contactUserId),
          contact.displayName,
        ]),
      ),
    [contactsData],
  );
  const {
    data: messages,
    isPending,
    isError,
    refetch,
  } = useConversationMessages(id);
  const { loadingOpacity, contentOpacity } = useFadeTransition({
    isLoading: isPending,
    loadingDuration: 250,
  });

  useEffect(() => {
    if (!id) return;
    joinConversation(id);
    requestOnlineUsers();
    return () => {
      leaveConversation(id);
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const messagesQueryKey = ["conversations", id, "messages"];

    const handleAck = (ack: MessageAckPayload) => {
      const knownId = pendingTempIdRef.current.get(ack.tempId);
      if (knownId == null) return;

      const resolvedId = ack.messageId ?? knownId;
      const status =
        typeof ack.status === "string" ? ack.status : undefined;

      queryClient.setQueryData<ConversationMessage[]>(messagesQueryKey, (old) =>
        (old ?? []).map((message) =>
          message.id === knownId || message.id === resolvedId
            ? {
                ...message,
                id: resolvedId,
                status: status ?? message.status,
                readAt:
                  status?.toUpperCase() === "READ"
                    ? new Date().toISOString()
                    : message.readAt,
              }
            : message,
        ),
      );

      // The server appears to re-emit 'message_ack' for the same tempId as
      // the message moves through SENT/DELIVERED/READ, so keep the mapping
      // pointed at the real id instead of deleting it after the first ack.
      pendingTempIdRef.current.set(ack.tempId, resolvedId);

      setPendingStatusById((prev) => {
        const next = new Map(prev);
        next.delete(knownId);
        next.delete(resolvedId);
        return next;
      });
    };

    const handleError = (err: MessageErrorPayload) => {
      const optimisticId = err.tempId
        ? pendingTempIdRef.current.get(err.tempId)
        : undefined;
      if (optimisticId == null) return;
      setPendingStatusById((prev) => new Map(prev).set(optimisticId, "failed"));
    };

    const handleReceive = (message: ConversationMessage) => {
      if (String(message.conversationId) !== id) return;
      // Our own sent messages are reconciled via message_ack instead, so we
      // don't end up with both an optimistic bubble and a duplicate real one.
      if (message.senderId === currentUserId) return;

      queryClient.setQueryData<ConversationMessage[]>(messagesQueryKey, (old) => {
        const existing = old ?? [];
        if (existing.some((m) => m.id === message.id)) return existing;
        return [...existing, message];
      });

      // The conversation is open on screen, so the message is delivered and
      // read as soon as it arrives.
      updateMessageStatus({ messageId: message.id, status: "delivered" });
      markMessageRead(message.id);
      markedReadIdsRef.current.add(message.id);
    };

    const handleStatusUpdate = (data: MessageStatusUpdatePayload) => {
      queryClient.setQueryData<ConversationMessage[]>(messagesQueryKey, (old) =>
        (old ?? []).map((message) =>
          message.id === data.messageId
            ? { ...message, status: data.status }
            : message,
        ),
      );
    };

    const handleReadReceipt = (data: MessageReadReceiptPayload) => {
      queryClient.setQueryData<ConversationMessage[]>(messagesQueryKey, (old) =>
        (old ?? []).map((message) =>
          message.id === data.messageId
            ? { ...message, status: "READ", readAt: data.readAt ?? new Date().toISOString() }
            : message,
        ),
      );
    };

    onMessageAck(handleAck);
    onMessageError(handleError);
    onReceiveMessage(handleReceive);
    onMessageStatusUpdate(handleStatusUpdate);
    onReadReceipt(handleReadReceipt);

    return () => {
      offMessageAck(handleAck);
      offMessageError(handleError);
      offReceiveMessage(handleReceive);
      offMessageStatusUpdate(handleStatusUpdate);
      offReadReceipt(handleReadReceipt);
    };
  }, [id, currentUserId, queryClient]);

  useEffect(() => {
    if (isPending) return;
    const timeout = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: false });
    }, 0);
    return () => clearTimeout(timeout);
  }, [isPending, id]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    messages.forEach((message) => {
      if (message.senderId === currentUserId) return;
      if (message.readAt) return;
      if (markedReadIdsRef.current.has(message.id)) return;

      markedReadIdsRef.current.add(message.id);
      markMessageRead(message.id);
    });
  }, [messages, currentUserId]);

  const handleSend = useCallback(() => {
    const content = draft.trim();
    if (!content || !id) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticId = -Date.now();
    const optimisticMessage: ConversationMessage = {
      id: optimisticId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      conversationId: Number(id),
      senderId: currentUserId ?? "",
      type: "TEXT",
      status: "SENDING",
      content,
      attachments: [],
      metadata: undefined,
      isEdited: false,
      editedAt: null,
      isPinned: false,
      pinnedAt: null,
      deliveredAt: null,
      readAt: null,
    };

    pendingTempIdRef.current.set(tempId, optimisticId);
    queryClient.setQueryData<ConversationMessage[]>(
      ["conversations", id, "messages"],
      (old) => [...(old ?? []), optimisticMessage],
    );
    setPendingStatusById((prev) => new Map(prev).set(optimisticId, "sending"));
    setDraft("");
    sendMessage({ conversationId: id, content, tempId, type: "TEXT" });
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, [draft, id, currentUserId, queryClient]);

  const sendImageAttachment = useCallback(
    async (optimisticId: number, conversationId: string) => {
      const pendingList = pendingUploadRef.current.get(optimisticId);
      if (!pendingList || pendingList.length === 0) return;

      const messagesQueryKey = ["conversations", conversationId, "messages"];
      const caption =
        queryClient
          .getQueryData<ConversationMessage[]>(messagesQueryKey)
          ?.find((message) => message.id === optimisticId)?.content ?? "";

      const results = await Promise.all(
        pendingList.map((pending) =>
          uploadAttachment(
            pending.localUri,
            pending.contentType,
            Number(conversationId),
            pending.fileName,
          ),
        ),
      );

      if (results.some((result) => !result.success)) {
        setPendingStatusById((prev) => new Map(prev).set(optimisticId, "failed"));
        return;
      }

      const uploadedAttachments: Attachment[] = results.map((result, index) => ({
        url: (result as { success: true; url: string }).url,
        type: "IMAGE",
        name: pendingList[index].fileName,
        size: 0,
      }));

      const tempId = `temp-${Date.now()}`;
      pendingTempIdRef.current.set(tempId, optimisticId);

      queryClient.setQueryData<ConversationMessage[]>(messagesQueryKey, (old) =>
        (old ?? []).map((message) =>
          message.id === optimisticId
            ? { ...message, attachments: uploadedAttachments }
            : message,
        ),
      );

      sendMessage({
        conversationId,
        content: caption,
        tempId,
        type: "IMAGE",
        attachments: uploadedAttachments,
      });
    },
    [queryClient],
  );

  const handleSendImages = useCallback(
    (assets: ImagePicker.ImagePickerAsset[], caption: string) => {
      if (!id || assets.length === 0) return;

      const optimisticId = -Date.now();
      const pendingList = assets.map((asset, index) => ({
        localUri: asset.uri,
        fileName: asset.fileName ?? `image-${Date.now()}-${index}.jpg`,
        contentType: asset.mimeType ?? "image/jpeg",
      }));

      const optimisticMessage: ConversationMessage = {
        id: optimisticId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        conversationId: Number(id),
        senderId: currentUserId ?? "",
        type: "IMAGE",
        status: "SENDING",
        content: caption,
        attachments: assets.map((asset, index) => ({
          url: asset.uri,
          type: "IMAGE",
          name: pendingList[index].fileName,
          size: asset.fileSize ?? 0,
        })),
        metadata: undefined,
        isEdited: false,
        editedAt: null,
        isPinned: false,
        pinnedAt: null,
        deliveredAt: null,
        readAt: null,
      };

      pendingUploadRef.current.set(optimisticId, pendingList);
      queryClient.setQueryData<ConversationMessage[]>(
        ["conversations", id, "messages"],
        (old) => [...(old ?? []), optimisticMessage],
      );
      setPendingStatusById((prev) => new Map(prev).set(optimisticId, "sending"));
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));

      sendImageAttachment(optimisticId, id);
    },
    [id, currentUserId, queryClient, sendImageAttachment],
  );

  const handlePickImage = useCallback(async () => {
    if (!id) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      // Android's default multi-select picker needs Android 13+ (or 11-12
      // with a Google Play system update) and silently degrades to
      // single-select where that's unavailable — the legacy picker works
      // consistently across all Android versions.
      legacy: true,
    });
    if (result.canceled || result.assets.length === 0) return;

    // Android's legacy picker (needed above for reliable multi-select)
    // hardcodes an "any file type" intent internally and only hints at
    // images via MIME type — some file-browser apps ignore that hint, so
    // filter out anything that isn't actually an image.
    const imageAssets = result.assets.filter((asset) =>
      (asset.mimeType ?? "").startsWith("image/"),
    );
    if (imageAssets.length === 0) return;

    useAttachmentDraftStore.getState().setPickedAssets(id, imageAssets);
    router.push(ROUTES.attachmentPreview);
  }, [id]);

  const attachmentSendRequest = useAttachmentDraftStore((state) => state.sendRequest);

  useEffect(() => {
    if (!attachmentSendRequest || attachmentSendRequest.conversationId !== id) return;
    handleSendImages(attachmentSendRequest.assets, attachmentSendRequest.caption);
    useAttachmentDraftStore.getState().clearSendRequest();
  }, [attachmentSendRequest, id, handleSendImages]);

  const handleRetry = useCallback(
    (message: ConversationMessage) => {
      if (!id) return;

      if (pendingUploadRef.current.has(message.id)) {
        setPendingStatusById((prev) => new Map(prev).set(message.id, "sending"));
        sendImageAttachment(message.id, id);
        return;
      }

      const tempId = `temp-${Date.now()}`;
      pendingTempIdRef.current.set(tempId, message.id);
      setPendingStatusById((prev) => new Map(prev).set(message.id, "sending"));
      sendMessage({
        conversationId: id,
        content: message.content,
        tempId,
        type: message.type,
      });
    },
    [id, sendImageAttachment],
  );

  useEffect(() => {
    setTypingUserId(null);

    const handleUserTyping = (data: {
      userId: string;
      conversationId?: string;
      isTyping: boolean;
    }) => {
      if (data.userId === currentUserId) return;
      if (data.conversationId && data.conversationId !== id) return;

      setTypingUserId(data.isTyping ? data.userId : null);
    };

    onUserTyping(handleUserTyping);
    return () => offUserTyping(handleUserTyping);
  }, [id, currentUserId]);

  useEffect(() => {
    return () => {
      if (stopTypingTimeoutRef.current) {
        clearTimeout(stopTypingTimeoutRef.current);
      }
      if (isTypingRef.current && id) {
        sendTyping(id, false);
      }
    };
  }, [id]);

  const handleDraftChange = (text: string) => {
    setDraft(text);
    if (!id) return;

    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
      stopTypingTimeoutRef.current = null;
    }

    if (text.length === 0) {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        sendTyping(id, false);
      }
      return;
    }

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTyping(id, true);
    }

    stopTypingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendTyping(id, false);
    }, 2000);
  };

  const header = conversation
    ? getConversationDisplay(conversation, currentUserId, contactNameByUserId)
    : { title: "Chat", avatarSource: undefined };

  const participantsById = useMemo(() => {
    const map = new Map<
      string,
      { name: string; avatarSource?: ImageSourcePropType }
    >();
    conversation?.participants.forEach((participant) => {
      const isMayaSender =
        conversation.type === "MAYA" && participant.userId !== currentUserId;
      map.set(participant.userId, {
        name: participant.user.fullName,
        avatarSource: isMayaSender
          ? mayaAvatar
          : typeof participant.user.avatar === "string"
            ? { uri: participant.user.avatar }
            : undefined,
      });
    });
    return map;
  }, [conversation, currentUserId]);

  const segments = useMemo(
    () => buildSegments(messages ?? [], currentUserId),
    [messages, currentUserId],
  );

  const renderSegment = useCallback(
    ({ item: segment }: ListRenderItemInfo<Segment>) => {
      if (segment.kind === "date") {
        return <DateSeparator label={segment.label} />;
      }

      if (segment.kind === "outgoing") {
        return (
          <MessageWithActions
            message={segment.message}
            variant="outgoing"
            pendingStatus={pendingStatusById.get(segment.message.id)}
            onRetry={() => handleRetry(segment.message)}
          />
        );
      }

      const sender = participantsById.get(segment.senderId);

      return (
        <MessageGroup
          avatarSource={sender?.avatarSource}
          userId={segment.senderId}
          name={sender?.name ?? "Unknown"}
        >
          {segment.messages.map((message) => (
            <MessageWithActions
              key={message.id}
              message={message}
              variant="incoming"
            />
          ))}
        </MessageGroup>
      );
    },
    [participantsById, pendingStatusById, handleRetry],
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{...containerInsetStyle,paddingHorizontal: spacing.lg,}}>
          <ConversationHeader
            avatarSource={header.avatarSource}
            id={header.otherParticipantId ?? conversation?.id}
            title={header.title}
            status={
              typingUserId
                ? `${participantsById.get(typingUserId)?.name ?? "Someone"} is typing…`
                : conversation?.isGroup
                  ? "Group"
                  : header.otherParticipantId &&
                      onlineUserIds.has(header.otherParticipantId)
                    ? "Online"
                    : "Offline"
            }
            loading={isConversationPending}
            trailing={
              <Pressable style={styles.moreButton} hitSlop={minHitSlop}>
                <HugeiconsIcon
                  icon={MoreVerticalIcon}
                  size={iconSize.md}
                  color={colors.textPrimary}
                />
              </Pressable>
            }
          />
        </View>

        <View style={{...styles.body,backgroundColor: colors.backgroundTertiary}}>
          <Animated.View
            style={[styles.absoluteFill, { opacity: loadingOpacity }]}
            pointerEvents={isPending ? "auto" : "none"}
          >
            <ConversationShimmer />
          </Animated.View>

          <Animated.View style={[styles.body, { opacity: contentOpacity }]}>
            {isError ? (
              <View style={styles.stateContainer}>
                <ErrorState
                  title="Something went wrong"
                  subtitle="We couldn't load this conversation. Please try again."
                  onRetry={() => refetch()}
                />
              </View>
            ) : messages && messages.length === 0 ? (
              <View style={styles.stateContainer}>
                <EmptyState
                  image={emptyThreadImage}
                  title="No messages yet"
                  subtitle="Send a message to start the conversation."
                />
              </View>
            ) : (
              <FlatList
                ref={listRef}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                data={segments}
                keyExtractor={(segment) => segment.id}
                renderItem={renderSegment}
                onContentSizeChange={() =>
                  listRef.current?.scrollToEnd({ animated: false })
                }
              />
            )}
          </Animated.View>
        </View>

        <View style={{...inputBarInsetStyle, paddingHorizontal: spacing.lg,}}>
          <MessageInputBar
            value={draft}
            onChangeText={handleDraftChange}
            onSend={handleSend}
            onCameraPress={handlePickImage}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  moreButton: {
    marginLeft: "auto",
  },
  keyboardView: {
    flex: 1,
    gap: spacing.xs,
    
  },
  body: {
    flex: 1,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  scroll: {
    flex: 1,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  cardText: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  sendingBubble: {
    opacity: 0.6,
  },
  retryRow: {
    alignSelf: "flex-end",
  },
  retryText: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.error,
  },
});
