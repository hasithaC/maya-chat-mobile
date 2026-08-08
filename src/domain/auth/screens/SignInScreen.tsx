import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type { CountryCode } from "libphonenumber-js/mobile";
import { isValidPhoneNumber } from "libphonenumber-js/mobile";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  CountryCodeInput,
  KeyboardAwareScrollContainer,
  PrimaryPressable,
  PrimaryTextInput,
  SafeAreaContainer,
  SelectableOptionButton,
} from "../../../components";
import type { Country } from "../../../constants/data";
import { defaultCountry } from "../../../constants/data";
import {
  borderWidth,
  colors,
  controlHeight,
  deviceWidth,
  fontSize,
  iconSize,
  lineHeight,
  palette,
  primaryFontFamily,
  secondaryFontFamily,
  spacing,
  withAlpha,
} from "../../../constants/tokens";
import { EMAIL_REGEX } from "../constants";
import { useRequestOtp } from "../hooks/auth.hooks";

type OtpChannel = "mobile" | "email";

const PAGE_WIDTH = deviceWidth - 2 * spacing.lg;

export function SignInScreen() {
  const router = useRouter();

  const [channel, setChannel] = useState<OtpChannel>("mobile");
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [country, setCountry] = useState<Country>(defaultCountry);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const pagerRef = useRef<ScrollView>(null);

  const requestOtp = useRequestOtp();

  const goToChannel = (nextChannel: OtpChannel) => {
    setChannel(nextChannel);
    pagerRef.current?.scrollTo({
      x: nextChannel === "mobile" ? 0 : PAGE_WIDTH,
      animated: true,
    });
  };

  const currentValue = channel === "mobile" ? phoneInput : emailInput;

  const handleSendOtp = async () => {
    const trimmed = currentValue.trim();

    if (channel === "mobile") {
      if (
        !trimmed ||
        !isValidPhoneNumber(trimmed, country.iso2 as CountryCode)
      ) {
        setPhoneError(`Enter a valid mobile number for ${country.name}`);
        return;
      }
      setPhoneError(null);
    } else {
      if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
        setEmailError("Enter a valid email address");
        return;
      }
      setEmailError(null);
    }

    const value =
      channel === "mobile" ? `${country.dialCode}${trimmed}` : trimmed;

    try {
      const response = await requestOtp.mutateAsync({ type: channel, value });

      if (response.isNewUser) {
        const message =
          response.message ||
          `No account found for this ${channel === "mobile" ? "mobile number" : "email address"}.`;
        if (channel === "mobile") {
          setPhoneError(message);
        } else {
          setEmailError(message);
        }
        return;
      }

      router.push({
        pathname: "/(auth)/otp",
        params: { identifier: value, identifierType: channel },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      if (channel === "mobile") {
        setPhoneError(message);
      } else {
        setEmailError(message);
      }
    }
  };

  const handlePhoneChange = (text: string) => {
    setPhoneInput(text);
    if (phoneError) setPhoneError(null);
  };

  const handleEmailChange = (text: string) => {
    setEmailInput(text);
    if (emailError) setEmailError(null);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaContainer>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>
              <Text style={styles.headingMuted}>Welcome Back!</Text>
              <Text>,</Text>
            </Text>
            <Text style={styles.heading}>Sign In Here.</Text>
          </View>

          <KeyboardAwareScrollContainer
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.optionsWrapper}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>
                  Use Below Options to Sign In
                </Text>

                <View style={styles.dividerLine} />
              </View>

              <View style={styles.optionsGroup}>
                <View style={styles.channelRow}>
                  <SelectableOptionButton
                    label="Mobile Number"
                    selected={channel === "mobile"}
                    onPress={() => goToChannel("mobile")}
                  />

                  <SelectableOptionButton
                    label="Email"
                    selected={channel === "email"}
                    onPress={() => goToChannel("email")}
                  />
                </View>

                <View style={styles.pagerContainer}>
                  <ScrollView
                    scrollEnabled={false}
                    ref={pagerRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                  >
                    <View style={styles.pagerContainer}>
                      <View style={styles.phoneRow}>
                        <CountryCodeInput
                          country={country}
                          onChange={setCountry}
                        />
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
                    </View>
                    <View style={styles.pagerContainer}>
                      <PrimaryTextInput
                        placeholder="Email address"
                        keyboardType="email-address"
                        value={emailInput}
                        onChangeText={handleEmailChange}
                        error={emailError}
                      />
                    </View>
                  </ScrollView>
                </View>
                <View style={styles.separator} />
                <PrimaryPressable text="Continue" onPress={handleSendOtp} />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Don’t Have an Account?{" "}
                    <Text style={styles.footerLink} onPress={() => {}}>
                      Sign Up
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
  pagerContainer: {
    width: PAGE_WIDTH,
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
  channelRow: {
    width: "100%",
    gap: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneRow: {
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
