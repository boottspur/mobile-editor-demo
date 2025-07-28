import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { ContainerProps, BlockNode } from '@/types';

interface ContainerBlockProps {
  node: BlockNode;
  isSelected: boolean;
  onSelect: () => void;
  renderBlock: (node: BlockNode) => React.ReactNode;
}

export const ContainerBlock: React.FC<ContainerBlockProps> = ({
  node,
  isSelected,
  onSelect,
  renderBlock,
}) => {
  const props = node.props as ContainerProps;
  
  const containerStyle: ViewStyle = {
    padding: props.padding || 20,
    backgroundColor: props.backgroundColor || '#ffffff',
    width: (props.width || '100%') as DimensionValue,
    borderWidth: isSelected ? 2 : 0,
    borderColor: '#1976d2',
    borderStyle: 'dashed',
  };

  return (
    <View
      style={[styles.container, containerStyle]}
      onTouchEnd={onSelect}
    >
      {node.children?.map((child) => (
        <View key={child.id} style={styles.childWrapper}>
          {renderBlock(child)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
  },
  childWrapper: {
    marginBottom: 10,
  },
});