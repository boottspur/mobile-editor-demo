import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
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
import { GlobalStylesEditor } from './GlobalStylesEditor';

interface SwipeableEditorProps {
  document: EmailDocument | null;
  children: React.ReactNode; // The existing editor content
  currentPage?: number;
  onPageChange?: (page: number) => void;
  viewMode?: 'mobile' | 'desktop';
  onUpdateGlobalStyles?: (globalStyles: import('../types').GlobalStyles) => void;
  mobileDesignMode?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.3;

export const SwipeableEditor: React.FC<SwipeableEditorProps> = ({
  document,
  children,
  currentPage: externalPage,
  onPageChange,
  viewMode = 'mobile',
  onUpdateGlobalStyles,
  mobileDesignMode = false,
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
      translateX.value = currentPage * -screenWidth;
    })
    .onUpdate((event) => {
      const baseOffset = currentPage * -screenWidth;
      
      // Limit swipe based on current page
      if (currentPage === 0 && event.translationX > 0) {
        // On first page (Design), can't swipe right
        translateX.value = baseOffset + event.translationX * 0.1; // Rubber band effect
      } else if (currentPage === 2 && event.translationX < 0) {
        // On last page (Preview), can't swipe left
        translateX.value = baseOffset + event.translationX * 0.1; // Rubber band effect
      } else {
        translateX.value = baseOffset + event.translationX;
      }
    })
    .onEnd((event) => {
      const shouldSwitchPage = Math.abs(event.translationX) > SWIPE_THRESHOLD;
      
      if (shouldSwitchPage) {
        if (event.translationX < 0 && currentPage < 2) {
          // Swipe left - go to next page
          const nextPage = currentPage + 1;
          translateX.value = withSpring(nextPage * -screenWidth, {
            damping: 20,
            stiffness: 150,
          }, (finished) => {
            if (finished) {
              runOnJS(updatePage)(nextPage);
            }
          });
        } else if (event.translationX > 0 && currentPage > 0) {
          // Swipe right - go to previous page
          const prevPage = currentPage - 1;
          translateX.value = withSpring(prevPage * -screenWidth, {
            damping: 20,
            stiffness: 150,
          }, (finished) => {
            if (finished) {
              runOnJS(updatePage)(prevPage);
            }
          });
        } else {
          // Spring back
          translateX.value = withSpring(currentPage * -screenWidth);
        }
      } else {
        // Spring back to current page
        translateX.value = withSpring(currentPage * -screenWidth);
      }
    });

  // Effect to handle external page changes
  React.useEffect(() => {
    if (externalPage !== undefined) {
      translateX.value = withSpring(externalPage * -screenWidth, {
        damping: 20,
        stiffness: 150,
      });
    }
  }, [externalPage]);

  const switchToDesign = () => {
    translateX.value = withSpring(0, {
      damping: 20,
      stiffness: 150,
    }, (finished) => {
      if (finished) {
        runOnJS(updatePage)(0);
      }
    });
  };

  const switchToEdit = () => {
    translateX.value = withSpring(-screenWidth, {
      damping: 20,
      stiffness: 150,
    }, (finished) => {
      if (finished) {
        runOnJS(updatePage)(1);
      }
    });
  };

  const switchToPreview = () => {
    if (document) {
      translateX.value = withSpring(-2 * screenWidth, {
        damping: 20,
        stiffness: 150,
      }, (finished) => {
        if (finished) {
          runOnJS(updatePage)(2);
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
      [0, -screenWidth, -2 * screenWidth],
      [0, screenWidth / 3, (2 * screenWidth) / 3]
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
          {/* Page 0: Design (Global Styles) */}
          <View style={styles.page}>
            <GlobalStylesEditor
              visible={true}
              onClose={() => {}} // No close needed - part of navigation
              globalStyles={document?.globalStyles || {
                bodyBackgroundColor: '#f5f5f5',
                fontFamily: 'Arial, sans-serif',
                fontSize: 16,
                textColor: '#333333',
                linkColor: '#1976d2',
                headingColor: '#000000',
              }}
              onUpdate={onUpdateGlobalStyles || (() => {})}
              isInline={true}
              mobileDesignMode={mobileDesignMode}
            />
          </View>

          {/* Page 1: Edit */}
          <View style={styles.page}>
            {children}
          </View>

          {/* Page 2: Preview */}
          <View style={styles.page}>
            <EmailPreview 
              document={document} 
              onBack={switchToEdit}
              viewMode={viewMode}
            />
          </View>
        </Animated.View>
      </GestureDetector>

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
    width: screenWidth * 3,
  },
  page: {
    flex: 1,
    width: screenWidth,
  },
});