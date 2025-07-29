import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Section, Layout, BlockNode, BlockType } from '../types';
import { LayoutBlock } from './LayoutBlock';

interface SectionBlockProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Section>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  renderBlock: (node: BlockNode) => React.ReactNode;
  onAddBlock: (columnId: string, type: BlockType) => void;
  selectedLayoutId?: string;
  onSelectLayout: (layoutId: string) => void;
  viewMode?: 'mobile' | 'desktop';
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  renderBlock,
  onAddBlock,
  selectedLayoutId,
  onSelectLayout,
  viewMode = 'mobile',
}) => {
  const [showNameEditor, setShowNameEditor] = useState(false);
  const [editedName, setEditedName] = useState(section.name || '');

  const handleAddLayout = () => {
    const newLayout: Layout = {
      id: `layout-${Date.now()}`,
      columns: [{
        id: `column-${Date.now()}`,
        width: 100,
        blocks: [],
      }],
      backgroundColor: '#ffffff',
      isDynamic: false,
    };

    onUpdate({
      layouts: [...section.layouts, newLayout],
    });
  };

  const handleLayoutUpdate = (layoutId: string, updates: Partial<Layout>) => {
    const updatedLayouts = section.layouts.map(layout =>
      layout.id === layoutId ? { ...layout, ...updates } : layout
    );
    onUpdate({ layouts: updatedLayouts });
  };

  const handleLayoutDelete = (layoutId: string) => {
    if (section.layouts.length <= 1) {
      Alert.alert('Cannot Delete', 'A section must have at least one layout.');
      return;
    }

    Alert.alert(
      'Delete Layout',
      'Are you sure you want to delete this layout? All blocks inside will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedLayouts = section.layouts.filter(layout => layout.id !== layoutId);
            onUpdate({ layouts: updatedLayouts });
          },
        },
      ]
    );
  };

  const handleLayoutDuplicate = (layoutId: string) => {
    const layoutToDuplicate = section.layouts.find(l => l.id === layoutId);
    if (!layoutToDuplicate) return;

    const duplicatedLayout: Layout = {
      ...layoutToDuplicate,
      id: `layout-${Date.now()}`,
      columns: layoutToDuplicate.columns.map(column => ({
        ...column,
        id: `column-${Date.now()}`,
        blocks: column.blocks.map(block => ({
          ...block,
          id: `block-${Date.now()}`,
        })),
      })),
    };

    const layoutIndex = section.layouts.findIndex(l => l.id === layoutId);
    const updatedLayouts = [...section.layouts];
    updatedLayouts.splice(layoutIndex + 1, 0, duplicatedLayout);
    
    onUpdate({ layouts: updatedLayouts });
  };

  const handleSaveName = () => {
    onUpdate({ name: editedName });
    setShowNameEditor(false);
  };

  const handleCancelNameEdit = () => {
    setEditedName(section.name || '');
    setShowNameEditor(false);
  };

  return (
    <>
      <View style={[styles.sectionContainer, isSelected && styles.selectedSection]}>
        {/* Section Header */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={onSelect}
          onLongPress={() => setShowNameEditor(true)}
        >
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitle}>
              {section.name || 'Untitled Section'}
            </Text>
            <Text style={styles.sectionMeta}>
              {section.layouts.length} layout{section.layouts.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {isSelected && (
            <View style={styles.sectionActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowNameEditor(true)}
              >
                <Text style={styles.actionButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onMoveUp}
              >
                <Text style={styles.actionButtonText}>⬆️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onMoveDown}
              >
                <Text style={styles.actionButtonText}>⬇️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onDuplicate}
              >
                <Text style={styles.actionButtonText}>📋</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={onDelete}
              >
                <Text style={styles.actionButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* Layouts */}
        <View style={styles.layoutsContainer}>
          {section.layouts.map((layout) => (
            <LayoutBlock
              key={layout.id}
              layout={layout}
              isSelected={selectedLayoutId === layout.id}
              onSelect={() => onSelectLayout(layout.id)}
              onUpdate={(updates) => handleLayoutUpdate(layout.id, updates)}
              onDelete={() => handleLayoutDelete(layout.id)}
              onDuplicate={() => handleLayoutDuplicate(layout.id)}
              renderBlock={renderBlock}
              onAddBlock={onAddBlock}
              onMoveBlock={(fromColumnId, toColumnId, fromIndex, toIndex) => {
                // Handle block movement between columns - will be implemented by parent
              }}
              sectionId={section.id}
              layoutIndex={section.layouts.findIndex(l => l.id === layout.id)}
              viewMode={viewMode}
            />
          ))}

          {/* Add Layout Button */}
          {isSelected && (
            <TouchableOpacity
              style={styles.addLayoutButton}
              onPress={handleAddLayout}
            >
              <Text style={styles.addLayoutText}>+ Add Layout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Name Editor Modal */}
      <Modal
        visible={showNameEditor}
        transparent
        animationType="fade"
        onRequestClose={handleCancelNameEdit}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={handleCancelNameEdit}
          activeOpacity={1}
        >
          <View
            style={styles.nameEditorModal}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.nameEditorTitle}>Section Name</Text>
            <TextInput
              style={styles.nameInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter section name"
              autoFocus
              selectTextOnFocus
            />
            <View style={styles.nameEditorActions}>
              <TouchableOpacity
                style={styles.nameEditorButton}
                onPress={handleCancelNameEdit}
              >
                <Text style={styles.nameEditorButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.nameEditorButton, styles.nameEditorSaveButton]}
                onPress={handleSaveName}
              >
                <Text style={[styles.nameEditorButtonText, styles.nameEditorSaveButtonText]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSection: {
    borderColor: '#1976d2',
    borderWidth: 2,
    backgroundColor: '#f3f8ff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  sectionMeta: {
    fontSize: 12,
    color: '#666',
  },
  sectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
  },
  actionButtonText: {
    fontSize: 14,
  },
  layoutsContainer: {
    padding: 10,
  },
  addLayoutButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addLayoutText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameEditorModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
    maxWidth: '90%',
  },
  nameEditorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  nameEditorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  nameEditorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  nameEditorSaveButton: {
    backgroundColor: '#1976d2',
  },
  nameEditorButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  nameEditorSaveButtonText: {
    color: '#fff',
  },
});