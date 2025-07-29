import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { TextProps, BlockNode } from '../../types';
import { DraggableItem } from '../DraggableItem';

interface TextBlockProps {
  node: { id: string; props: TextProps };
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onUpdate: (props: Partial<TextProps>) => void;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onShowActions?: () => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  node,
  isSelected,
  isEditing,
  onSelect,
  onUpdate,
  onStartEdit,
  onEndEdit,
  onShowActions,
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

  const handleLongPress = () => {
    if (!isEditing) {
      if (onShowActions) {
        onShowActions();
      } else {
        // Fallback to starting edit
        onStartEdit();
      }
    }
  };

  const dragItem = {
    type: 'block' as const,
    item: node as BlockNode,
    sourceId: '', // Will be set by parent
    sourceIndex: 0, // Will be set by parent
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        styles.touchable,
        isSelected && styles.selected,
      ]}
    >
      <Text style={textStyle}>
        {props.content || 'Tap to edit text'}
      </Text>
      {isSelected && !isEditing && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedText}>Long press for actions</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 8,
  },
  selected: {
    borderColor: '#1976d2',
    backgroundColor: 'rgba(25, 118, 210, 0.05)',
  },
  touchable: {
    minHeight: 24,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectedText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  input: {
    minHeight: 30,
    borderRadius: 4,
  },
});