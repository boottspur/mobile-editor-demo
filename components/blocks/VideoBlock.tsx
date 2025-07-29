import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { VideoProps } from '../../types';

interface VideoBlockProps {
  node: { id: string; props: VideoProps };
  isSelected: boolean;
  onSelect: () => void;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const [imageError, setImageError] = useState(false);
  const props = node.props;

  const handlePress = (event: any) => {
    event.stopPropagation();
    onSelect();
  };

  const containerStyle: ViewStyle = {
    borderWidth: isSelected ? 2 : 0,
    borderColor: '#ff9800',
    borderStyle: 'dashed',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  };

  return (
    <TouchableOpacity 
      style={containerStyle}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.videoContainer}>
        {props.thumbnail && !imageError ? (
          <Image
            source={{ uri: props.thumbnail }}
            style={styles.thumbnail}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>▶</Text>
          </View>
        )}
        
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
        
        {props.title && (
          <View style={styles.titleOverlay}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {props.title}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  placeholderIcon: {
    fontSize: 48,
    color: '#fff',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playIcon: {
    fontSize: 24,
    color: '#333',
    marginLeft: 4, // Slight offset for visual centering
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});