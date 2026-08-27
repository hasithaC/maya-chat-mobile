import { Cancel01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackHeader,
  ContactListItem,
  PopupMenu,
  PrimaryPressable,
  PrimarySearchInput,
  PrimaryTextInput,
} from "../../src/components";
import {
  avatarSize,
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  minHitSlop,
  spacing,
} from "../../src/constants/tokens";

interface Contact {
  id: string;
  name: string;
  phone: string;
  section: "In Your Contacts" | "Other Users";
}

const CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Alan Louis",
    phone: "+94 77 000 1234",
    section: "In Your Contacts",
  },
  {
    id: "2",
    name: "Alex Lee",
    phone: "+94 75 123 4567",
    section: "In Your Contacts",
  },
  {
    id: "3",
    name: "Alina Lopez",
    phone: "+94 71 345 6789",
    section: "Other Users",
  },
  {
    id: "4",
    name: "Alvin Lucas",
    phone: "+94 77 987 6543",
    section: "Other Users",
  },
];

const SECTIONS: Contact["section"][] = ["In Your Contacts", "Other Users"];

export default function AddContactsScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };
  const [query, setQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [nickname, setNickname] = useState("");

  const results = CONTACTS.filter(
    (contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.phone.includes(query),
  );

  const handleClosePreview = () => {
    setSelectedContact(null);
    setNickname("");
  };

  const handleAddPerson = () => {
    handleClosePreview();
    router.back();
  };

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <View style={styles.header}>
        <BackHeader
          title="Add Contacts"
          trailing={
            <Pressable style={styles.moreButton} hitSlop={minHitSlop}>
              <HugeiconsIcon
                icon={MoreVerticalIcon}
                size={iconSize.md}
                color={colors.textPrimary}
              />
            </Pressable>
          }
        />

        <PrimarySearchInput
          placeholder="Search by name or phone number"
          value={query}
          onChangeText={setQuery}
          onSearch={() => {}}
        />
      </View>

      {query.length > 0 ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {SECTIONS.map((section) => {
            const sectionResults = results.filter(
              (contact) => contact.section === section,
            );
            if (sectionResults.length === 0) {
              return null;
            }
            return (
              <View key={section} style={styles.section}>
                <Text style={styles.sectionLabel}>{section}</Text>
                <View>
                  {sectionResults.map((contact, index) => (
                    <ContactListItem
                      key={contact.id}
                      name={contact.name}
                      phone={contact.phone}
                      query={query}
                      onPress={() => setSelectedContact(contact)}
                      showDivider={index < sectionResults.length - 1}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.scroll} />
      )}

      <PopupMenu
        visible={selectedContact !== null}
        onClose={handleClosePreview}
      >
        {selectedContact ? (
          <View style={styles.preview}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Create Contact</Text>
              <Pressable onPress={handleClosePreview} hitSlop={minHitSlop}>
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={iconSize.md}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <View style={styles.messageCard}>
              <View style={styles.messageCardInner}>
                <View style={styles.messageHeader}>
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitial}>
                      {selectedContact.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.messageName}>{selectedContact.name}</Text>
                </View>
                <View style={styles.messageBody}>
                  <Text style={styles.messageText}>
                    This is a sample message…
                  </Text>
                  <Text style={styles.messageTime}>00:00</Text>
                </View>
              </View>
            </View>

            <View style={styles.fields}>
              <PrimaryTextInput
                placeholder="Enter nickname to this person"
                value={nickname}
                onChangeText={setNickname}
              />

              <PrimaryPressable
                text="Add This Person"
                onPress={handleAddPerson}
              />
            </View>
          </View>
        ) : null}
      </PopupMenu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  moreButton: {
    marginLeft: "auto",
  },
  header: {
    gap: spacing.lg,
    paddingBottom: spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.xl,
    paddingVertical: spacing.lg,
  },
  section: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  preview: {
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  previewTitle: {
    fontFamily: manrope.bold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textPrimary,
  },
  messageCard: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    gap: spacing.md,
  },
  messageCardInner: {
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.backgroundAccent,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    borderTopLeftRadius: borderRadius.none,
  },
  fields: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarFallback: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundAccentStrong,
  },
  avatarInitial: {
    fontFamily: manrope.bold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textAccent,
  },
  messageName: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textAccent,
  },
  messageBody: {
    gap: spacing.xs,
  },
  messageText: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  messageTime: {
    alignSelf: "flex-end",
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
});
