import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import type { ListRenderItemInfo, StyleProp, ViewStyle } from "react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { Country } from "../../constants/data";
import { countries } from "../../constants/data";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  iconSize,
  lineHeight,
  manrope,
  spacing,
  withAlpha,
} from "../../constants/tokens";
import { BottomSheet } from "../overlays";
import { PrimarySearchInput } from "./PrimarySearchInput";

interface CountryCodeInputProps {
  country: Country;
  onChange: (country: Country) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function CountryCodeInput({
  country,
  onChange,
  disabled = false,
  style,
}: CountryCodeInputProps) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");

  const filteredCountries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return countries;
    return countries.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        item.dialCode.includes(normalized),
    );
  }, [query]);

  const handleOpen = () => setVisible(true);

  const handleClose = () => {
    setQuery("");
    setVisible(false);
  };

  const handleSelect = (selected: Country) => {
    setQuery("");
    onChange(selected);
    setVisible(false);
  };

  const renderItem = ({ item }: ListRenderItemInfo<Country>) => {
    const selected = item.iso2 === country.iso2;
    return (
      <Pressable
        style={[styles.row, selected && styles.rowSelected]}
        onPress={() => handleSelect(item)}
      >
        <Text style={styles.rowFlag}>{item.flag}</Text>
        <Text style={styles.rowName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.rowDialCode}>{item.dialCode}</Text>
      </Pressable>
    );
  };

  return (
    <>
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        style={[
          styles.trigger,
          {
            borderColor: visible
              ? colors.borderAccent
              : withAlpha(colors.borderAccent, 0),
          },
          disabled && styles.disabled,
          style,
        ]}
      >
        <Text style={styles.flag}>{country.flag}</Text>
        <Text style={styles.dialCode}>{country.dialCode}</Text>
        <Ionicons
          name="chevron-down"
          size={iconSize.xs}
          color={colors.textSecondary}
        />
      </Pressable>

      <BottomSheet
        visible={visible}
        onClose={handleClose}
        title="Select Country"
      >
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.iso2}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll
          ListHeaderComponent={
            <View style={styles.searchHeader}>
              <PrimarySearchInput
                placeholder="Search country or code"
                value={query}
                onChangeText={setQuery}
                onSearch={() => {}}
              />
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No countries found</Text>
          }
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    height: controlHeight.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius["2xl"],
    borderWidth: borderWidth.thin,
    backgroundColor: colors.backgroundSecondary,
  },
  disabled: {
    opacity: 0.5,
  },
  flag: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
  },
  dialCode: {
    fontFamily: manrope.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  listContent: {
    paddingBottom: spacing["2xl"],
    gap: spacing.xs,
  },
  searchHeader: {
    paddingBottom: spacing.xl,
    backgroundColor: colors.backgroundPrimary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
  },
  rowSelected: {
    backgroundColor: colors.buttonSecondary,
  },
  rowFlag: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
  },
  rowName: {
    flex: 1,
    fontFamily: manrope.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textPrimary,
  },
  rowDialCode: {
    fontFamily: manrope.medium,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textSecondary,
  },
  emptyText: {
    paddingTop: spacing.lg,
    textAlign: "center",
    fontFamily: manrope.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
