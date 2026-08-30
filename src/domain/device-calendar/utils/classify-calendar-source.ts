import type { Source } from 'expo-calendar';
import type {CalendarSourceKind} from '../types/device-calendar.types';

// Best-effort heuristic — neither platform exposes a single reliable
// "this account is Google/iCloud" flag on a calendar Source:
// - Android: `source.type` is the raw account type string, e.g. "com.google"
//   for Google accounts, "LOCAL" for on-device calendars.
// - iOS: `source.type` is a SourceType enum (local/caldav/exchange/mobileme/
//   subscribed/birthdays) — both Google and iCloud accounts commonly show up
//   as "caldav", so `source.name` (e.g. "Gmail"/"iCloud") is the only
//   reliable signal there.
export function classifyCalendarSource(source: Source): CalendarSourceKind {
  const name = (source.name ?? '').toLowerCase();
  const type = String(source.type ?? '').toLowerCase();

  if (name.includes('google') || name.includes('gmail') || type.includes('google')) {
    return 'google';
  }

  if (name.includes('icloud') || type.includes('mobileme') || type.includes('icloud')) {
    return 'apple';
  }

  if (type === 'local' || source.isLocalAccount) {
    return 'device';
  }

  return 'other';
}
