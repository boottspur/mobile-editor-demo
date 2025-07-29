import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { EmailDocument, BlockNode, BlockType, Section, Layout, Column } from '../types';
import { documentStorage } from '../utils/documentStorage';
import { useDeepLink } from '../contexts/DeepLinkContext';
import { migrateDocument } from '../utils/documentMigration';
import { DocumentList } from './DocumentList';
import { ContainerBlock } from './blocks/ContainerBlock';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { DividerBlock } from './blocks/DividerBlock';
import { SpacerBlock } from './blocks/SpacerBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { ProductBlock } from './blocks/ProductBlock';
import { BlockPicker } from './BlockPicker';
import { PropertyPanel } from './PropertyPanel';
import { EmailHeader } from './EmailHeader';
import { SectionBlock } from './SectionBlock';
import { DragDropProvider, useDragDrop, DragItem, DropZone } from '../contexts/DragDropContext';
import { DragPreview } from './DragPreview';

const EmailEditorContent: React.FC = () => {
  // const { setDropHandler } = useDragDrop(); // Temporarily disabled
  const { pendingDocument, clearPendingDocument } = useDeepLink();
  const [currentDocument, setCurrentDocument] = useState<EmailDocument | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (selectedBlockId) {
      setShowProperties(true);
    } else {
      setShowProperties(false);
    }
  }, [selectedBlockId]);

  // Handle deep link document loading
  useEffect(() => {
    if (pendingDocument) {
      loadDocument(pendingDocument);
      clearPendingDocument();
    }
  }, [pendingDocument, clearPendingDocument]);

  const handleSelectDocument = (document: EmailDocument) => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: "Don't Save", onPress: () => loadDocument(document) },
          { text: 'Save', onPress: () => saveAndLoadDocument(document) },
        ]
      );
    } else {
      loadDocument(document);
    }
  };

  const loadDocument = (document: EmailDocument) => {
    // Migrate old documents to new format
    const migratedDoc = migrateDocument(document);
    setCurrentDocument(migratedDoc);
    setSelectedBlockId(null);
    setSelectedSectionId(null);
    setSelectedLayoutId(null);
    setEditingBlockId(null);
    setHasChanges(false);
  };

  const saveAndLoadDocument = async (newDocument: EmailDocument) => {
    if (currentDocument) {
      await handleSave();
    }
    loadDocument(newDocument);
  };

  const handleSave = async () => {
    if (!currentDocument) return;

    try {
      await documentStorage.saveDocument(currentDocument);
      setHasChanges(false);
      Alert.alert('Success', 'Document saved successfully');
    } catch (error) {
      console.error('Error saving document:', error);
      Alert.alert('Error', 'Failed to save document');
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: "Don't Save", onPress: () => setCurrentDocument(null) },
          { text: 'Save', onPress: async () => {
            await handleSave();
            setCurrentDocument(null);
          }},
        ]
      );
    } else {
      setCurrentDocument(null);
    }
  };

  const updateBlock = (blockId: string, updates: Partial<BlockNode>) => {
    if (!currentDocument) return;

    const updateBlockInSections = (sections: Section[]): Section[] => {
      return sections.map(section => ({
        ...section,
        layouts: section.layouts.map(layout => ({
          ...layout,
          columns: layout.columns.map(column => ({
            ...column,
            blocks: column.blocks.map(block => {
              if (block.id === blockId) {
                return { ...block, ...updates };
              }
              if (block.children) {
                return {
                  ...block,
                  children: updateBlockRecursive(block.children),
                };
              }
              return block;
            }),
          })),
        })),
      }));
    };

    const updateBlockRecursive = (blocks: BlockNode[]): BlockNode[] => {
      return blocks.map(block => {
        if (block.id === blockId) {
          return { ...block, ...updates };
        }
        if (block.children) {
          return {
            ...block,
            children: updateBlockRecursive(block.children),
          };
        }
        return block;
      });
    };

    setCurrentDocument({
      ...currentDocument,
      sections: updateBlockInSections(currentDocument.sections),
      lastModified: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const addBlock = (type: BlockType, columnId?: string) => {
    if (!currentDocument) return;

    const newBlock: BlockNode = {
      id: `block-${Date.now()}`,
      type,
      props: getDefaultProps(type),
      children: type === 'container' ? [] : undefined,
    };

    // If columnId is provided, add to specific column
    if (columnId) {
      const updatedSections = currentDocument.sections.map(section => ({
        ...section,
        layouts: section.layouts.map(layout => ({
          ...layout,
          columns: layout.columns.map(column => 
            column.id === columnId 
              ? { ...column, blocks: [...column.blocks, newBlock] }
              : column
          ),
        })),
      }));

      setCurrentDocument({
        ...currentDocument,
        sections: updatedSections,
        lastModified: new Date().toISOString(),
      });
    } else {
      // Default behavior: add to first available column or create new section
      let updatedSections = [...currentDocument.sections];
      
      if (updatedSections.length === 0) {
        // Create first section
        updatedSections.push({
          id: `section-${Date.now()}`,
          name: 'Main Content',
          layouts: [{
            id: `layout-${Date.now()}`,
            columns: [{
              id: `column-${Date.now()}`,
              width: 100,
              blocks: [newBlock],
            }],
            backgroundColor: '#ffffff',
            isDynamic: false,
          }],
        });
      } else {
        const lastSection = updatedSections[updatedSections.length - 1];
        if (lastSection.layouts.length === 0) {
          lastSection.layouts.push({
            id: `layout-${Date.now()}`,
            columns: [{
              id: `column-${Date.now()}`,
              width: 100,
              blocks: [newBlock],
            }],
            backgroundColor: '#ffffff',
            isDynamic: false,
          });
        } else {
          const lastLayout = lastSection.layouts[lastSection.layouts.length - 1];
          const lastColumn = lastLayout.columns[lastLayout.columns.length - 1];
          lastColumn.blocks.push(newBlock);
        }
      }

      setCurrentDocument({
        ...currentDocument,
        sections: updatedSections,
        lastModified: new Date().toISOString(),
      });
    }
    
    setHasChanges(true);
    setSelectedBlockId(newBlock.id);
  };

  const getDefaultProps = (type: BlockType) => {
    switch (type) {
      case 'container':
        return { padding: 20, backgroundColor: '#ffffff', width: '100%' };
      case 'text':
        return {
          content: 'New text block',
          fontSize: 16,
          color: '#333333',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'left',
        };
      case 'image':
        return {
          src: 'https://via.placeholder.com/300x200',
          alt: 'Image',
          width: '100%',
          height: 'auto',
        };
      case 'button':
        return {
          text: 'Click Me',
          backgroundColor: '#1976d2',
          textColor: '#ffffff',
          borderRadius: 8,
          padding: '15px',
          url: '#',
          width: 'auto',
        };
      case 'divider':
        return {
          color: '#e0e0e0',
          thickness: 1,
          style: 'solid',
          margin: '10px 0',
        };
      case 'spacer':
        return { height: 20 };
      case 'video':
        return {
          src: 'https://example.com/video.mp4',
          thumbnail: 'https://via.placeholder.com/600x338',
          title: 'Video Title',
          autoplay: false,
          controls: true,
          width: '100%',
          height: 'auto',
        };
      case 'social-share':
        return {
          platforms: ['facebook', 'twitter', 'linkedin'],
          url: 'https://example.com',
          title: 'Check this out!',
          layout: 'horizontal',
        };
      case 'social-follow':
        return {
          accounts: [
            { platform: 'twitter', url: 'https://twitter.com/example', handle: '@example' },
            { platform: 'facebook', url: 'https://facebook.com/example', handle: 'Example' },
          ],
          style: 'buttons',
        };
      case 'read-more':
        return {
          shortText: 'This is a preview of the content...',
          fullText: 'This is a preview of the content that expands when the user clicks read more. You can add much longer text here that will be hidden initially.',
          buttonText: 'Read More',
          expanded: false,
        };
      case 'data-table':
        return {
          headers: ['Column 1', 'Column 2', 'Column 3'],
          rows: [
            ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
            ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
          ],
          striped: true,
          bordered: true,
        };
      case 'event':
        return {
          title: 'Event Title',
          date: '2024-12-01',
          time: '7:00 PM',
          location: 'Event Location',
          description: 'Event description goes here...',
          rsvpUrl: 'https://example.com/rsvp',
        };
      case 'feedback':
        return {
          question: 'How was your experience?',
          type: 'rating',
          placeholder: 'Your feedback...',
          submitUrl: 'https://example.com/feedback',
        };
      case 'rsvp':
        return {
          event: 'Event Name',
          date: '2024-12-01',
          options: ['Yes, I will attend', 'No, I cannot attend', 'Maybe'],
          submitUrl: 'https://example.com/rsvp',
        };
      case 'product':
        return {
          name: 'Product Name',
          image: 'https://via.placeholder.com/300x300',
          price: '$99.99',
          description: 'Product description goes here...',
          buyUrl: 'https://example.com/buy',
          layout: 'vertical',
        };
      default:
        return {};
    }
  };

  const renderBlock = (node: BlockNode): React.ReactNode => {
    const isSelected = node.id === selectedBlockId;
    const isEditing = node.id === editingBlockId;

    switch (node.type) {
      case 'container':
        return (
          <ContainerBlock
            key={node.id}
            node={node}
            isSelected={isSelected}
            onSelect={() => setSelectedBlockId(node.id)}
            renderBlock={renderBlock}
          />
        );
      case 'text':
        return (
          <TextBlock
            key={node.id}
            node={node as unknown as { id: string; props: import('../types').TextProps }}
            isSelected={isSelected}
            isEditing={isEditing}
            onSelect={() => setSelectedBlockId(node.id)}
            onUpdate={(props) => updateBlock(node.id, { props: { ...node.props, ...props } })}
            onStartEdit={() => setEditingBlockId(node.id)}
            onEndEdit={() => setEditingBlockId(null)}
          />
        );
      case 'image':
        return (
          <ImageBlock
            key={node.id}
            node={node as unknown as { id: string; props: import('../types').ImageProps }}
            isSelected={isSelected}
            onSelect={() => setSelectedBlockId(node.id)}
          />
        );
      case 'button':
        return (
          <ButtonBlock
            key={node.id}
            node={node as unknown as { id: string; props: import('../types').ButtonProps }}
            isSelected={isSelected}
            onSelect={() => setSelectedBlockId(node.id)}
          />
        );
      case 'divider':
        return (
          <DividerBlock
            key={node.id}
            node={node as unknown as { id: string; props: import('../types').DividerProps }}
            isSelected={isSelected}
            onSelect={() => setSelectedBlockId(node.id)}
          />
        );
      case 'spacer':
        return (
          <SpacerBlock
            key={node.id}
            node={node as unknown as { id: string; props: import('../types').SpacerProps }}
            isSelected={isSelected}
            onSelect={() => setSelectedBlockId(node.id)}
          />
        );
      case 'video':
        return (
          <VideoBlock
            key={node.id}
            node={node as unknown as { id: string; props: import('../types').VideoProps }}
            isSelected={isSelected}
            onSelect={() => setSelectedBlockId(node.id)}
          />
        );
      case 'product':
        return (
          <ProductBlock
            key={node.id}
            node={node as unknown as { id: string; props: import('../types').ProductProps }}
            isSelected={isSelected}
            onSelect={() => setSelectedBlockId(node.id)}
          />
        );
      // Placeholder blocks for remaining types
      case 'social-share':
      case 'social-follow':
      case 'read-more':
      case 'data-table':
      case 'event':
      case 'feedback':
      case 'rsvp':
        return (
          <TouchableOpacity
            key={node.id}
            style={{
              padding: 20,
              backgroundColor: '#f8f9fa',
              borderRadius: 8,
              borderWidth: isSelected ? 2 : 1,
              borderColor: isSelected ? '#ff9800' : '#e0e0e0',
              borderStyle: isSelected ? 'dashed' : 'solid',
            }}
            onPress={(event) => {
              event.stopPropagation();
              setSelectedBlockId(node.id);
            }}
          >
            <Text style={{ textAlign: 'center', color: '#666', fontSize: 16 }}>
              {node.type.charAt(0).toUpperCase() + node.type.slice(1).replace('-', ' ')} Block
            </Text>
            <Text style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 4 }}>
              Coming soon!
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  if (!currentDocument) {
    return <DocumentList onSelectDocument={handleSelectDocument} />;
  }

  // Find selected block in the new structure
  let selectedBlock: BlockNode | undefined;
  for (const section of currentDocument.sections) {
    for (const layout of section.layouts) {
      for (const column of layout.columns) {
        const found = column.blocks.find(b => b.id === selectedBlockId);
        if (found) {
          selectedBlock = found;
          break;
        }
      }
    }
  }

  const updateDocumentMetadata = (updates: Partial<EmailDocument>) => {
    setCurrentDocument({
      ...currentDocument,
      ...updates,
      lastModified: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const handleSectionUpdate = (sectionId: string, updates: Partial<Section>) => {
    if (!currentDocument) return;

    const updatedSections = currentDocument.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );

    setCurrentDocument({
      ...currentDocument,
      sections: updatedSections,
      lastModified: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const handleSectionDelete = (sectionId: string) => {
    if (!currentDocument || currentDocument.sections.length <= 1) {
      Alert.alert('Cannot Delete', 'Document must have at least one section.');
      return;
    }

    Alert.alert(
      'Delete Section',
      'Are you sure you want to delete this section? All content will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedSections = currentDocument.sections.filter(s => s.id !== sectionId);
            setCurrentDocument({
              ...currentDocument,
              sections: updatedSections,
              lastModified: new Date().toISOString(),
            });
            setHasChanges(true);
            setSelectedSectionId(null);
          },
        },
      ]
    );
  };

  const handleSectionDuplicate = (sectionId: string) => {
    if (!currentDocument) return;

    const sectionToDuplicate = currentDocument.sections.find(s => s.id === sectionId);
    if (!sectionToDuplicate) return;

    const duplicatedSection: Section = {
      ...sectionToDuplicate,
      id: `section-${Date.now()}`,
      name: `${sectionToDuplicate.name || 'Section'} Copy`,
      layouts: sectionToDuplicate.layouts.map(layout => ({
        ...layout,
        id: `layout-${Date.now()}-${Math.random()}`,
        columns: layout.columns.map(column => ({
          ...column,
          id: `column-${Date.now()}-${Math.random()}`,
          blocks: column.blocks.map(block => ({
            ...block,
            id: `block-${Date.now()}-${Math.random()}`,
          })),
        })),
      })),
    };

    const sectionIndex = currentDocument.sections.findIndex(s => s.id === sectionId);
    const updatedSections = [...currentDocument.sections];
    updatedSections.splice(sectionIndex + 1, 0, duplicatedSection);

    setCurrentDocument({
      ...currentDocument,
      sections: updatedSections,
      lastModified: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const handleSectionMove = (fromIndex: number, toIndex: number) => {
    if (!currentDocument || toIndex < 0 || toIndex >= currentDocument.sections.length) return;

    const updatedSections = [...currentDocument.sections];
    const [movedSection] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedSection);

    setCurrentDocument({
      ...currentDocument,
      sections: updatedSections,
      lastModified: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const addSection = () => {
    if (!currentDocument) return;

    const newSection: Section = {
      id: `section-${Date.now()}`,
      name: 'New Section',
      layouts: [{
        id: `layout-${Date.now()}`,
        columns: [{
          id: `column-${Date.now()}`,
          width: 100,
          blocks: [],
        }],
        backgroundColor: '#ffffff',
        isDynamic: false,
      }],
    };

    setCurrentDocument({
      ...currentDocument,
      sections: [...currentDocument.sections, newSection],
      lastModified: new Date().toISOString(),
    });
    setHasChanges(true);
    setSelectedSectionId(newSection.id);
  };

  // Handle drag and drop operations
  const handleDrop = (dragItem: DragItem, dropZone: DropZone) => {
    if (!currentDocument) return;

    console.log('Drop:', dragItem.type, 'into', dropZone.type, dropZone.id);

    if (dragItem.type === 'block' && dropZone.type === 'column') {
      // Move block to different column
      const block = dragItem.item as BlockNode;
      const targetColumnId = dropZone.id;
      
      // Remove block from source location
      let updatedSections = [...currentDocument.sections];
      
      // Find and remove the block from its current location
      for (const section of updatedSections) {
        for (const layout of section.layouts) {
          for (const column of layout.columns) {
            const blockIndex = column.blocks.findIndex(b => b.id === block.id);
            if (blockIndex !== -1) {
              column.blocks.splice(blockIndex, 1);
              break;
            }
          }
        }
      }
      
      // Add block to target column
      for (const section of updatedSections) {
        for (const layout of section.layouts) {
          for (const column of layout.columns) {
            if (column.id === targetColumnId) {
              column.blocks.push(block);
              break;
            }
          }
        }
      }
      
      setCurrentDocument({
        ...currentDocument,
        sections: updatedSections,
        lastModified: new Date().toISOString(),
      });
      setHasChanges(true);
    }
  };

  // Set up drop handler
  // useEffect(() => {
  //   setDropHandler(handleDrop);
  // }, [currentDocument, setDropHandler]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <View>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>
              {currentDocument.name}
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveButton, hasChanges && styles.saveButtonActive]}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <EmailHeader
            document={currentDocument}
            onUpdate={updateDocumentMetadata}
          />
        </View>

        <ScrollView
          style={styles.canvas}
          contentContainerStyle={styles.canvasContent}
          onTouchStart={() => {
            setSelectedBlockId(null);
            setSelectedSectionId(null);
            setSelectedLayoutId(null);
          }}
        >
          {currentDocument.sections.map((section, sectionIndex) => (
            <SectionBlock
              key={section.id}
              section={section}
              isSelected={selectedSectionId === section.id}
              onSelect={() => setSelectedSectionId(section.id)}
              onUpdate={(updates) => handleSectionUpdate(section.id, updates)}
              onDelete={() => handleSectionDelete(section.id)}
              onDuplicate={() => handleSectionDuplicate(section.id)}
              onMoveUp={() => handleSectionMove(sectionIndex, sectionIndex - 1)}
              onMoveDown={() => handleSectionMove(sectionIndex, sectionIndex + 1)}
              renderBlock={renderBlock}
              onAddBlock={(columnId, type) => addBlock(type, columnId)}
              selectedLayoutId={selectedLayoutId}
              onSelectLayout={setSelectedLayoutId}
            />
          ))}
          
          {currentDocument.sections.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No sections yet</Text>
              <TouchableOpacity
                style={styles.addSectionButton}
                onPress={addSection}
              >
                <Text style={styles.addSectionText}>+ Add First Section</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Add Section Button */}
          {currentDocument.sections.length > 0 && (
            <TouchableOpacity
              style={styles.addSectionButton}
              onPress={addSection}
            >
              <Text style={styles.addSectionText}>+ Add Section</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* FAB Block Picker */}
        <BlockPicker onSelectType={(type) => addBlock(type)} />

        {showProperties && selectedBlock && (
          <PropertyPanel
            block={selectedBlock}
            onUpdate={(props) => updateBlock(selectedBlock.id, { props: { ...selectedBlock.props, ...props } })}
            onClose={() => setSelectedBlockId(null)}
          />
        )}

        {/* Drag Preview */}
        {/* <DragPreview /> */}
    </KeyboardAvoidingView>
  );
};

export const MobileEmailEditor: React.FC = () => {
  return <EmailEditorContent />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1976d2',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  saveButton: {
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
  },
  saveButtonActive: {
    backgroundColor: '#1976d2',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  canvas: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  canvasContent: {
    padding: 20,
    paddingBottom: 20,
  },
  blockWrapper: {
    marginBottom: 15,
  },
  emptyState: {
    paddingVertical: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
  },
  addSectionButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#1976d2',
    borderRadius: 8,
    alignItems: 'center',
  },
  addSectionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});