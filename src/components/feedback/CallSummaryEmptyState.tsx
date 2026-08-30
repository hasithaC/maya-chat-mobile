import emptyCallSummaryImage from "@/assets/images/states/empty-call-summary.png";
import { EmptyState } from "./EmptyState";

interface CallSummaryEmptyStateProps {
  title: string;
  subtitle: string;
}

export function CallSummaryEmptyState({ title, subtitle }: CallSummaryEmptyStateProps) {
  return <EmptyState image={emptyCallSummaryImage} title={title} subtitle={subtitle} />;
}
