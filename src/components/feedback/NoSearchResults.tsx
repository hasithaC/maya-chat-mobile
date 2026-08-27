import noSearchImage from "@/assets/images/states/no-search-result.png";
import { EmptyState } from "./EmptyState";

interface NoSearchResultsProps {
  title: string;
  subtitle: string;
}

export function NoSearchResults({ title, subtitle }: NoSearchResultsProps) {
  return <EmptyState image={noSearchImage} title={title} subtitle={subtitle} />;
}
