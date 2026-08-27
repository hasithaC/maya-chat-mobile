import {
  Call02Icon,
  Clock01Icon,
  Image01Icon,
  Mail01Icon,
  Notification01Icon,
  UserIcon,
  Video01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  EventListItem,
  MayaBriefingCard,
  PrimaryPressable,
  PrimarySearchInput,
  SectionCard,
  StatTile,
  TabHeader,
  TaskListItem,
} from "../../../src/components";
import {
  colors,
  fontSize,
  lineHeight,
  palette,
  manrope,
  spacing,
} from "../../../src/constants/tokens";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = { paddingTop: Math.max(insets.top, spacing.lg) };

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <View style={styles.content}>
        <TabHeader title="Home" />
        <PrimarySearchInput
          placeholder="Search for anything..."
          onSearch={() => {}}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MayaBriefingCard
          userName="Shehan"
          upcomingEventsCount={2}
          conferenceCallsCount={1}
          groupCallsCount={1}
          highPriorityTasksCount={3}
          briefingSummary="Before you reply to investor, I've prepared a 2 mins briefing with key context."
        />

        <View style={styles.statsRow}>
          <StatTile
            icon={Notification01Icon}
            color={palette.red[600]}
            count={2}
            label="High Priority"
          />
          <StatTile
            icon={Clock01Icon}
            color={palette.amber[700]}
            count={5}
            label="Can Wait..."
          />
        </View>

        <SectionCard
          title="Needs Your Attention"
          count={7}
          actionLabel="View More"
          footer={<Text style={styles.dragToExpand}>Drag to Expand</Text>}
        >
          <TaskListItem
            icon={Mail01Icon}
            iconColor={palette.red[600]}
            title="Reply to investor"
            subtitle="Email | 2 hrs ago"
            priority="high"
          />
          <TaskListItem
            icon={WhatsappIcon}
            iconColor={palette.green[600]}
            title="Reply to Sam Williams"
            highlight="Sam Williams"
            subtitle="WhatsApp | 2 hrs ago"
            priority="high"
          />
          <TaskListItem
            icon={Image01Icon}
            iconColor={colors.textSecondary}
            title="Approve supplier quotation"
            subtitle="Management Update... | 3 hrs ago"
            priority="high"
          />
          <TaskListItem
            icon={UserIcon}
            iconColor={colors.textSecondary}
            title="Call back Adam Sopheres"
            highlight="Adam Sopheres"
            subtitle="Call | 3 hrs ago"
            priority="medium"
          />
        </SectionCard>

        <SectionCard title="Waiting on Others" count={2}>
          <TaskListItem
            icon={Mail01Icon}
            iconColor={palette.red[600]}
            title="Sam Williams to respond"
            highlight="Sam Williams"
            subtitle="Email | 7 threads | 21 hrs"
            priority="high"
          />
          <TaskListItem
            icon={WhatsappIcon}
            iconColor={palette.green[600]}
            title="Waiting others to response"
            subtitle="WhatsApp | 23 hrs ago"
            priority="high"
          />
          <TaskListItem
            icon={Image01Icon}
            iconColor={colors.textSecondary}
            title="All group members to respond"
            subtitle="Management Up... | 2 replies | 3 hrs"
            priority="high"
          />
        </SectionCard>

        <SectionCard
          title="Upcoming Events"
          count={2}
          footer={
            <PrimaryPressable size="sm" text="Go to Reminders" onPress={() => {}} />
          }
        >
          <EventListItem
            time="08:30AM"
            reminderMinutes={15}
            icon={Video01Icon}
            subtitle="Management Updates - Gro..."
            title="Conference Call"
            participantsCount={5}
          />
          <EventListItem
            time="12:00PM"
            icon={Call02Icon}
            subtitle="Threads Finding"
            title="Voice Call"
            participantsCount={3}
          />
        </SectionCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
      gap: spacing.lg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dragToExpand: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textLink,
  },
});
