import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ProductProps } from '../../types';

interface ProductBlockProps {
  node: { id: string; props: ProductProps };
  isSelected: boolean;
  onSelect: () => void;
}

export const ProductBlock: React.FC<ProductBlockProps> = ({
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
    borderWidth: isSelected ? 2 : 1,
    borderColor: isSelected ? '#ff9800' : '#e0e0e0',
    borderStyle: isSelected ? 'dashed' : 'solid',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  };

  const isHorizontal = props.layout === 'horizontal';

  return (
    <TouchableOpacity 
      style={containerStyle}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[
        styles.container,
        isHorizontal ? styles.horizontalLayout : styles.verticalLayout
      ]}>
        <View style={[
          styles.imageContainer,
          isHorizontal ? styles.horizontalImage : styles.verticalImage
        ]}>
          {props.image && !imageError ? (
            <Image
              source={{ uri: props.image }}
              style={styles.productImage}
              onError={() => setImageError(true)}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>📦</Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.productName} numberOfLines={2}>
            {props.name || 'Product Name'}
          </Text>
          
          <Text style={styles.productPrice}>
            {props.price || '$0.00'}
          </Text>
          
          {props.description && (
            <Text style={styles.productDescription} numberOfLines={3}>
              {props.description}
            </Text>
          )}
          
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  horizontalLayout: {
    flexDirection: 'row',
  },
  verticalLayout: {
    flexDirection: 'column',
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  horizontalImage: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  verticalImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  buyButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});