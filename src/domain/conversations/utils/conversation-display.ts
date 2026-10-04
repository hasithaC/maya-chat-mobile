import mayaAvatarLarge from "@/assets/images/avatars/maya-avatar-large.png";
import type { ImageSourcePropType } from "react-native";
import type { Conversation } from "../types/conversations.types";

export interface ConversationDisplay {
  title: string;
  avatarSource?: ImageSourcePropType;
  otherParticipantId?: string;
}

export function getConversationDisplay(
  conversation: Conversation,
  currentUserId?: string,
  // Maps a participant's userId to their saved contact nickname.
  contactNameByUserId?: Map<string, string>,
): ConversationDisplay {
  if (conversation.type === "MAYA") {
    return {
      title: "Maya - Personal Assistant",
      avatarSource: mayaAvatarLarge,
    };
  }

  const other = (conversation.participants ?? []).find(
    (participant) => participant.userId !== currentUserId,
  );

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

  const savedName = other && contactNameByUserId?.get(other.userId);

  return {
    title: savedName || other?.user.fullName || "Unknown",
    avatarSource:
      other && typeof other.user.avatar === "string"
        ? { uri: other.user.avatar }
        : undefined,
    otherParticipantId: other?.userId,
  };
}
