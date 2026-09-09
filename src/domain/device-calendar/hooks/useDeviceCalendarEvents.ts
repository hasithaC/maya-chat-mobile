import {useQuery} from '@tanstack/react-query';
import * as Calendar from 'expo-calendar';
import {classifyCalendarSource} from '../utils/classify-calendar-source';
import {endOfDay, startOfDay} from '../utils/date-range';
import type {
  DeviceCalendarEvent,
  DeviceCalendarEventsResult,
} from '../types/device-calendar.types';

async function fetchDeviceCalendarEvents(date: Date): Promise<DeviceCalendarEventsResult> {
  const permission = await Calendar.requestCalendarPermissionsAsync();
  if (permission.status !== 'granted') {
    return {permissionGranted: false, events: []};
  }

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const calendarById = new Map(calendars.map(calendar => [calendar.id, calendar]));

  const rawEvents = await Calendar.getEventsAsync(
    calendars.map(calendar => calendar.id),
    startOfDay(date),
    endOfDay(date),
  );

  const events: DeviceCalendarEvent[] = rawEvents.map(event => {
    const calendar = calendarById.get(event.calendarId);

    return {
      id: event.id,
      title: event.title,
      location: event.location,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      allDay: event.allDay,
      calendarTitle: calendar?.title ?? 'Calendar',
      calendarColor: calendar?.color,
      sourceKind: calendar ? classifyCalendarSource(calendar.source) : 'other',
    };
  });

  events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  return {permissionGranted: true, events};
}

// Reads every calendar synced to the device (Google, iCloud, Exchange,
// on-device, etc. — expo-calendar reads from the OS-level calendar
// provider, which already aggregates whatever accounts are synced there;
// there's no separate per-provider API to call) and returns that day's
// events across all of them.
export const useDeviceCalendarEvents = (date: Date) =>
  useQuery({
    queryKey: ['device-calendar-events', date.toDateString()],
    queryFn: () => fetchDeviceCalendarEvents(date),
  });
