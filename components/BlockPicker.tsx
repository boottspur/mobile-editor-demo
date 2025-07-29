import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { BlockType } from '../types';

interface BlockPickerProps {
  onSelectType: (type: BlockType) => void;
}

interface BlockOption {
  type: BlockType;
  title: string;
  description: string;
  icon: string;
  category: 'basic' | 'media' | 'interactive' | 'social' | 'advanced';
}

const blockOptions: BlockOption[] = [
  // Basic
  { type: 'text', title: 'Text', description: 'Add headings, paragraphs, and formatted text', icon: '📝', category: 'basic' },
  { type: 'image', title: 'Image', description: 'Add photos and graphics', icon: '🖼️', category: 'basic' },
  { type: 'button', title: 'Button', description: 'Call-to-action buttons', icon: '🔲', category: 'basic' },
  { type: 'divider', title: 'Divider', description: 'Horizontal line separator', icon: '➖', category: 'basic' },
  { type: 'spacer', title: 'Spacer', description: 'Add vertical spacing', icon: '⬜', category: 'basic' },
  
  // Media
  { type: 'video', title: 'Video', description: 'Embed video content', icon: '🎥', category: 'media' },
  
  // Interactive
  { type: 'read-more', title: 'Read More', description: 'Expandable text content', icon: '📖', category: 'interactive' },
  { type: 'feedback', title: 'Feedback', description: 'Collect user feedback', icon: '💭', category: 'interactive' },
  { type: 'rsvp', title: 'RSVP', description: 'Event response form', icon: '✅', category: 'interactive' },
  
  // Social
  { type: 'social-share', title: 'Social Share', description: 'Share buttons for social media', icon: '📤', category: 'social' },
  { type: 'social-follow', title: 'Social Follow', description: 'Follow us on social media', icon: '👥', category: 'social' },
  
  // Advanced
  { type: 'container', title: 'Container', description: 'Group other blocks together', icon: '📦', category: 'advanced' },
  { type: 'data-table', title: 'Data Table', description: 'Display tabular data', icon: '📊', category: 'advanced' },
  { type: 'event', title: 'Event', description: 'Event details and information', icon: '📅', category: 'advanced' },
  { type: 'product', title: 'Product', description: 'Product showcase with buy button', icon: '🛍️', category: 'advanced' },
];

const categories = [
  { id: 'basic', title: 'Basic', icon: '📝' },
  { id: 'media', title: 'Media', icon: '🎥' },
  { id: 'interactive', title: 'Interactive', icon: '⚡' },
  { id: 'social', title: 'Social', icon: '📤' },
  { id: 'advanced', title: 'Advanced', icon: '🔧' },
];

export const BlockPicker: React.FC<BlockPickerProps> = ({ onSelectType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');
  const [fabAnimation] = useState(new Animated.Value(0));

  const { height: screenHeight } = Dimensions.get('window');

  const togglePicker = () => {
    console.log('BlockPicker togglePicker called, current state:', isOpen, 'Platform:', Platform.OS);
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);
    
    Animated.spring(fabAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleSelectBlock = (type: BlockType) => {
    onSelectType(type);
    togglePicker();
  };

  const filteredBlocks = blockOptions.filter(block => block.category === selectedCategory);

  const fabRotation = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <>
      {/* FAB Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={togglePicker}
        activeOpacity={0.8}
      >
        <Animated.Text 
          style={[
            styles.fabIcon,
            { transform: [{ rotate: fabRotation }] }
          ]}
        >
          +
        </Animated.Text>
      </TouchableOpacity>

      {/* Block Picker Modal */}
      <Modal
        visible={isOpen}
        transparent={Platform.OS === 'ios'}
        animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
        onRequestClose={togglePicker}
        statusBarTranslucent={Platform.OS === 'android'}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={togglePicker}
          activeOpacity={1}
        >
          <TouchableOpacity 
            style={[styles.pickerContainer, { maxHeight: screenHeight * 0.8 }]}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.handle} />
            
            <Text style={styles.pickerTitle}>Add Block</Text>
            
            {/* Category Tabs */}
            <ScrollView 
              horizontal 
              style={styles.categoryTabs}
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryTab,
                    selectedCategory === category.id && styles.activeCategoryTab
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.activeCategoryText
                  ]}>
                    {category.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Block Options */}
            <ScrollView style={styles.blocksContainer}>
              {filteredBlocks.map((block) => (
                <TouchableOpacity
                  key={block.type}
                  style={styles.blockOption}
                  onPress={() => handleSelectBlock(block.type)}
                  activeOpacity={0.7}
                >
                  <View style={styles.blockIcon}>
                    <Text style={styles.blockIconText}>{block.icon}</Text>
                  </View>
                  <View style={styles.blockInfo}>
                    <Text style={styles.blockTitle}>{block.title}</Text>
                    <Text style={styles.blockDescription}>{block.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'android' ? 60 : 40,
    elevation: Platform.OS === 'android' ? 16 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoryTabs: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeCategoryTab: {
    backgroundColor: '#1976d2',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
  },
  blocksContainer: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  blockOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  blockIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  blockIconText: {
    fontSize: 24,
  },
  blockInfo: {
    flex: 1,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  blockDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});