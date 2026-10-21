import { Image, StyleSheet, Text, View } from "react-native";
import {
  colors,
  getAvatarColor,
  manrope,
} from "../../constants/tokens";
import type { CallPeer } from "../../domain/calls/store/call.store";

interface CallAvatarProps {
  peer: CallPeer;
  size: number;
  borderWidth: number;
}

// Round peer avatar with a white ring, falling back to the colored initial
// used across the app's list items when the peer has no photo.
export function CallAvatar({ peer, size, borderWidth }: CallAvatarProps) {
  const frameStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth,
  };

  return (
    <View style={[styles.frame, frameStyle]}>
      {peer.avatarUrl ? (
        <Image source={{ uri: peer.avatarUrl }} style={styles.fill} />
      ) : (
        <View
          style={[
            styles.fill,
            styles.fallback,
            { backgroundColor: getAvatarColor(peer.id ?? peer.name) },
          ]}
        >
          <Text
            style={[
              styles.initial,
              { fontSize: size * 0.4, lineHeight: size * 0.5 },
            ]}
          >
            {peer.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: "hidden",
    borderColor: colors.borderInverse,
    backgroundColor: colors.backgroundSecondary,
  },
  fill: {
    flex: 1,
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontFamily: manrope.bold,
    color: colors.textInverse,
  },
});
