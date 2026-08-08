import { Mail01Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import {
  KeyboardAwareScrollContainer,
  PrimaryPressable,
  SafeAreaContainer,
} from "../../../components";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  iconSize,
  lineHeight,
  primaryFontFamily,
  spacing,
  withAlpha,
} from "../../../constants/tokens";
import { OTP_LENGTH, OTP_RESEND_INTERVAL_SECONDS } from "../constants";
import { useLoginWithOtp, useRequestOtp } from "../hooks/auth.hooks";

interface SignInOTPValidationScreenProps {
  identifier: string;
  identifierType: "mobile" | "email";
  onUseDifferentIdentifier: () => void;
}

export function SignInOTPValidationScreen({
  identifier,
  identifierType,
  onUseDifferentIdentifier,
}: SignInOTPValidationScreenProps) {
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(
    OTP_RESEND_INTERVAL_SECONDS,
  );
  const [isTimerOver, setIsTimerOver] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const requestOtp = useRequestOtp();
  const loginWithOtp = useLoginWithOtp();

  const startTimer = useCallback(() => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    setIsTimerOver(false);
    setRemainingSeconds(OTP_RESEND_INTERVAL_SECONDS);

    intervalIdRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev > 1) return prev - 1;
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
        setIsTimerOver(true);
        return 0;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [startTimer]);

  const identifierLabel =
    identifierType === "email" ? "email address" : "mobile number";

  const handleChangeOtp = (value: string) => {
    setOtp(value);
    if (error) setError(null);
  };

  const handleResend = async () => {
    if (!isTimerOver || requestOtp.isPending) return;
    try {
      await requestOtp.mutateAsync({ type: identifierType, value: identifier });
      startTimer();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    }
  };

  const handleVerify = async () => {
    try {
      await loginWithOtp.mutateAsync({ phoneNumber: identifier, otp });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    }
  };

  const ctaDisabled = otp.length < OTP_LENGTH;
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <View style={styles.screen}>
      <SafeAreaContainer>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>
              <Text style={styles.headingMuted}>Enter OTP</Text>
              <Text>,</Text>
            </Text>
            <Text style={styles.heading}>to Sign In to Your Account.</Text>
          </View>

          <KeyboardAwareScrollContainer
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.content}>
              <View style={styles.formGroup}>
                <View style={styles.headerBlock}>
                  <Text style={styles.helperText}>
                    An OTP has been sent to your {identifierLabel}. Enter it
                    below to continue.
                  </Text>

                  <View style={styles.identifierPill}>
                    <HugeiconsIcon
                      icon={identifierType === "email" ? Mail01Icon : SmartPhone01Icon}
                      size={iconSize.xs}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.identifierPillText}>{identifier}</Text>
                  </View>
                </View>

                <OtpInput
                  numberOfDigits={OTP_LENGTH}
                  onTextChange={handleChangeOtp}
                  theme={{
                    containerStyle: styles.otpContainer,
                    pinCodeContainerStyle: styles.otpPinCodeContainer,
                    pinCodeTextStyle: styles.otpPinCodeText,
                    focusStickStyle: styles.otpFocusStick,
                    focusedPinCodeContainerStyle: styles.otpActivePinCodeContainer,
                  }}
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.resendBlock}>
                  {isTimerOver ? (
                    <>
                      <Text style={styles.resendLabel}>
                        Didn't receive the code?{" "}
                      </Text>
                      <Text style={styles.resendAction} onPress={handleResend}>
                        Resend
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.resendLabel}>Resend code in</Text>
                      <Text style={styles.resendTimer}>{`${minutes}:${seconds}`}</Text>
                    </>
                  )}
                </View>
              </View>

              <PrimaryPressable
                disabled={ctaDisabled}
                text="Sign In"
                onPress={handleVerify}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Wrong {identifierLabel}?{" "}
                  <Text style={styles.footerLink} onPress={onUseDifferentIdentifier}>
                    Use a different one
                  </Text>
                </Text>
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
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    gap: spacing["2xl"],
  },
  formGroup: {
    flex: 1,
    gap: spacing["3xl"],
    justifyContent: "center",
    alignItems: "center",
  },
  headerBlock: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  helperText: {
    fontFamily: primaryFontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
    textAlign: "center",
  },
  identifierPill: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    height: controlHeight.md,
    borderRadius: borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundSecondary,
  },
  identifierPillText: {
    fontFamily: primaryFontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textSecondary,
  },
  otpContainer: {
    width: "100%",
  },
  otpPinCodeContainer: {
    borderWidth: borderWidth.thin,
    borderColor: withAlpha(colors.borderAccent, 0),
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  otpPinCodeText: {
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    fontFamily: primaryFontFamily.regular,
    lineHeight: lineHeight.xl,
  },
  otpFocusStick: {
    backgroundColor: colors.textLink,
  },
  otpActivePinCodeContainer: {
    borderColor: colors.borderAccent,
  },
  errorText: {
    fontFamily: primaryFontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.error,
    textAlign: "center",
  },
  resendBlock: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendLabel: {
    fontFamily: primaryFontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textSecondary,
  },
  resendAction: {
    fontFamily: primaryFontFamily.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textLink,
  },
  resendTimer: {
    fontFamily: primaryFontFamily.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textLink,
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
