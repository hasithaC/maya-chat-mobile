import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface UseFadeTransitionOptions {
  isLoading: boolean;
  loadingDuration?: number;
  contentDuration?: number;
}

export const useFadeTransition = ({
  isLoading,
  loadingDuration = 1000,
  contentDuration = 300,
}: UseFadeTransitionOptions) => {
  const loadingOpacity = useRef(new Animated.Value(isLoading ? 1 : 0)).current;
  const contentOpacity = useRef(new Animated.Value(isLoading ? 0 : 1)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: loadingDuration,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: contentDuration,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: contentDuration,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: loadingDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, loadingOpacity, contentOpacity, loadingDuration, contentDuration]);

  return { loadingOpacity, contentOpacity };
};
