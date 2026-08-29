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
  // Contacts and conversation participants come from different id systems
  // (see chats.tsx), so a saved nickname is looked up by phone number.
  contactNameByPhone?: Map<string, string>,
): ConversationDisplay {
  const isMaya = conversation.type === "MAYA";
  const other = conversation.participants.find(
    (participant) => participant.userId !== currentUserId,
  );

  if (isMaya) {
    return {
      title: "Maya - Personal Assistant",
      avatarSource: mayaAvatarLarge,
      otherParticipantId: other?.userId,
    };
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

  const savedName = other && contactNameByPhone?.get(other.user.phone);

  return {
    title: savedName || other?.user.fullName || "Unknown",
    avatarSource:
      other && typeof other.user.avatar === "string"
        ? { uri: other.user.avatar }
        : undefined,
    otherParticipantId: other?.userId,
  };
}
