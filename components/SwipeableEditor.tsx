import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { EmailDocument } from '../types';
import { EmailPreview } from './EmailPreview';

interface SwipeableEditorProps {
  document: EmailDocument | null;
  children: React.ReactNode; // The existing editor content
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.3;

export const SwipeableEditor: React.FC<SwipeableEditorProps> = ({
  document,
  children,
  currentPage: externalPage,
  onPageChange,
}) => {
  const [internalPage, setInternalPage] = useState(0);
  const currentPage = externalPage !== undefined ? externalPage : internalPage;
  const translateX = useSharedValue(0);

  const updatePage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate after 10px horizontal movement
    .failOffsetY([-15, 15]) // Fail if vertical movement exceeds 15px
    .onStart(() => {
      // Store the current offset when gesture starts
      translateX.value = currentPage === 0 ? 0 : -screenWidth;
    })
    .onUpdate((event) => {
      const baseOffset = currentPage === 0 ? 0 : -screenWidth;
      
      // Limit swipe based on current page
      if (currentPage === 0 && event.translationX > 0) {
        // On first page, can't swipe right
        translateX.value = baseOffset + event.translationX * 0.1; // Rubber band effect
      } else if (currentPage === 1 && event.translationX < 0) {
        // On last page, can't swipe left
        translateX.value = baseOffset + event.translationX * 0.1; // Rubber band effect
      } else {
        translateX.value = baseOffset + event.translationX;
      }
    })
    .onEnd((event) => {
      const shouldSwitchPage = Math.abs(event.translationX) > SWIPE_THRESHOLD;
      
      if (shouldSwitchPage) {
        if (event.translationX < 0 && currentPage === 0 && document) {
          // Swipe left - go to preview
          translateX.value = withSpring(-screenWidth, {
            damping: 20,
            stiffness: 150,
          }, (finished) => {
            if (finished) {
              runOnJS(updatePage)(1);
            }
          });
        } else if (event.translationX > 0 && currentPage === 1) {
          // Swipe right - go to editor
          translateX.value = withSpring(0, {
            damping: 20,
            stiffness: 150,
          }, (finished) => {
            if (finished) {
              runOnJS(updatePage)(0);
            }
          });
        } else {
          // Spring back
          translateX.value = withSpring(currentPage === 0 ? 0 : -screenWidth);
        }
      } else {
        // Spring back to current page
        translateX.value = withSpring(currentPage === 0 ? 0 : -screenWidth);
      }
    });

  // Effect to handle external page changes
  React.useEffect(() => {
    if (externalPage !== undefined) {
      translateX.value = withSpring(externalPage === 0 ? 0 : -screenWidth, {
        damping: 20,
        stiffness: 150,
      });
    }
  }, [externalPage]);

  const switchToEdit = () => {
    translateX.value = withSpring(0, {
      damping: 20,
      stiffness: 150,
    }, (finished) => {
      if (finished) {
        runOnJS(updatePage)(0);
      }
    });
  };

  const switchToPreview = () => {
    if (document) {
      translateX.value = withSpring(-screenWidth, {
        damping: 20,
        stiffness: 150,
      }, (finished) => {
        if (finished) {
          runOnJS(updatePage)(1);
        }
      });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const indicatorStyle = useAnimatedStyle(() => {
    const position = interpolate(
      translateX.value,
      [0, -screenWidth],
      [0, screenWidth / 2]
    );
    return {
      transform: [{ translateX: position }],
    };
  });

  if (!document) {
    // If no document is loaded, just show the editor
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Swipeable Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.pagesContainer, animatedStyle]}>
          {/* Page 0: Editor */}
          <View style={styles.page}>
            {children}
          </View>

          {/* Page 1: Preview */}
          <View style={styles.page}>
            <EmailPreview 
              document={document} 
              onBack={switchToEdit}
            />
          </View>
        </Animated.View>
      </GestureDetector>

      {/* Swipe Hints */}
      {currentPage === 0 && (
        <View style={styles.swipeHintRight}>
          <View style={styles.swipeHintContent}>
            <Text style={styles.swipeHintText}>👁️</Text>
            <Text style={styles.swipeHintLabel}>Preview</Text>
          </View>
        </View>
      )}

      {currentPage === 1 && (
        <View style={styles.swipeHintLeft}>
          <View style={styles.swipeHintContent}>
            <Text style={styles.swipeHintText}>✏️</Text>
            <Text style={styles.swipeHintLabel}>Edit</Text>
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Page Indicators
  indicatorContainer: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  indicatorTrack: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    height: 36,
    position: 'relative',
    overflow: 'hidden',
  },
  indicatorSlider: {
    position: 'absolute',
    top: 2,
    left: 2,
    height: 32,
    backgroundColor: '#1976d2',
    borderRadius: 18,
    width: screenWidth / 2 - 18, // Half width minus padding
  },
  indicatorButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  indicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  indicatorTextActive: {
    color: '#ffffff',
  },
  
  // Pages Container
  pagesContainer: {
    flex: 1,
    flexDirection: 'row',
    width: screenWidth * 2,
  },
  page: {
    flex: 1,
    width: screenWidth,
  },
  
  // Swipe Hints
  swipeHintRight: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -30 }],
    backgroundColor: 'rgba(25, 118, 210, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  swipeHintLeft: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -30 }],
    backgroundColor: 'rgba(25, 118, 210, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  swipeHintContent: {
    alignItems: 'center',
    minWidth: 32,
  },
  swipeHintText: {
    fontSize: 16,
    marginBottom: 2,
  },
  swipeHintLabel: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    transform: [{ rotate: '90deg' }],
  },
});