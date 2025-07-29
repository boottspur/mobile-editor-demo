import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { DividerProps } from '../../types';

interface DividerBlockProps {
  node: { id: string; props: DividerProps };
  isSelected: boolean;
  onSelect: () => void;
}

export const DividerBlock: React.FC<DividerBlockProps> = ({
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
    paddingVertical: 10,
    borderWidth: isSelected ? 2 : 0,
    borderColor: '#ff9800',
    borderStyle: 'dashed',
    borderRadius: 4,
  };

  const dividerStyle: ViewStyle = {
    height: props.thickness || 1,
    backgroundColor: props.color || '#e0e0e0',
    width: '100%',
    borderStyle: props.style || 'solid',
    borderWidth: props.style === 'solid' ? 0 : 1,
    borderColor: props.color || '#e0e0e0',
  };

  return (
    <TouchableOpacity 
      style={containerStyle}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={dividerStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // No additional styles needed
});