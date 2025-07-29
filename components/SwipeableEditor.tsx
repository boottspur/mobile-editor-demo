import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { EmailDocument } from '../types';
import { EmailPreview } from './EmailPreview';

interface SwipeableEditorProps {
  document: EmailDocument | null;
  children: React.ReactNode; // The existing editor content
}

const { width: screenWidth } = Dimensions.get('window');

export const SwipeableEditor: React.FC<SwipeableEditorProps> = ({
  document,
  children,
}) => {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animate page indicator
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: currentPage,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [currentPage]);

  const handlePageSelected = (event: any) => {
    setCurrentPage(event.nativeEvent.position);
  };

  const switchToEdit = () => {
    pagerRef.current?.setPage(0);
  };

  const switchToPreview = () => {
    if (document) {
      pagerRef.current?.setPage(1);
    }
  };

  if (!document) {
    // If no document is loaded, just show the editor
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <View style={styles.container}>
      {/* Page Indicators */}
      <View style={styles.indicatorContainer}>
        <View style={styles.indicatorTrack}>
          <Animated.View 
            style={[
              styles.indicatorSlider,
              {
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, screenWidth / 2],
                    }),
                  },
                ],
              },
            ]}
          />
          <TouchableOpacity 
            style={styles.indicatorButton}
            onPress={switchToEdit}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.indicatorText,
              currentPage === 0 && styles.indicatorTextActive
            ]}>
              ✏️ Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.indicatorButton}
            onPress={switchToPreview}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.indicatorText,
              currentPage === 1 && styles.indicatorTextActive
            ]}>
              👁️ Preview
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Swipeable Content */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
        orientation="horizontal"
        scrollEnabled={true}
      >
        {/* Page 0: Editor */}
        <View key="editor" style={styles.page}>
          {children}
        </View>

        {/* Page 1: Preview */}
        <View key="preview" style={styles.page}>
          <EmailPreview 
            document={document} 
            onBack={switchToEdit}
          />
        </View>
      </PagerView>

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
    </View>
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
    right: '50%',
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
  
  // Pager View
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
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