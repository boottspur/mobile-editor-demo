import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useDragDrop, DropZone as DropZoneType } from '../contexts/DragDropContext';

interface DropZoneProps {
  dropZone: DropZoneType;
  children?: React.ReactNode;
  style?: any;
  placeholder?: string;
  showPlaceholder?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  dropZone,
  children,
  style,
  placeholder = 'Drop here',
  showPlaceholder = true,
}) => {
  const { 
    isDragging, 
    dragItem, 
    dragPreview, 
    activeDropZone,
    setActiveDropZone,
    onDrop,
    endDrag
  } = useDragDrop();
  
  const [isHovering, setIsHovering] = useState(false);
  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const borderWidth = useSharedValue(1);
  const borderColor = useSharedValue('#e0e0e0');
  const backgroundColor = useSharedValue('transparent');
  const scale = useSharedValue(1);

  // Check if this drop zone accepts the current drag item
  const canAcceptDragItem = () => {
    if (!dragItem) return false;
    return dropZone.accepts.includes(dragItem.type);
  };

  // Check if the drag is hovering over this drop zone
  const checkHover = () => {
    if (!dragPreview || !canAcceptDragItem()) return false;
    
    const { x, y } = dragPreview;
    return (
      x >= layout.x &&
      x <= layout.x + layout.width &&
      y >= layout.y &&
      y <= layout.y + layout.height
    );
  };

  // Update hover state when drag position changes
  useEffect(() => {
    if (!isDragging || !dragPreview) {
      setIsHovering(false);
      return;
    }

    const hovering = checkHover();
    if (hovering !== isHovering) {
      setIsHovering(hovering);
      setActiveDropZone(hovering ? dropZone.id : null);
    }
  }, [dragPreview, isDragging, layout]);

  // Handle drop
  useEffect(() => {
    if (!isDragging && isHovering && dragItem && onDrop) {
      onDrop(dragItem, dropZone);
      setIsHovering(false);
    }
  }, [isDragging, isHovering, dragItem, onDrop]);

  // Animate based on state
  useEffect(() => {
    if (isHovering && canAcceptDragItem()) {
      borderWidth.value = withSpring(2);
      borderColor.value = '#1976d2';
      backgroundColor.value = 'rgba(25, 118, 210, 0.1)';
      scale.value = withSpring(1.02);
    } else if (isDragging && canAcceptDragItem()) {
      borderWidth.value = withTiming(2);
      borderColor.value = '#90caf9';
      backgroundColor.value = 'rgba(25, 118, 210, 0.05)';
      scale.value = 1;
    } else {
      borderWidth.value = withTiming(1);
      borderColor.value = '#e0e0e0';
      backgroundColor.value = 'transparent';
      scale.value = 1;
    }
  }, [isHovering, isDragging, dragItem]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderWidth: borderWidth.value,
    borderColor: borderColor.value,
    backgroundColor: backgroundColor.value,
    transform: [{ scale: scale.value }],
  }));

  const handleLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    event.target.measure((fx: number, fy: number, w: number, h: number, px: number, py: number) => {
      setLayout({ x: px, y: py, width: w, height: h });
    });
  };

  const showDropPlaceholder = isDragging && canAcceptDragItem() && (!children || (Array.isArray(children) && children.length === 0));

  return (
    <Animated.View
      style={[styles.dropZone, style, animatedStyle]}
      onLayout={handleLayout}
    >
      {children}
      
      {showDropPlaceholder && showPlaceholder && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{placeholder}</Text>
          <View style={styles.placeholderIcon}>
            <Text style={styles.placeholderIconText}>📦</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dropZone: {
    borderStyle: 'dashed',
    borderRadius: 8,
    minHeight: 60,
    position: 'relative',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  placeholderIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIconText: {
    fontSize: 20,
    opacity: 0.6,
  },
});