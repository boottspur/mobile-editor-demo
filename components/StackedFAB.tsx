import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

interface FABAction {
  icon: string;
  label: string;
  onPress: () => void;
}

interface StackedFABProps {
  actions: FABAction[];
  style?: any;
}

const { width: screenWidth } = Dimensions.get('window');

export const StackedFAB: React.FC<StackedFABProps> = ({ actions, style }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const mainButtonRotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Secondary Action Buttons */}
      {actions.map((action, index) => {
        const translateY = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(index + 1) * 60],
        });

        const opacity = animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0, 1],
        });

        const scale = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.actionContainer,
              {
                transform: [
                  { translateY },
                  { scale },
                ],
                opacity,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => {
                action.onPress();
                toggleExpanded();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
            </TouchableOpacity>
            {isExpanded && (
              <View style={styles.labelContainer}>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </View>
            )}
          </Animated.View>
        );
      })}

      {/* Main FAB Button */}
      <TouchableOpacity
        style={[styles.actionButton, styles.mainButton]}
        onPress={toggleExpanded}
        activeOpacity={0.9}
      >
        <Animated.Text
          style={[
            styles.mainIcon,
            {
              transform: [{ rotate: mainButtonRotate }],
            },
          ]}
        >
          +
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
  },
  actionContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  mainButton: {
    backgroundColor: '#1976d2',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mainIcon: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '300',
  },
  actionIcon: {
    fontSize: 20,
  },
  labelContainer: {
    position: 'absolute',
    right: 66,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
});