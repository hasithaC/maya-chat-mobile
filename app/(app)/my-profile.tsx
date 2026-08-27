import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackHeader,
  PrimaryPressable,
  PrimaryTextInput,
} from "../../src/components";
import {
  avatarSize,
  colors,
  iconSize,
  spacing,
} from "../../src/constants/tokens";

export default function MyProfileScreen() {
  const [name, setName] = useState("Robert Williams");
  const [phone, setPhone] = useState("+94 75 123 4567");
  const [department, setDepartment] = useState("Information Technology");
  const insets = useSafeAreaInsets();
  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <BackHeader title="My Profile" />

      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <HugeiconsIcon
            icon={UserIcon}
            size={iconSize["5xl"]}
            color={colors.textSecondary}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fields}>
          <PrimaryTextInput
            leftIcon="person-outline"
            value={name}
            onChangeText={setName}
            editable={false}
          />
          <PrimaryTextInput
            leftIcon="call-outline"
            value={phone}
            onChangeText={setPhone}
            editable={false}
          />
          <PrimaryTextInput
            leftIcon="mail-outline"
            value="robertwilliams88@gmail.com"
            onChangeText={() => {}}
            disabled
          />
          <PrimaryTextInput
            leftIcon="briefcase-outline"
            value={department}
            onChangeText={setDepartment}
            editable={false}
          />
        </View>
      </ScrollView>
      <PrimaryPressable
        text="Edit Profile Details"
        appearance="outline"
        size="md"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  scroll: {
    flex: 1,
  },
  avatarRow: {
    alignItems: "center",
    marginTop: spacing["2xl"],
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: spacing["2xl"],
  },
  avatar: {
    width: avatarSize["2xl"],
    height: avatarSize["2xl"],
    borderRadius: avatarSize["2xl"] / 2,
    backgroundColor: colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  fields: {
    gap: spacing.lg,
  },
});
