import {
  ChevronLeftIcon,
  Delete02Icon,
  Sent02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  minHitSlop,
  spacing,
  withAlpha,
} from "../../../src/constants/tokens";
import { useAttachmentDraftStore } from "../../../src/domain/attachments/store/attachment-draft.store";

export default function AttachmentPreviewScreen() {
  const insets = useSafeAreaInsets();
  const assets = useAttachmentDraftStore((state) => state.assets);
  const removeAsset = useAttachmentDraftStore((state) => state.removeAsset);
  const clear = useAttachmentDraftStore((state) => state.clear);
  const requestSend = useAttachmentDraftStore((state) => state.requestSend);

  const [activeIndex, setActiveIndex] = useState(0);
  const [caption, setCaption] = useState("");

  const activeAsset = assets[Math.min(activeIndex, assets.length - 1)];

  if (!activeAsset) {
    return <Stack.Screen options={{ presentation: "fullScreenModal" }} />;
  }

  const handleBack = () => {
    clear();
    router.back();
  };

  const handleRemove = (index: number) => {
    const remaining = assets.length - 1;
    removeAsset(index);
    if (remaining === 0) {
      router.back();
      return;
    }
    setActiveIndex((current) => Math.min(current, remaining - 1));
  };

  const handleSend = () => {
    requestSend(caption.trim());
    router.back();
  };

  return (
    <>
      <View style={styles.screen}>
        <Stack.Screen options={{ presentation: "fullScreenModal" }} />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={[
              styles.header,
              { paddingTop: Math.max(insets.top, spacing.lg) },
            ]}
          >
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              hitSlop={minHitSlop}
            >
              <HugeiconsIcon
                icon={ChevronLeftIcon}
                size={iconSize.md}
                color={colors.textInverse}
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.previewWrapper}
            contentContainerStyle={{
              flexGrow: 1,
              padding: spacing.lg,
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: activeAsset.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </ScrollView>

          <View>
            {assets.length > 1 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailRow}
              >
                {assets.map((asset, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <Pressable
                      key={asset.assetId ?? asset.uri}
                      onPress={() => setActiveIndex(index)}
                    >
                      <View
                        style={[
                          styles.thumbnail,
                          isActive && styles.thumbnailActive,
                        ]}
                      >
                        <Image
                          source={{ uri: asset.uri }}
                          style={styles.thumbnailImage}
                        />
                        {isActive ? (
                          <Pressable
                            style={styles.thumbnailDelete}
                            onPress={() => handleRemove(index)}
                            hitSlop={minHitSlop}
                          >
                            <HugeiconsIcon
                              icon={Delete02Icon}
                              size={iconSize.sm}
                              color={colors.textInverse}
                            />
                          </Pressable>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}
          </View>

          <View
            style={[
              styles.inputRow,
              { paddingBottom: Math.max(insets.bottom, spacing.lg) },
            ]}
          >
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Type something..."
              placeholderTextColor={colors.textInverseSecondary}
              style={styles.input}
              returnKeyType="send"
            />
            <Pressable style={styles.sendButton} onPress={handleSend}>
              <HugeiconsIcon
                icon={Sent02Icon}
                size={iconSize.sm}
                color={colors.textInverse}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundInverse,
  },
  container: {
    flex: 1,
    gap: spacing.xs,
  },
  header: {
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: controlHeight.sm,
    height: controlHeight.sm,
    borderRadius: controlHeight.sm / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundInverseSecondary,
  },
  previewWrapper: {
    flex: 1,
    width: "100%",
  },
  previewImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  thumbnailRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  thumbnail: {
    width: controlHeight.lg,
    height: controlHeight.lg,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    borderWidth: borderWidth.medium,
    borderColor: "transparent",
  },
  thumbnailActive: {
    borderColor: colors.buttonPrimary,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.backgroundPrimary,
  },
  thumbnailDelete: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.scrim,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  input: {
    flex: 1,
    height: controlHeight.lg,
    borderRadius: controlHeight.lg / 2,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundInverseSecondary,
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textInverse,
  },
  sendButton: {
    width: controlHeight.md,
    height: controlHeight.md,
    borderRadius: controlHeight.md / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.buttonPrimary,
  },
});
