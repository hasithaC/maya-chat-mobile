import errorImage from "@/assets/images/states/error.png";
import { StyleSheet, View } from "react-native";
import { spacing } from "../../constants/tokens";
import { PrimaryPressable } from "../buttons/PrimaryPressable";
import { EmptyState } from "./EmptyState";

interface ErrorStateProps {
  title: string;
  subtitle: string;
  onRetry: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title,
  subtitle,
  onRetry,
  retryLabel = "Try Again",
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <EmptyState image={errorImage} title={title} subtitle={subtitle} />
      <PrimaryPressable size="sm" text={retryLabel} onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing["2xl"],
    width: "100%",
    paddingHorizontal: spacing.xl,
  },
});
