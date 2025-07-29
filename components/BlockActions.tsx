import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { BlockNode, Section, Layout, Column } from '../types';

interface BlockActionsProps {
  block: BlockNode;
  visible: boolean;
  onClose: () => void;
  onCopy: (block: BlockNode) => void;
  onDelete: (blockId: string) => void;
  onMove: (blockId: string, targetColumnId: string) => void;
  availableColumns: Array<{
    id: string;
    label: string;
    sectionName: string;
    layoutIndex: number;
    columnIndex: number;
  }>;
  currentColumnId: string;
}

const { height: screenHeight } = Dimensions.get('window');

export const BlockActions: React.FC<BlockActionsProps> = ({
  block,
  visible,
  onClose,
  onCopy,
  onDelete,
  onMove,
  availableColumns,
  currentColumnId,
}) => {
  const [showMoveOptions, setShowMoveOptions] = useState(false);

  const handleCopy = () => {
    onCopy(block);
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Block',
      'Are you sure you want to delete this block? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(block.id);
            onClose();
          },
        },
      ]
    );
  };

  const handleMove = (targetColumnId: string) => {
    onMove(block.id, targetColumnId);
    setShowMoveOptions(false);
    onClose();
  };

  const getBlockTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'image': return '🖼️';
      case 'button': return '🔲';
      case 'divider': return '➖';
      case 'spacer': return '⬜';
      case 'video': return '🎥';
      case 'container': return '📦';
      default: return '📄';
    }
  };

  const getBlockTypeName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  const otherColumns = availableColumns.filter(col => col.id !== currentColumnId);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        onPress={onClose}
        activeOpacity={1}
      >
        <View 
          style={[styles.container, { maxHeight: screenHeight * 0.7 }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.handle} />
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.blockInfo}>
              <Text style={styles.blockIcon}>{getBlockTypeIcon(block.type)}</Text>
              <View>
                <Text style={styles.blockTitle}>{getBlockTypeName(block.type)} Block</Text>
                <Text style={styles.blockId}>ID: {block.id.slice(-8)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <View style={styles.content}>
            {!showMoveOptions ? (
              <>
                {/* Copy Action */}
                <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                  <View style={styles.actionIcon}>
                    <Text style={styles.actionIconText}>📋</Text>
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Copy Block</Text>
                    <Text style={styles.actionDescription}>
                      Create a duplicate of this block
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Move Action */}
                {otherColumns.length > 0 && (
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => setShowMoveOptions(true)}
                  >
                    <View style={styles.actionIcon}>
                      <Text style={styles.actionIconText}>📦</Text>
                    </View>
                    <View style={styles.actionContent}>
                      <Text style={styles.actionTitle}>Move Block</Text>
                      <Text style={styles.actionDescription}>
                        Move to a different column ({otherColumns.length} available)
                      </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                )}

                {/* Delete Action */}
                <TouchableOpacity style={[styles.actionButton, styles.deleteAction]} onPress={handleDelete}>
                  <View style={styles.actionIcon}>
                    <Text style={styles.actionIconText}>🗑️</Text>
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={[styles.actionTitle, styles.deleteText]}>Delete Block</Text>
                    <Text style={[styles.actionDescription, styles.deleteText]}>
                      Permanently remove this block
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Move Options Header */}
                <View style={styles.moveHeader}>
                  <TouchableOpacity 
                    onPress={() => setShowMoveOptions(false)}
                    style={styles.backButton}
                  >
                    <Text style={styles.backButtonText}>‹ Back</Text>
                  </TouchableOpacity>
                  <Text style={styles.moveTitle}>Move to Column</Text>
                </View>

                {/* Move Options */}
                <ScrollView style={styles.moveOptions} showsVerticalScrollIndicator={false}>
                  {otherColumns.map((column) => (
                    <TouchableOpacity
                      key={column.id}
                      style={styles.moveOption}
                      onPress={() => handleMove(column.id)}
                    >
                      <View style={styles.moveOptionContent}>
                        <Text style={styles.moveOptionTitle}>{column.label}</Text>
                        <Text style={styles.moveOptionDetails}>
                          {column.sectionName} → Layout {column.layoutIndex + 1} → Column {column.columnIndex + 1}
                        </Text>
                      </View>
                      <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  blockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  blockId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
  },
  deleteAction: {
    backgroundColor: '#ffebee',
  },
  actionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  deleteText: {
    color: '#d32f2f',
  },
  chevron: {
    fontSize: 20,
    color: '#ccc',
    marginLeft: 8,
  },
  moveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 18,
    color: '#1976d2',
    fontWeight: '500',
  },
  moveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  moveOptions: {
    maxHeight: 300,
  },
  moveOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
  },
  moveOptionContent: {
    flex: 1,
  },
  moveOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  moveOptionDetails: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});