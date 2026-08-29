import mayaAvatarLarge from "@/assets/images/avatars/maya-avatar-large.png";
import type { ImageSourcePropType } from "react-native";
import type { Conversation } from "../types/conversations.types";

export interface ConversationDisplay {
  title: string;
  avatarSource?: ImageSourcePropType;
}

export function getConversationDisplay(
  conversation: Conversation,
  currentUserId?: string,
): ConversationDisplay {
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
