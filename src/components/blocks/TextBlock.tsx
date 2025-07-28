import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { TextProps } from '@/types';

interface TextBlockProps {
  node: { id: string; props: TextProps };
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onUpdate: (props: Partial<TextProps>) => void;
  onStartEdit: () => void;
  onEndEdit: () => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  node,
  isSelected,
  isEditing,
  onSelect,
  onUpdate,
  onStartEdit,
  onEndEdit,
}) => {
  const [tempContent, setTempContent] = useState(node.props.content);
  const props = node.props;

  const textStyle: TextStyle = {
    fontSize: props.fontSize || 16,
    color: props.color || '#333333',
    fontWeight: props.fontWeight || 'normal',
    fontStyle: props.fontStyle || 'normal',
    textAlign: props.textAlign || 'left',
    borderWidth: isSelected ? 2 : 0,
    borderColor: '#1976d2',
    borderStyle: 'dashed',
    padding: isSelected ? 8 : 0,
    minHeight: 30,
  };

  const handleEditComplete = () => {
    onUpdate({ content: tempContent });
    onEndEdit();
  };

  if (isEditing) {
    return (
      <TextInput
        style={[styles.input, textStyle]}
        value={tempContent}
        onChangeText={setTempContent}
        onBlur={handleEditComplete}
        onSubmitEditing={handleEditComplete}
        multiline
        autoFocus
      />
    );
  }

  const handlePress = () => {
    if (isSelected) {
      // If already selected, start editing
      onStartEdit();
    } else {
      // If not selected, select first
      onSelect();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      onLongPress={onStartEdit}
      activeOpacity={0.8}
    >
      <Text style={textStyle}>
        {props.content || 'Tap to edit text'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  input: {
    minHeight: 30,
    borderRadius: 4,
  },
});