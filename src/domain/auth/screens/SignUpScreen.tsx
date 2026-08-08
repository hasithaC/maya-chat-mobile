import { useRouter } from "expo-router";
import type { CountryCode } from "libphonenumber-js/mobile";
import { isValidPhoneNumber } from "libphonenumber-js/mobile";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CountryCodeInput,
  KeyboardAwareScrollContainer,
  PrimaryPressable,
  PrimaryTextInput,
  SafeAreaContainer,
} from "../../../components";
import type { Country } from "../../../constants/data";
import { defaultCountry } from "../../../constants/data";
import {
  borderWidth,
  colors,
  fontSize,
  lineHeight,
  primaryFontFamily,
  secondaryFontFamily,
  spacing,
} from "../../../constants/tokens";
import { useRequestOtp } from "../hooks/auth.hooks";

export function SignUpScreen() {
  const router = useRouter();

  const [phoneInput, setPhoneInput] = useState("");
  const [country, setCountry] = useState<Country>(defaultCountry);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const requestOtp = useRequestOtp();

  const handlePhoneChange = (text: string) => {
    setPhoneInput(text);
    if (phoneError) setPhoneError(null);
  };

  const handleContinue = async () => {
    const trimmed = phoneInput.trim();

    if (!trimmed || !isValidPhoneNumber(trimmed, country.iso2 as CountryCode)) {
      setPhoneError(`Enter a valid mobile number for ${country.name}`);
      return;
    }
    setPhoneError(null);

    const value = `${country.dialCode}${trimmed}`;

    try {
      const response = await requestOtp.mutateAsync({ type: "mobile", value });

      if (response.isNewUser) {
        router.push({
          pathname: "/(auth)/sign-up-otp",
          params: { identifier: value, identifierType: "mobile" },
        });
      } else {
        router.push({
          pathname: "/(auth)/otp",
          params: { identifier: value, identifierType: "mobile" },
        });
      }
    } catch (err) {
      setPhoneError(err instanceof Error ? err.message : "Failed to send OTP");
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaContainer>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>
              <Text style={styles.headingMuted}>Hey There!</Text>
              <Text>,</Text>
            </Text>
            <Text style={styles.heading}>Sign Up Here.</Text>
          </View>

          <KeyboardAwareScrollContainer
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.optionsWrapper}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>
                  Use Below Options to Sign Up
                </Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.optionsGroup}>
                <View style={styles.identifierRow}>
                  <CountryCodeInput country={country} onChange={setCountry} />
                  <View style={styles.phoneInputWrapper}>
                    <PrimaryTextInput
                      placeholder="Mobile number"
                      keyboardType="phone-pad"
                      value={phoneInput}
                      onChangeText={handlePhoneChange}
                      error={phoneError}
                    />
                  </View>
                </View>

                <View style={styles.separator} />
                <PrimaryPressable text="Continue" onPress={handleContinue} />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Already Have an Account?{" "}
                    <Text
                      style={styles.footerLink}
                      onPress={() => router.replace("/(auth)/sign-in")}
                    >
                      Sign In
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollContainer>
        </View>
      </SafeAreaContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.backgroundPrimary,
  },
  header: {
    flex: 1,
    width: "100%",
    gap: spacing.lg,
    padding: spacing.lg,
  },
  heading: {
    fontFamily: primaryFontFamily.bold,
    fontSize: fontSize["3xl"],
    lineHeight: lineHeight["3xl"],
    color: colors.textPrimary,
  },
  headingMuted: {
    color: colors.textSecondary,
  },
  scrollContent: {
    justifyContent: "flex-end",
  },
  optionsWrapper: {
    gap: spacing.lg,
    width: "100%",
    alignItems: "center",
    backgroundColor: colors.backgroundPrimary,
  },
  dividerRow: {
    gap: spacing["2xl"],
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dividerLine: {
    flex: 1,
    height: borderWidth.thin,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: secondaryFontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
    textAlign: "center",
  },
  optionsGroup: {
    gap: spacing.lg,
    width: "100%",
  },
  identifierRow: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.sm,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  separator: {
    width: "100%",
    height: borderWidth.thin,
    backgroundColor: colors.border,
  },
  footer: {
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontFamily: primaryFontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  footerLink: {
    color: colors.textLink,
  },
});
