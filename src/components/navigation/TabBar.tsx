import {
  CallIcon,
  Home01Icon,
  Mail01Icon,
  Message01Icon,
  Note01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { Route } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  borderRadius,
  colors,
  fontSize,
  iconSize,
  lineHeight,
  manrope,
  shadows,
  spacing,
} from "../../constants/tokens";

const HOME_ROUTE_NAME = "index";

const TAB_ICONS: Record<string, IconSvgElement> = {
  index: Home01Icon,
  profile: UserCircleIcon,
  mails: Mail01Icon,
  remind: Note01Icon,
  calls: CallIcon,
  chats: Message01Icon,
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const homeIndex = state.routes.findIndex(
    (route) => route.name === HOME_ROUTE_NAME,
  );
  const homeRoute: Route<string> | undefined = state.routes[homeIndex];
  const otherRoutes = state.routes.filter(
    (route) => route.name !== HOME_ROUTE_NAME,
  );

  const goToTab = (route: Route<string>) => {
    const isFocused = state.routes[state.index]?.key === route.key;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom || spacing.md }]}
    >
      <View style={styles.pill}>
        {otherRoutes.map((route) => {
          const routeIndex = state.routes.findIndex((r) => r.key === route.key);
          const isFocused = state.index === routeIndex;
          const label = descriptors[route.key]?.options.title ?? route.name;
          const icon = TAB_ICONS[route.name];

          return (
            <Pressable
              key={route.key}
              onPress={() => goToTab(route)}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              {icon && (
                <HugeiconsIcon
                  icon={icon}
                  size={iconSize.lg}
                  color={
                    isFocused ? colors.buttonPrimary : colors.textSecondary
                  }
                />
              )}
              <Text
                style={[styles.label, isFocused && styles.labelActive]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {homeRoute && (
        <Pressable
          onPress={() => goToTab(homeRoute)}
          style={styles.homeContainer}
          accessibilityRole="button"
          accessibilityState={
            state.index === homeIndex ? { selected: true } : {}
          }
        >
          <HugeiconsIcon
            icon={Home01Icon}
            size={iconSize.lg}
            color={
              state.index === homeIndex
                ? colors.buttonPrimary
                : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.label,
              state.index === homeIndex && styles.labelActive,
            ]}
          >
            {descriptors[homeRoute.key]?.options.title ?? homeRoute.name}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xs,
    backgroundColor: colors.backgroundPrimary,
  },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  label: {
    fontFamily: manrope.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.buttonPrimary,
  },
  homeContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
    ...shadows.sm,
  },
});
