import {useCallback, useRef, useState} from 'react';
import * as Calendar from 'expo-calendar';
import {useQueryClient} from '@tanstack/react-query';
import {sendMessage} from '../../../core/socket/chat-socket';
import {showToast} from '../../../core/toast/toast.store';
import {useAuthStore} from '../../auth/store/auth.store';
import {conversationsApi} from '../../conversations/api/conversations.api';
import type {ConversationMessage} from '../../conversations/types/conversations.types';
import {
  createDeviceCalendarEvent,
  getModifiableCalendars,
  hasDuplicateEventOnDay,
} from '../../device-calendar/utils/calendar-writer';
import type {CallSummaryAction} from '../types/calls.types';

const EVENT_DURATION_MS = 60 * 60 * 1000;

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

// Dispatches a tap on an AI-suggested action surfaced on the call summary
// screen. Two action types are understood today (CHAT, EVENT); anything
// else is a no-op — new action types can be added as new branches here
// without touching the card UI that calls dispatch().
export function useCallSummaryActionDispatch() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [pickerCalendars, setPickerCalendars] = useState<Calendar.Calendar[] | null>(
    null,
  );
  const pickerResolveRef = useRef<((calendar: Calendar.Calendar | null) => void) | null>(
    null,
  );

  const pickCalendar = useCallback(
    (calendars: Calendar.Calendar[]) =>
      new Promise<Calendar.Calendar | null>(resolve => {
        pickerResolveRef.current = resolve;
        setPickerCalendars(calendars);
      }),
    [],
  );

  const handlePickerSelect = useCallback((calendar: Calendar.Calendar) => {
    pickerResolveRef.current?.(calendar);
    pickerResolveRef.current = null;
    setPickerCalendars(null);
  }, []);

  const handlePickerCancel = useCallback(() => {
    pickerResolveRef.current?.(null);
    pickerResolveRef.current = null;
    setPickerCalendars(null);
  }, []);

  const dispatchChatAction = useCallback(async (action: CallSummaryAction) => {
    const conversationId = action.payload.conversationId;
    const accessToken = useAuthStore.getState().accessToken;
    if (!conversationId || !accessToken) {
      return;
    }

    setLoading(true);
    try {
      const conversation = await conversationsApi.getConversation(conversationId);
      const content =
        typeof action.payload.content === 'string' && action.payload.content
          ? action.payload.content
          : action.label;
      const targetConversationId = String(conversation.id);
      const tempId = `temp-${Date.now()}`;
      const currentUserId = useAuthStore.getState().user?.id ?? '';

      // The target conversation may not be mounted (it isn't the one this
      // action was surfaced in), so there's no screen-local state to add an
      // optimistic bubble to — write straight into its query cache instead,
      // the same cache key useConversationMessages reads from once opened.
      const optimisticMessage: ConversationMessage = {
        id: -Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        conversationId: conversation.id,
        senderId: currentUserId,
        type: 'TEXT',
        status: 'SENT',
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
      queryClient.setQueryData<ConversationMessage[]>(
        ['conversations', targetConversationId, 'messages'],
        old => [...(old ?? []), optimisticMessage],
      );

      sendMessage({
        conversationId: targetConversationId,
        content,
        tempId,
        type: 'TEXT',
      });
    } catch (error) {
      showToast(
        getErrorMessage(error, 'Could not send this message. Please try again.'),
        'error',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const dispatchEventAction = useCallback(
    async (action: CallSummaryAction) => {
      const title =
        typeof action.payload.title === 'string' ? action.payload.title.trim() : '';
      const dateValue =
        typeof action.payload.date === 'string' ? action.payload.date : '';
      if (!title || !dateValue) {
        showToast(
          'This action is missing the details needed to create an event.',
          'error',
        );
        return;
      }

      setLoading(true);
      try {
        // requestCalendarPermissionsAsync grants both read and write access
        // to device calendars in one call on both iOS and Android — there's
        // no separate write-scoped permission to request.
        const permission = await Calendar.requestCalendarPermissionsAsync();
        if (permission.status !== 'granted') {
          showToast('Calendar access is required to schedule this event.', 'error');
          return;
        }

        const startDate = new Date(dateValue);
        if (Number.isNaN(startDate.getTime())) {
          showToast('This event has an invalid date.', 'error');
          return;
        }
        const endDate = new Date(startDate.getTime() + EVENT_DURATION_MS);

        if (startDate.getTime() < Date.now()) {
          showToast('This event is scheduled in the past.', 'warning');
          return;
        }

        const isDuplicate = await hasDuplicateEventOnDay(title, startDate);
        if (isDuplicate) {
          showToast(`An event titled "${title}" already exists on that day.`, 'warning');
          return;
        }

        const calendars = await getModifiableCalendars();
        if (calendars.length === 0) {
          showToast('No calendar on this device can be modified.', 'error');
          return;
        }

        const chosenCalendar = await pickCalendar(calendars);
        if (!chosenCalendar) {
          return;
        }

        await createDeviceCalendarEvent(chosenCalendar.id, {title, startDate, endDate});
        showToast('Event added to your calendar.', 'success');
      } catch (error) {
        console.error('[call-summary] failed to schedule event from action', error);
        showToast(
          getErrorMessage(error, 'Something went wrong while scheduling this event.'),
          'error',
        );
      } finally {
        setLoading(false);
      }
    },
    [pickCalendar],
  );

  const dispatch = useCallback(
    async (action: CallSummaryAction) => {
      if (action.actionType === 'CHAT') {
        await dispatchChatAction(action);
        return;
      }
      if (action.actionType === 'EVENT') {
        await dispatchEventAction(action);
        return;
      }
      // Unknown action type — intentionally a no-op.
    },
    [dispatchChatAction, dispatchEventAction],
  );

  return {
    dispatch,
    loading,
    calendarPicker: {
      calendars: pickerCalendars,
      onSelect: handlePickerSelect,
      onCancel: handlePickerCancel,
    },
  };
}
