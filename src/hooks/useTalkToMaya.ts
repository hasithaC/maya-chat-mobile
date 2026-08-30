import { router } from "expo-router";
import { useCallback } from "react";
import { ROUTES } from "../constants/routes";
import { useConversations } from "../domain/conversations/hooks/conversations.hooks";

// Switches to the Chats tab and opens the existing Maya conversation, or
// sends the user to train Maya first if no such conversation exists yet.
export function useTalkToMaya() {
  const { data: conversations } = useConversations();

  return useCallback(() => {
    const mayaConversation = conversations?.find(
      (conversation) => conversation.type === "MAYA",
    );

    router.push(ROUTES.chats);

    if (mayaConversation) {
      router.push(ROUTES.conversation(String(mayaConversation.id)));
    } else {
      router.push(ROUTES.trainMaya);
    }
  }, [conversations]);
}
