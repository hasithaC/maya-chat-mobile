import { useMemo, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  type CallDirection,
  CallListItem,
  ContactListItem,
  FilterChip,
  PrimarySearchInput,
  TabHeader,
} from "../../../src/components";
import {
  colors,
  fontSize,
  lineHeight,
  manrope,
  spacing,
} from "../../../src/constants/tokens";
import { useAuthStore } from "../../../src/domain/auth/store/auth.store";
import { useCallHistory } from "../../../src/domain/calls/hooks/calls.hooks";
import type { CallHistory } from "../../../src/domain/calls/types/calls.types";
import { useContacts } from "../../../src/domain/contacts/hooks/contacts.hooks";
import { useTalkToMaya } from "../../../src/hooks/useTalkToMaya";

interface CallLogItem {
  id: string;
  otherUserId: string;
  title: string;
  direction: CallDirection;
  time: string;
  avatarSource?: ImageSourcePropType;
}

type CallFilter = "all" | "answered" | "missed";

const FILTERS: { key: CallFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "answered", label: "Answered" },
  { key: "missed", label: "Missed" },
];

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// A more compact clock time than the shared formatTime util (e.g.
// "2:30 PM" instead of "02:30 PM") — the call row's trailing text has
// little room to spare.
function formatShortTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// Shows just the time for calls made today, otherwise a short relative
// date (e.g. "2nd Aug 22") so older entries stay unambiguous without
// taking up much room in the row.
function formatCallTime(iso: unknown): string {
  if (typeof iso !== "string") return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (isToday) {
    return formatShortTime(date);
  }

  const day = date.getDate();
  const month = MONTH_NAMES_SHORT[date.getMonth()];
  const yearShort = String(date.getFullYear()).slice(-2);
  return `${day}${getOrdinalSuffix(day)} ${month} ${yearShort}`;
}

function getCallDirection(
  call: CallHistory,
  currentUserId: string | undefined,
): CallDirection {
  if (call.status?.toLowerCase().includes("missed")) {
    return "missed";
  }
  return call.callerId === currentUserId ? "outgoing" : "incoming";
}

function mapCallHistoryToItem(
  call: CallHistory,
  currentUserId: string | undefined,
): CallLogItem {
  const isCaller = call.callerId === currentUserId;
  const otherPartyAvatar = isCaller ? call.calleeAvatar : call.callerAvatar;

  return {
    id: String(call.id),
    otherUserId: isCaller ? call.calleeId : call.callerId,
    title: isCaller ? call.calleeName : call.callerName,
    direction: getCallDirection(call, currentUserId),
    time: formatCallTime(call.startedAt),
    avatarSource:
      typeof otherPartyAvatar === "string" && otherPartyAvatar
        ? { uri: otherPartyAvatar }
        : undefined,
  };
}

function matchesFilter(call: CallLogItem, filter: CallFilter): boolean {
  switch (filter) {
    case "answered":
      return call.direction !== "missed";
    case "missed":
      return call.direction === "missed";
    case "all":
    default:
      return true;
  }
}

export default function CallsScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = { paddingTop: Math.max(insets.top, spacing.lg) };
  const handleTalkToMaya = useTalkToMaya();
  const [filter, setFilter] = useState<CallFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: contactsData } = useContacts();
  const contacts = contactsData?.contacts ?? [];
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { data: callHistory } = useCallHistory();

  const calls = useMemo(
    () =>
      (callHistory ?? []).map((call) =>
        mapCallHistoryToItem(call, currentUserId),
      ),
    [callHistory, currentUserId],
  );

  const query = searchQuery.trim().toLowerCase();
  const filteredCalls = useMemo(
    () =>
      calls.filter((call) => matchesFilter(call, filter)).filter((call) =>
        query ? call.title.toLowerCase().includes(query) : true,
      ),
    [calls, filter, query],
  );

  const filteredContacts = useMemo(
    () =>
      query
        ? contacts.filter((contact) => {
            const name = (
              contact.displayName || contact.contactUser.fullName
            ).toLowerCase();
            return (
              name.includes(query) ||
              contact.contactUser.phone?.toLowerCase().includes(query)
            );
          })
        : contacts,
    [contacts, query],
  );

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <View style={styles.content}>
        <TabHeader title="Calls" onCtaPress={handleTalkToMaya} />
        <PrimarySearchInput
          placeholder="Search for calls"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={() => {}}
        />

        <View style={styles.filters}>
          {FILTERS.map(({ key, label }) => (
            <FilterChip
              key={key}
              label={label}
              selected={filter === key}
              onPress={() => setFilter(key)}
            />
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCalls.map((call, index) => (
          <CallListItem
            key={call.id}
            id={call.otherUserId}
            title={call.title}
            direction={call.direction}
            time={call.time}
            avatarSource={call.avatarSource}
            showDivider={index < filteredCalls.length - 1}
            onViewSummary={() => {}}
          />
        ))}

        {filteredContacts.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>My Contacts</Text>
            <View>
              {filteredContacts.map((contact, index) => (
                <ContactListItem
                  key={contact.id}
                  id={contact.contactUserId}
                  name={contact.displayName || contact.contactUser.fullName}
                  phone={contact.contactUser.phone}
                  email={contact.contactUser.email}
                  query={searchQuery}
                  avatarSource={
                    contact.contactUser.avatar
                      ? { uri: contact.contactUser.avatar }
                      : undefined
                  }
                  showDivider={index < filteredContacts.length - 1}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    gap: spacing.lg,
  },
  filters: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.lg,
  },
  section: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  sectionLabel: {
    fontFamily: manrope.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
});
