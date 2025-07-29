import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { SpacerProps } from '../../types';

interface SpacerBlockProps {
  node: { id: string; props: SpacerProps };
  isSelected: boolean;
  onSelect: () => void;
}

export const SpacerBlock: React.FC<SpacerBlockProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const props = node.props;

  const handlePress = (event: any) => {
    event.stopPropagation();
    onSelect();
  };

  const containerStyle: ViewStyle = {
    height: props.height || 20,
    backgroundColor: isSelected ? 'rgba(255, 152, 0, 0.1)' : 'transparent',
    borderWidth: isSelected ? 2 : 1,
    borderColor: isSelected ? '#ff9800' : '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <TouchableOpacity 
      style={containerStyle}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {isSelected && (
        <Text style={styles.spacerLabel}>
          Spacer ({props.height || 20}px)
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  spacerLabel: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});