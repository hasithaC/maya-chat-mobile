import * as Calendar from 'expo-calendar';
import {endOfDay, startOfDay} from './date-range';

export async function getModifiableCalendars(): Promise<Calendar.Calendar[]> {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  return calendars.filter(calendar => calendar.allowsModifications);
}

// Best-effort duplicate guard — matches on a trimmed, case-insensitive
// title within the same calendar day, across every calendar on the device
// (the target calendar hasn't been chosen yet at this point in the flow).
export async function hasDuplicateEventOnDay(
  title: string,
  date: Date,
): Promise<boolean> {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  if (calendars.length === 0) {
    return false;
  }

  const events = await Calendar.getEventsAsync(
    calendars.map(calendar => calendar.id),
    startOfDay(date),
    endOfDay(date),
  );

  const normalizedTitle = title.trim().toLowerCase();
  return events.some(
    event => (event.title ?? '').trim().toLowerCase() === normalizedTitle,
  );
}

export function createDeviceCalendarEvent(
  calendarId: string,
  details: {title: string; startDate: Date; endDate: Date},
): Promise<string> {
  return Calendar.createEventAsync(calendarId, details);
}
