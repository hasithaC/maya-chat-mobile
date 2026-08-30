import emptyRemindersImage from "@/assets/images/states/empty-reminders.png";
import { EmptyState } from "./EmptyState";

interface RemindersEmptyStateProps {
  title: string;
  subtitle: string;
}

export function RemindersEmptyState({ title, subtitle }: RemindersEmptyStateProps) {
  return <EmptyState image={emptyRemindersImage} title={title} subtitle={subtitle} />;
}
