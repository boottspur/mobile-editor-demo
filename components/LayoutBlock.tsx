import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Layout, Column, BlockNode, BlockType } from '../types';
import { DraggableItem } from './DraggableItem';
import { DropZone } from './DropZone';
import { useDragDrop } from '../contexts/DragDropContext';

interface LayoutBlockProps {
  layout: Layout;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Layout>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  renderBlock: (node: BlockNode) => React.ReactNode;
  onAddBlock: (columnId: string, type: BlockType) => void;
  onMoveBlock: (fromColumnId: string, toColumnId: string, fromIndex: number, toIndex: number) => void;
  sectionId: string;
  layoutIndex: number;
}

export const LayoutBlock: React.FC<LayoutBlockProps> = ({
  layout,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  renderBlock,
  onAddBlock,
  onMoveBlock,
  sectionId,
  layoutIndex,
}) => {
  const [showControls, setShowControls] = useState(false);

  const handleAddColumn = () => {
    if (layout.columns.length >= 3) {
      Alert.alert('Maximum Columns', 'A layout can have at most 3 columns.');
      return;
    }

    const newColumn: Column = {
      id: `column-${Date.now()}`,
      width: Math.floor(100 / (layout.columns.length + 1)),
      blocks: [],
    };

    // Redistribute widths evenly
    const newWidth = Math.floor(100 / (layout.columns.length + 1));
    const updatedColumns = layout.columns.map(col => ({
      ...col,
      width: newWidth,
    }));

    onUpdate({
      columns: [...updatedColumns, newColumn],
    });
  };

  const handleRemoveColumn = (columnId: string) => {
    if (layout.columns.length <= 1) {
      Alert.alert('Minimum Columns', 'A layout must have at least 1 column.');
      return;
    }

    const updatedColumns = layout.columns.filter(col => col.id !== columnId);
    
    // Redistribute widths evenly
    const newWidth = Math.floor(100 / updatedColumns.length);
    const redistributedColumns = updatedColumns.map(col => ({
      ...col,
      width: newWidth,
    }));

    onUpdate({
      columns: redistributedColumns,
    });
  };

  const handleColumnWidthChange = (columnId: string, newWidth: number) => {
    const updatedColumns = layout.columns.map(col =>
      col.id === columnId ? { ...col, width: newWidth } : col
    );
    onUpdate({ columns: updatedColumns });
  };

  const handleBackgroundColorChange = (color: string) => {
    onUpdate({ backgroundColor: color });
    setShowControls(false);
  };

  const toggleDynamic = () => {
    onUpdate({ isDynamic: !layout.isDynamic });
  };

  const backgroundColors = [
    '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
    '#1976d2', '#dc3545', '#28a745', '#ffc107',
    '#17a2b8', '#6f42c1', '#fd7e14', '#20c997'
  ];

  const layoutDragItem = {
    type: 'layout' as const,
    item: layout,
    sourceId: sectionId,
    sourceIndex: layoutIndex,
  };

  return (
    <>
      <DraggableItem 
        dragItem={layoutDragItem}
        style={[
          styles.layoutContainer,
          { backgroundColor: layout.backgroundColor || '#ffffff' },
          isSelected && styles.selectedLayout,
        ]}
      >
        <TouchableOpacity
          onPress={onSelect}
          onLongPress={() => setShowControls(true)}
          activeOpacity={0.8}
          style={styles.layoutTouchable}
        >
        {/* Layout Header with Controls */}
        {isSelected && (
          <View style={styles.layoutHeader}>
            <View style={styles.layoutInfo}>
              <Text style={styles.layoutTitle}>Layout</Text>
              {layout.isDynamic && (
                <Text style={styles.dynamicBadge}>Dynamic</Text>
              )}
            </View>
            <View style={styles.layoutActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowControls(true)}
              >
                <Text style={styles.actionButtonText}>⚙️</Text>
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
          </View>
        )}

        {/* Columns */}
        <View style={styles.layoutColumns}>
          {layout.columns.map((column, index) => (
            <View
              key={column.id}
              style={[
                styles.column,
                { flex: column.width / 100 },
                isSelected && styles.selectedColumn,
              ]}
            >
              {/* Column Header */}
              {isSelected && (
                <View style={styles.columnHeader}>
                  <Text style={styles.columnTitle}>
                    {column.width}%
                  </Text>
                  {layout.columns.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeColumnButton}
                      onPress={() => handleRemoveColumn(column.id)}
                    >
                      <Text style={styles.removeColumnText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Column Content */}
              <DropZone
                dropZone={{
                  type: 'column',
                  id: column.id,
                  accepts: ['block'],
                }}
                style={styles.columnContent}
                placeholder="Drop blocks here"
              >
                {column.blocks.map((block, blockIndex) => (
                  <View key={block.id} style={styles.blockWrapper}>
                    {renderBlock(block)}
                  </View>
                ))}
                
                {column.blocks.length === 0 && (
                  <View style={styles.emptyColumn}>
                    <Text style={styles.emptyColumnText}>Empty column</Text>
                    <Text style={styles.emptyColumnHint}>Tap + to add blocks</Text>
                  </View>
                )}
              </DropZone>
            </View>
          ))}
        </View>

        {/* Add Column Button */}
        {isSelected && layout.columns.length < 3 && (
          <TouchableOpacity
            style={styles.addColumnButton}
            onPress={handleAddColumn}
          >
            <Text style={styles.addColumnText}>+ Add Column</Text>
          </TouchableOpacity>
        )}
        </TouchableOpacity>
      </DraggableItem>

      {/* Layout Controls Modal */}
      <Modal
        visible={showControls}
        transparent
        animationType="slide"
        onRequestClose={() => setShowControls(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowControls(false)}
          activeOpacity={1}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Layout Settings</Text>
              <TouchableOpacity onPress={() => setShowControls(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Dynamic Toggle */}
              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Dynamic Layout</Text>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    layout.isDynamic && styles.toggleButtonActive,
                  ]}
                  onPress={toggleDynamic}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    layout.isDynamic && styles.toggleButtonTextActive,
                  ]}>
                    {layout.isDynamic ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Background Color */}
              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Background Color</Text>
                <View style={styles.colorGrid}>
                  {backgroundColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        layout.backgroundColor === color && styles.selectedColor,
                      ]}
                      onPress={() => handleBackgroundColorChange(color)}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedLayout: {
    borderColor: '#1976d2',
    borderWidth: 2,
  },
  layoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  layoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  layoutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  dynamicBadge: {
    fontSize: 10,
    color: '#1976d2',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '500',
  },
  layoutActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionButtonText: {
    fontSize: 14,
  },
  layoutColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  column: {
    minHeight: 50,
  },
  selectedColumn: {
    backgroundColor: 'rgba(25, 118, 210, 0.05)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.2)',
    borderStyle: 'dashed',
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    borderRadius: 4,
    marginBottom: 5,
  },
  columnTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
  },
  removeColumnButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeColumnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  columnContent: {
    flex: 1,
  },
  blockWrapper: {
    marginBottom: 10,
  },
  emptyColumn: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyColumnText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  emptyColumnHint: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  addColumnButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addColumnText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  layoutTouchable: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  settingGroup: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  toggleButtonActive: {
    backgroundColor: '#1976d2',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedColor: {
    borderColor: '#1976d2',
    borderWidth: 3,
  },
});