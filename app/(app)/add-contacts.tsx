import { Cancel01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackHeader,
  ContactListItem,
  ContactListShimmer,
  NoSearchResults,
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
import {
  useAddContact,
  useContacts,
  useSearchContacts,
  useUpdateContact,
} from "../../src/domain/contacts/hooks/contacts.hooks";
import type {
  Contact,
  SearchedUser,
} from "../../src/domain/contacts/types/contacts.types";

const SECTIONS: { key: "contacts" | "others"; label: string }[] = [
  { key: "contacts", label: "In Your Contacts" },
  { key: "others", label: "Other Users" },
];

interface ContactSelection {
  contactUserId: number;
  fullName: string;
  // Only set when this person is already an existing contact — needed to
  // PATCH /api/v1/contacts/{contactId} (the contact record's own id, not
  // the contactUserId).
  contactId: number | null;
  isFavorite: boolean;
}

export default function AddContactsScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selection, setSelection] = useState<ContactSelection | null>(null);
  const [nickname, setNickname] = useState("");

  const {
    data: contactsData,
    isPending: isContactsPending,
    isError: isContactsError,
  } = useContacts();
  const myContacts = contactsData?.contacts ?? [];

  const { data, isPending, isError } = useSearchContacts(searchTerm);
  const users = data?.users ?? [];
  const resultsBySection = {
    contacts: users.filter((user) => user.isContact),
    others: users.filter((user) => !user.isContact),
  };

  const addContact = useAddContact();
  const updateContact = useUpdateContact();
  const isExistingContact = selection?.contactId != null;

  const handleSelectSearchResult = (user: SearchedUser) => {
    const existing = myContacts.find(
      (contact) => contact.contactUserId === user.id,
    );
    setSelection({
      contactUserId: user.id,
      fullName: user.displayName || user.fullName,
      contactId: existing?.id ?? null,
      isFavorite: existing?.isFavorite ?? false,
    });
    setNickname(existing?.displayName || user.displayName || "");
  };

  const handleSelectContact = (contact: Contact) => {
    setSelection({
      contactUserId: contact.contactUserId,
      fullName: contact.contactUser.fullName,
      contactId: contact.id,
      isFavorite: contact.isFavorite,
    });
    setNickname(contact.displayName || "");
  };

  const handleClosePreview = () => {
    setSelection(null);
    setNickname("");
  };

  const handleSavePerson = async () => {
    if (!selection) return;

    const displayName = nickname.trim() || selection.fullName;

    if (selection.contactId != null) {
      await updateContact.mutateAsync({
        contactId: selection.contactId,
        displayName,
        isFavorite: selection.isFavorite,
      });
    } else {
      await addContact.mutateAsync({
        contactUserId: selection.contactUserId,
        displayName,
        isFavorite: false,
      });
    }

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
          onSearch={setSearchTerm}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {query.length > 0 ? (
          isPending ? (
            <ContactListShimmer />
          ) : isError ? (
            <NoSearchResults
              title="Something went wrong"
              subtitle="We couldn't search contacts right now. Please try again."
            />
          ) : users.length === 0 ? (
            <NoSearchResults
              title="No matches found"
              subtitle={`We couldn't find anyone matching "${searchTerm}".`}
            />
          ) : (
            SECTIONS.map(({ key, label }) => {
              const sectionResults = resultsBySection[key];
              if (sectionResults.length === 0) {
                return null;
              }
              return (
                <View key={key} style={styles.section}>
                  <Text style={styles.sectionLabel}>{label}</Text>
                  <View>
                    {sectionResults.map((user, index) => (
                      <ContactListItem
                        key={user.id}
                        id={user.id}
                        name={user.displayName || user.fullName}
                        phone={user.phone}
                        email={user.email}
                        avatarSource={user.avatar ? { uri: user.avatar } : undefined}
                        query={query}
                        onPress={() => handleSelectSearchResult(user)}
                        showDivider={index < sectionResults.length - 1}
                      />
                    ))}
                  </View>
                </View>
              );
            })
          )
        ) : isContactsPending ? (
          <ContactListShimmer />
        ) : isContactsError ? (
          <NoSearchResults
            title="Something went wrong"
            subtitle="We couldn't load your contacts. Please try again."
          />
        ) : myContacts.length === 0 ? (
          <NoSearchResults
            title="No contacts yet"
            subtitle="Search for people above to add your first contact."
          />
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>My Contacts</Text>
            <View>
              {myContacts.map((contact, index) => (
                <ContactListItem
                  key={contact.id}
                  id={contact.contactUserId}
                  name={contact.displayName || contact.contactUser.fullName}
                  phone={contact.contactUser.phone}
                  email={contact.contactUser.email}
                  avatarSource={
                    contact.contactUser.avatar
                      ? { uri: contact.contactUser.avatar }
                      : undefined
                  }
                  onPress={() => handleSelectContact(contact)}
                  showDivider={index < myContacts.length - 1}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <PopupMenu
        visible={selection !== null}
        onClose={handleClosePreview}
      >
        {selection ? (
          <View style={styles.preview}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>
                {isExistingContact ? "Update Contact" : "Create Contact"}
              </Text>
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
                      {selection.fullName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.messageName}>
                    {selection.fullName}
                  </Text>
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
                text={isExistingContact ? "Update This Person" : "Add This Person"}
                onPress={handleSavePerson}
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
