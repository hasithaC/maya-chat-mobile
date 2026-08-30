// Which account family a device calendar belongs to, used to pick a badge
// icon. Classified from expo-calendar's Source.name/type — see
// classifyCalendarSource — since neither platform gives a single reliable
// "this is a Google calendar" flag.
export type CalendarSourceKind = "google" | "apple" | "device" | "other";

export interface DeviceCalendarEvent {
  id: string;
  title: string;
  location: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  calendarTitle: string;
  calendarColor?: string;
  sourceKind: CalendarSourceKind;
}

export interface DeviceCalendarEventsResult {
  permissionGranted: boolean;
  events: DeviceCalendarEvent[];
}
