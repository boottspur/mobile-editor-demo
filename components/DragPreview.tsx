import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useDragDrop } from '../contexts/DragDropContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const DragPreview: React.FC = () => {
  const { isDragging, dragItem, dragPreview } = useDragDrop();

  const animatedStyle = useAnimatedStyle(() => {
    if (!dragPreview) {
      return {
        opacity: 0,
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { scale: 0.8 },
        ] as any,
      };
    }

    return {
      opacity: withSpring(1),
      transform: [
        { translateX: dragPreview.x - 60 }, // Offset so finger doesn't block view
        { translateY: dragPreview.y - 80 },
        { scale: withSpring(0.9) },
      ] as any,
    };
  });

  if (!isDragging || !dragItem || !dragPreview) {
    return null;
  }

  const renderPreviewContent = () => {
    switch (dragItem.type) {
      case 'block':
        return (
          <View style={styles.blockPreview}>
            <Text style={styles.previewIcon}>📝</Text>
            <Text style={styles.previewText}>
              {dragItem.item.type.charAt(0).toUpperCase() + dragItem.item.type.slice(1)} Block
            </Text>
          </View>
        );
        
      case 'layout':
        const layout = dragItem.item as any;
        return (
          <View style={styles.layoutPreview}>
            <Text style={styles.previewIcon}>📊</Text>
            <Text style={styles.previewText}>
              Layout ({layout.columns?.length || 1} column{layout.columns?.length !== 1 ? 's' : ''})
            </Text>
          </View>
        );
        
      case 'section':
        const section = dragItem.item as any;
        return (
          <View style={styles.sectionPreview}>
            <Text style={styles.previewIcon}>📁</Text>
            <Text style={styles.previewText}>
              {section.name || 'Section'}
            </Text>
          </View>
        );
        
      default:
        return (
          <View style={styles.defaultPreview}>
            <Text style={styles.previewIcon}>📦</Text>
            <Text style={styles.previewText}>Item</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.preview, animatedStyle]}>
        {renderPreviewContent()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  preview: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: 120,
    maxWidth: 200,
  },
  blockPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  layoutPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
});