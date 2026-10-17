import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  BottomSheet,
  KeyboardAwareScrollContainer,
  PrimaryPressable,
  PrimaryTextInput,
  SafeAreaContainer,
} from "../../../components";
import { ROUTES } from "../../../constants/routes";
import {
  avatarSize,
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
} from "../../../constants/tokens";
import { EMAIL_REGEX } from "../constants";
import { useSignUp } from "../hooks/auth.hooks";
import { useAuthStore } from "../store/auth.store";
import { uploadAvatar } from "../utils/upload-avatar";

interface AccountCreationScreenProps {
  phone: string;
}

interface IndustryOption {
  label: string;
  value: string;
}

const INDUSTRY_OPTIONS: IndustryOption[] = [
  { label: "Technology", value: "technology" },
  { label: "Finance", value: "finance" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
];

interface AvatarAsset {
  uri: string;
  type: string;
}

export function AccountCreationScreen({ phone }: AccountCreationScreenProps) {
  const verifyToken = useAuthStore((state) => state.verifyToken);
  const signUp = useSignUp();

  const [avatar, setAvatar] = useState<AvatarAsset | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState<IndustryOption | null>(null);
  const [isIndustryPickerVisible, setIsIndustryPickerVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    if (error) setError(null);
  };

  const pickAvatar = async (source: "camera" | "library") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    setAvatar({ uri: asset.uri, type: asset.mimeType ?? "image/jpeg" });
  };

  const handlePickAvatar = () => {
    Alert.alert(
      "Select Image",
      "How would you like to add your profile photo?",
      [
        { text: "Take Photo", onPress: () => void pickAvatar("camera") },
        { text: "Choose from Library", onPress: () => void pickAvatar("library") },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const handleContinue = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!industry) {
      setError("Please select your industry.");
      return;
    }
    if (!verifyToken) {
      setError("Your session has expired. Please start again.");
      return;
    }

    setError(null);

    let avatarUrl: string | undefined;
    if (avatar) {
      const uploaded = await uploadAvatar(avatar.uri, avatar.type, verifyToken);
      if (!uploaded.success) {
        setError(uploaded.error);
        return;
      }
      avatarUrl = uploaded.url;
    }

    try {
      await signUp.mutateAsync({
        fullName: trimmedName,
        email: trimmedEmail,
        phone,
        verifyToken,
        avatarUrl,
        industry: industry.value,
      });
      router.replace(ROUTES.trainMaya);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create your account. Please try again.",
      );
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaContainer>
        <KeyboardAwareScrollContainer contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View>
              <Text style={styles.heading}>
                <Text style={styles.headingMuted}>Great!</Text>
                <Text>,</Text>
              </Text>
              <Text style={styles.heading}>Let's Create Your Account.</Text>
            </View>

            <View style={styles.avatarSection}>
              <Pressable style={styles.avatarButton} onPress={handlePickAvatar}>
                {avatar ? (
                  <Image source={{ uri: avatar.uri }} style={styles.avatarImage} />
                ) : (
                  <Ionicons
                    name="camera-outline"
                    size={iconSize.lg}
                    color={colors.textSecondary}
                  />
                )}
              </Pressable>
            </View>

            <View style={styles.formSection}>
              <PrimaryTextInput
                leftIcon="person-outline"
                placeholder="Full Name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  clearError();
                }}
              />
              <PrimaryTextInput
                leftIcon="mail-outline"
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError();
                }}
              />
              <Pressable
                style={styles.industryTrigger}
                onPress={() => setIsIndustryPickerVisible(true)}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={iconSize.xs}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.industryText,
                    !industry && styles.industryPlaceholder,
                  ]}
                >
                  {industry?.label ?? "Select your industry"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={iconSize.xs}
                  color={colors.textSecondary}
                />
              </Pressable>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <PrimaryPressable text="Continue" onPress={handleContinue} />
          </View>
        </KeyboardAwareScrollContainer>
      </SafeAreaContainer>

      <BottomSheet
        visible={isIndustryPickerVisible}
        onClose={() => setIsIndustryPickerVisible(false)}
        title="Select Industry"
      >
        <View style={styles.industryList}>
          {INDUSTRY_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.industryRow,
                industry?.value === option.value && styles.industryRowSelected,
              ]}
              onPress={() => {
                setIndustry(option);
                setIsIndustryPickerVisible(false);
                clearError();
              }}
            >
              <Text style={styles.industryRowText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.backgroundPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    gap: spacing["2xl"],
  },
  heading: {
    fontFamily: manrope.bold,
    fontSize: fontSize["3xl"],
    lineHeight: lineHeight["3xl"],
    color: colors.textPrimary,
  },
  headingMuted: {
    color: colors.textSecondary,
  },
  avatarSection: {
    width: "100%",
    alignItems: "center",
  },
  avatarButton: {
    width: avatarSize["3xl"],
    height: avatarSize["3xl"],
    borderRadius: avatarSize["3xl"] / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundSecondary,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  formSection: {
    width: "100%",
    gap: spacing.md,
  },
  industryTrigger: {
    width: "100%",
    height: controlHeight.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius["2xl"],
    borderWidth: borderWidth.thin,
    borderColor: withAlpha(colors.borderAccent, 0),
    backgroundColor: colors.backgroundSecondary,
  },
  industryText: {
    flex: 1,
    fontFamily: manrope.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  industryPlaceholder: {
    color: colors.textSecondary,
  },
  errorText: {
    fontFamily: manrope.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.error,
  },
  industryList: {
    gap: spacing.xs,
  },
  industryRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
  },
  industryRowSelected: {
    backgroundColor: colors.buttonSecondary,
  },
  industryRowText: {
    fontFamily: manrope.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textPrimary,
  },
});
