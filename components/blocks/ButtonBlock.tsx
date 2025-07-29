import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ButtonProps } from '../../types';

interface ButtonBlockProps {
  node: { id: string; props: ButtonProps };
  isSelected: boolean;
  onSelect: () => void;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const props = node.props;

  const handlePress = (event: any) => {
    event.stopPropagation();
    onSelect();
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: props.backgroundColor || '#1976d2',
    borderRadius: props.borderRadius || 8,
    padding: 15,
    alignSelf: props.width === '100%' ? 'stretch' : 'center',
    maxWidth: props.width === '100%' ? undefined : 200,
    borderWidth: isSelected ? 2 : 0,
    borderColor: '#ff9800',
    borderStyle: 'dashed',
  };

  return (
    <TouchableOpacity 
      style={buttonStyle}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.buttonText,
        { color: props.textColor || '#ffffff' }
      ]}>
        {props.text || 'Button Text'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});