import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, ViewStyle, ImageStyle, DimensionValue } from 'react-native';
import { ImageProps } from '@/types';

interface ImageBlockProps {
  node: { id: string; props: ImageProps };
  isSelected: boolean;
  onSelect: () => void;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const props = node.props;

  const containerStyle: ViewStyle = {
    borderWidth: isSelected ? 2 : 0,
    borderColor: '#1976d2',
    borderStyle: 'dashed',
    padding: isSelected ? 8 : 0,
  };

  const imageStyle: ImageStyle = {
    width: (props.width || '100%') as DimensionValue,
    height: props.height === 'auto' ? undefined : (typeof props.height === 'string' ? undefined : (props.height || 200)) as unknown as DimensionValue,
    aspectRatio: props.height === 'auto' ? 16 / 9 : undefined,
  };

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
      <View style={[styles.container, containerStyle]}>
        <Image
          source={{ uri: props.src }}
          style={imageStyle}
          resizeMode="cover"
          accessibilityLabel={props.alt}
        />
        {!props.src && (
          <View style={[styles.placeholder, { width: imageStyle.width, height: imageStyle.height || 150 }]}>
            <Text style={styles.placeholderText}>Tap to add image</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
});