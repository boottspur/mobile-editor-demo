import React, { useRef, useState } from 'react';
import {
  View,
  PanGestureHandler,
  LongPressGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useDragDrop, DragItem } from '../contexts/DragDropContext';
import { StyleSheet, Dimensions, Vibration, Platform } from 'react-native';

interface DraggableItemProps {
  dragItem: DragItem;
  children: React.ReactNode;
  style?: any;
  disabled?: boolean;
  longPressDuration?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const DraggableItem: React.FC<DraggableItemProps> = ({
  dragItem,
  children,
  style,
  disabled = false,
  longPressDuration = 400,
}) => {
  const { startDrag, updateDragPosition, endDrag, isDragging } = useDragDrop();
  const [isDragActive, setIsDragActive] = useState(false);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const zIndex = useSharedValue(1);

  const panRef = useRef();
  const longPressRef = useRef();

  const startDragAction = (x: number, y: number) => {
    if (disabled) return;
    
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    } else {
      Vibration.vibrate(50);
    }
    
    setIsDragActive(true);
    startDrag(dragItem, { x, y });
    
    // Animate to dragging state
    scale.value = withSpring(1.05);
    opacity.value = withTiming(0.9);
    zIndex.value = 1000;
  };

  const updateDragAction = (x: number, y: number) => {
    updateDragPosition({ x, y });
  };

  const endDragAction = () => {
    setIsDragActive(false);
    endDrag();
    
    // Animate back to normal state
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
    zIndex.value = 1;
  };

  const longPressHandler = useAnimatedGestureHandler({
    onStart: (event) => {
      runOnJS(startDragAction)(event.absoluteX, event.absoluteY);
    },
  });

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (event) => {
      // Only allow pan if long press was triggered first
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Update global drag position
      runOnJS(updateDragAction)(event.absoluteX, event.absoluteY);
    },
    onEnd: () => {
      runOnJS(endDragAction)();
    },
    onCancel: () => {
      runOnJS(endDragAction)();
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    zIndex: zIndex.value,
  }));

  // Don't render drag behavior if currently dragging something else
  if (isDragging && !isDragActive) {
    return (
      <View style={[style, styles.dimmed]}>
        {children}
      </View>
    );
  }

  if (disabled) {
    return (
      <View style={style}>
        {children}
      </View>
    );
  }

  return (
    <LongPressGestureHandler
      ref={longPressRef}
      onGestureEvent={longPressHandler}
      minDurationMs={longPressDuration}
      maxDist={10}
      simultaneousHandlers={panRef}
    >
      <Animated.View>
        <PanGestureHandler
          ref={panRef}
          onGestureEvent={panGestureHandler}
          simultaneousHandlers={longPressRef}
          shouldCancelWhenOutside={false}
          activeOffsetX={[-10, 10]}
          activeOffsetY={[-10, 10]}
        >
          <Animated.View style={[style, animatedStyle, isDragActive && styles.dragging]}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

const styles = StyleSheet.create({
  dragging: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dimmed: {
    opacity: 0.6,
  },
});