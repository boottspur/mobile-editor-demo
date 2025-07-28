import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

interface BlockToolboxProps {
  onSelectType: (type: 'container' | 'text' | 'image') => void;
  onClose: () => void;
}

export const BlockToolbox: React.FC<BlockToolboxProps> = ({ onSelectType, onClose }) => {
  const blockTypes = [
    {
      type: 'container' as const,
      title: 'Container',
      description: 'A section that can hold other blocks',
      icon: '□',
    },
    {
      type: 'text' as const,
      title: 'Text',
      description: 'Add headings, paragraphs, and more',
      icon: 'T',
    },
    {
      type: 'image' as const,
      title: 'Image',
      description: 'Add images to your email',
      icon: '🖼',
    },
  ];

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <Text style={styles.title}>Add a Block</Text>
          
          {blockTypes.map((block) => (
            <TouchableOpacity
              key={block.type}
              style={styles.blockOption}
              onPress={() => onSelectType(block.type)}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{block.icon}</Text>
              </View>
              <View style={styles.blockInfo}>
                <Text style={styles.blockTitle}>{block.title}</Text>
                <Text style={styles.blockDescription}>{block.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  blockOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 24,
  },
  blockInfo: {
    flex: 1,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  blockDescription: {
    fontSize: 14,
    color: '#666',
  },
});