import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, ViewStyle, ImageStyle, DimensionValue } from 'react-native';
import { ImageProps } from '../../types';

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
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);
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

  const handlePress = (event: any) => {
    event.stopPropagation();
    onSelect();
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', props.src);
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (error: any) => {
    console.warn('❌ Failed to load image:', props.src, error.nativeEvent);
    setImageLoading(false);
    setImageError(true);
  };

  // Reset loading state when src changes
  React.useEffect(() => {
    if (props.src) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [props.src]);

  const showPlaceholder = !props.src || imageError;
  const showLoadingState = props.src && imageLoading && !imageError;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={[styles.container, containerStyle]}>
        {props.src && (
          <Image
            source={{ uri: props.src }}
            style={imageStyle}
            resizeMode="cover"
            accessibilityLabel={props.alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {(showPlaceholder || showLoadingState) && (
          <View style={[
            styles.placeholder, 
            { 
              width: imageStyle.width, 
              height: imageStyle.height || 150,
              position: showLoadingState ? 'absolute' : 'relative',
              backgroundColor: showLoadingState ? 'rgba(240, 240, 240, 0.8)' : '#e0e0e0'
            }
          ]}>
            <Text style={styles.placeholderText}>
              {!props.src ? 'Tap to add image' : 
               imageError ? 'Failed to load image' : 
               'Loading image...'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
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
    textAlign: 'center',
  },
});