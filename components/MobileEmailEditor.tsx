import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { EmailDocument, BlockNode, BlockType, Section, Layout, Column } from '../types';
import { OnboardingData } from './ai/AIOnboardingAssistant';
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
import { BlockActions } from './BlockActions';
import { GlobalStylesEditor } from './GlobalStylesEditor';
import { ViewModeToggle, ViewMode } from './ViewModeToggle';
import { ResponsiveView } from './ResponsiveView';
import { SwipeableEditor } from './SwipeableEditor';
import { MobileAppFAB } from './MobileAppFAB';
import { TextVersionView } from './TextVersionView';

interface EmailEditorContentProps {
  onboardingData?: OnboardingData | null;
}

const EmailEditorContent: React.FC<EmailEditorContentProps> = ({ onboardingData }) => {
  // const { setDropHandler } = useDragDrop(); // Temporarily disabled
  const { pendingDocument, clearPendingDocument } = useDeepLink();
  const [currentDocument, setCurrentDocument] = useState<EmailDocument | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showBlockActions, setShowBlockActions] = useState(false);
  const [actionBlockId, setActionBlockId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  const [swipePage, setSwipePage] = useState(1); // Start on Edit page
  
  // Undo/Redo state
  const [history, setHistory] = useState<EmailDocument[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState('');

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
    // Initialize history with the loaded document
    setHistory([JSON.parse(JSON.stringify(migratedDoc))]);
    setHistoryIndex(0);
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

    const newDoc = {
      ...currentDocument,
      sections: updateBlockInSections(currentDocument.sections),
      lastModified: new Date().toISOString(),
    };
    setCurrentDocument(newDoc);
    setHasChanges(true);
    addToHistory(newDoc);
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

      const newDoc = {
        ...currentDocument,
        sections: updatedSections,
        lastModified: new Date().toISOString(),
      };
      setCurrentDocument(newDoc);
      addToHistory(newDoc);
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

      const newDoc = {
        ...currentDocument,
        sections: updatedSections,
        lastModified: new Date().toISOString(),
      };
      setCurrentDocument(newDoc);
      addToHistory(newDoc);
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
          src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop',
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
          thumbnail: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=338&fit=crop',
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
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
          price: '$99.99',
          description: 'Product description goes here...',
          buyUrl: 'https://example.com/buy',
          layout: 'vertical',
        };
      default:
        return {};
    }
  };

  const renderBlock = (node: BlockNode, isPreview = false): React.ReactNode => {
    const isSelected = !isPreview && node.id === selectedBlockId;
    const isEditing = !isPreview && node.id === editingBlockId;

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
            onShowActions={() => handleShowBlockActions(node.id)}
            isPreview={isPreview}
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
    return <DocumentList onSelectDocument={handleSelectDocument} onboardingData={onboardingData} />;
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

  // Add to history whenever document changes
  const addToHistory = (doc: EmailDocument) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(doc))); // Deep clone
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentDocument(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentDocument(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleTest = () => {
    Alert.alert(
      '🔍 Email Test',
      'This would check for common issues like:\n\n• Placeholder text still present\n• Missing alt text on images\n• Broken links\n• Poor subject line length\n• Missing preheader text\n\nThis feature is coming soon!',
      [{ text: 'Got it', style: 'default' }]
    );
  };

  const handleLivePreview = () => {
    Alert.alert(
      '📧 Live Preview',
      'This premium feature would show how your email looks in popular email clients like:\n\n• Gmail (Desktop & Mobile)\n• Outlook (Desktop & Mobile)\n• Apple Mail\n• Yahoo Mail\n\nPowered by Litmus integration.\n\nUpgrade to Pro to unlock this feature!',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Learn More', style: 'default' }
      ]
    );
  };

  const handleStartNameEdit = () => {
    if (!currentDocument) return;
    setEditingName(currentDocument.name);
    setIsEditingName(true);
  };

  const handleFinishNameEdit = async () => {
    if (!currentDocument || !editingName.trim()) {
      setIsEditingName(false);
      return;
    }

    const updatedDoc = {
      ...currentDocument,
      name: editingName.trim(),
      lastModified: new Date().toISOString(),
    };
    
    setCurrentDocument(updatedDoc);
    addToHistory(updatedDoc);
    setIsEditingName(false);
    setHasChanges(true);

    // Save to storage immediately
    try {
      await documentStorage.saveDocument(updatedDoc);
    } catch (error) {
      console.error('Error saving document name:', error);
      // Don't show error to user for name changes, it will be saved later
    }
  };

  const handleCancelNameEdit = () => {
    setIsEditingName(false);
    setEditingName('');
  };

  const updateDocumentMetadata = (updates: Partial<EmailDocument>) => {
    const newDoc = {
      ...currentDocument,
      ...updates,
      lastModified: new Date().toISOString(),
    };
    setCurrentDocument(newDoc);
    setHasChanges(true);
    addToHistory(newDoc);
  };

  const updateGlobalStyles = (globalStyles: import('../types').GlobalStyles) => {
    const newDoc = {
      ...currentDocument,
      globalStyles,
      lastModified: new Date().toISOString(),
    };
    setCurrentDocument(newDoc);
    setHasChanges(true);
    addToHistory(newDoc);
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

    const newDoc = {
      ...currentDocument,
      sections: updatedSections,
      lastModified: new Date().toISOString(),
    };
    setCurrentDocument(newDoc);
    setHasChanges(true);
    addToHistory(newDoc);
  };

  const handleSectionMove = (fromIndex: number, toIndex: number) => {
    if (!currentDocument || toIndex < 0 || toIndex >= currentDocument.sections.length) return;

    const updatedSections = [...currentDocument.sections];
    const [movedSection] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedSection);

    const newDoc = {
      ...currentDocument,
      sections: updatedSections,
      lastModified: new Date().toISOString(),
    };
    setCurrentDocument(newDoc);
    setHasChanges(true);
    addToHistory(newDoc);
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

    const newDoc = {
      ...currentDocument,
      sections: [...currentDocument.sections, newSection],
      lastModified: new Date().toISOString(),
    };
    setCurrentDocument(newDoc);
    setHasChanges(true);
    addToHistory(newDoc);
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
      
      const newDoc = {
        ...currentDocument,
        sections: updatedSections,
        lastModified: new Date().toISOString(),
      };
      setCurrentDocument(newDoc);
      setHasChanges(true);
      addToHistory(newDoc);
    }
  };

  // Set up drop handler
  // useEffect(() => {
  //   setDropHandler(handleDrop);
  // }, [currentDocument, setDropHandler]);

  const handleShowBlockActions = (blockId: string) => {
    setActionBlockId(blockId);
    setShowBlockActions(true);
  };

  const handleCopyBlock = (block: BlockNode) => {
    if (!currentDocument) return;

    // Create a copy with new ID
    const copiedBlock: BlockNode = {
      ...block,
      id: `block-${Date.now()}`,
      // Deep copy props to avoid reference issues
      props: JSON.parse(JSON.stringify(block.props)),
    };

    // Find the column containing the original block and add the copy after it
    const updatedSections = currentDocument.sections.map(section => ({
      ...section,
      layouts: section.layouts.map(layout => ({
        ...layout,
        columns: layout.columns.map(column => {
          const blockIndex = column.blocks.findIndex(b => b.id === block.id);
          if (blockIndex !== -1) {
            // Insert the copied block right after the original
            const newBlocks = [...column.blocks];
            newBlocks.splice(blockIndex + 1, 0, copiedBlock);
            return { ...column, blocks: newBlocks };
          }
          return column;
        }),
      })),
    }));

    const newDoc = {
      ...currentDocument,
      sections: updatedSections,
      lastModified: new Date().toISOString(),
    };
    setCurrentDocument(newDoc);
    setHasChanges(true);
    addToHistory(newDoc);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!currentDocument) return;

    const updatedSections = currentDocument.sections.map(section => ({
      ...section,
      layouts: section.layouts.map(layout => ({
        ...layout,
        columns: layout.columns.map(column => ({
          ...column,
          blocks: column.blocks.filter(b => b.id !== blockId),
        })),
      })),
    }));

    const newDoc = {
      ...currentDocument,
      sections: updatedSections,
      lastModified: new Date().toISOString(),
    };
    setCurrentDocument(newDoc);
    setHasChanges(true);
    addToHistory(newDoc);

    // Clear selection if deleted block was selected
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    if (actionBlockId === blockId) {
      setActionBlockId(null);
    }
  };

  const handleMoveBlock = (blockId: string, targetColumnId: string) => {
    if (!currentDocument) return;

    let blockToMove: BlockNode | null = null;
    
    // Find and remove the block from its current location
    const updatedSections = currentDocument.sections.map(section => ({
      ...section,
      layouts: section.layouts.map(layout => ({
        ...layout,
        columns: layout.columns.map(column => {
          const blockIndex = column.blocks.findIndex(b => b.id === blockId);
          if (blockIndex !== -1) {
            blockToMove = column.blocks[blockIndex];
            return {
              ...column,
              blocks: column.blocks.filter(b => b.id !== blockId),
            };
          }
          return column;
        }),
      })),
    }));

    if (!blockToMove) return;

    // Add the block to the target column
    const finalSections = updatedSections.map(section => ({
      ...section,
      layouts: section.layouts.map(layout => ({
        ...layout,
        columns: layout.columns.map(column => {
          if (column.id === targetColumnId) {
            return {
              ...column,
              blocks: [...column.blocks, blockToMove!],
            };
          }
          return column;
        }),
      })),
    }));

    const newDoc = {
      ...currentDocument,
      sections: finalSections,
      lastModified: new Date().toISOString(),
    };
    setCurrentDocument(newDoc);
    setHasChanges(true);
    addToHistory(newDoc);
  };

  // Get available columns for block movement
  const getAvailableColumns = () => {
    if (!currentDocument) return [];

    const columns: Array<{
      id: string;
      label: string;
      sectionName: string;
      layoutIndex: number;
      columnIndex: number;
    }> = [];

    currentDocument.sections.forEach((section, sectionIndex) => {
      section.layouts.forEach((layout, layoutIndex) => {
        layout.columns.forEach((column, columnIndex) => {
          columns.push({
            id: column.id,
            label: `Column ${columnIndex + 1}`,
            sectionName: section.name || `Section ${sectionIndex + 1}`,
            layoutIndex,
            columnIndex,
          });
        });
      });
    });

    return columns;
  };

  // Get current column ID for a block
  const getCurrentColumnId = (blockId: string): string => {
    if (!currentDocument) return '';

    for (const section of currentDocument.sections) {
      for (const layout of section.layouts) {
        for (const column of layout.columns) {
          if (column.blocks.some(b => b.id === blockId)) {
            return column.id;
          }
        }
      }
    }
    return '';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Persistent Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        {isEditingName ? (
          <TextInput
            style={styles.titleInput}
            value={editingName}
            onChangeText={setEditingName}
            onBlur={handleFinishNameEdit}
            onSubmitEditing={handleFinishNameEdit}
            autoFocus
            selectTextOnFocus
            returnKeyType="done"
            blurOnSubmit
          />
        ) : (
          <TouchableOpacity onPress={handleStartNameEdit} style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {currentDocument.name}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Persistent Toolbar - Two Rows */}
      <View style={styles.toolbarContainer}>
        {/* First Row: Design/Edit/Preview Toggle */}
        <View style={styles.primaryToolbar}>
          <View style={styles.pageToggle}>
            <TouchableOpacity 
              style={[
                styles.pageToggleButton,
                swipePage === 0 && styles.pageToggleButtonActive
              ]}
              onPress={() => setSwipePage(0)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.pageToggleText,
                swipePage === 0 && styles.pageToggleTextActive
              ]}>
                🎨 Design
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.pageToggleButton,
                swipePage === 1 && styles.pageToggleButtonActive
              ]}
              onPress={() => setSwipePage(1)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.pageToggleText,
                swipePage === 1 && styles.pageToggleTextActive
              ]}>
                ✏️ Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.pageToggleButton,
                swipePage === 2 && styles.pageToggleButtonActive
              ]}
              onPress={() => setSwipePage(2)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.pageToggleText,
                swipePage === 2 && styles.pageToggleTextActive
              ]}>
                👁️ Preview
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Second Row: Action Buttons */}
        <View style={styles.secondaryToolbar}>
          {/* Left Spacer */}
          <View style={styles.toolbarSpacer}>
            {/* Empty space for centering */}
          </View>
          
          {/* Center: View Mode Toggle - always visible */}
          <View style={styles.viewModeToggle}>
            <TouchableOpacity 
              style={[
                styles.viewModeButton,
                viewMode === 'mobile' && styles.viewModeButtonActive
              ]}
              onPress={() => setViewMode('mobile')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewModeIcon}>📱</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.viewModeButton,
                viewMode === 'desktop' && styles.viewModeButtonActive
              ]}
              onPress={() => setViewMode('desktop')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewModeIcon}>💻</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.viewModeButton,
                viewMode === 'text' && styles.viewModeButtonActive,
                swipePage === 0 && styles.disabledViewModeButton
              ]}
              onPress={() => swipePage !== 0 && setViewMode('text')}
              activeOpacity={swipePage === 0 ? 1 : 0.7}
              disabled={swipePage === 0}
            >
              <Text style={[
                styles.viewModeIcon, 
                { fontFamily: 'Times New Roman', fontWeight: 'bold' },
                swipePage === 0 && styles.disabledViewModeIcon
              ]}>T</Text>
            </TouchableOpacity>
          </View>
          
          {/* Right: Undo/Redo on Edit page, Test/Live Preview on Preview page */}
          <View style={styles.toolbarSpacer}>
            {swipePage === 1 && (
              <View style={styles.undoRedoGroup}>
                <TouchableOpacity 
                  style={[styles.toolbarButton, !canUndo && styles.disabledButton]} 
                  disabled={!canUndo}
                  onPress={handleUndo}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toolbarButtonText, !canUndo && styles.disabledButtonText]}>↶</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toolbarButton, !canRedo && styles.disabledButton]} 
                  disabled={!canRedo}
                  onPress={handleRedo}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toolbarButtonText, !canRedo && styles.disabledButtonText]}>↷</Text>
                </TouchableOpacity>
              </View>
            )}
            {swipePage === 2 && (
              <View style={styles.previewToolsGroup}>
                <TouchableOpacity 
                  style={styles.toolbarButton}
                  onPress={handleTest}
                  activeOpacity={0.7}
                >
                  <Text style={styles.toolbarButtonText}>🔬</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.previewToolButtonPremium}
                  onPress={handleLivePreview}
                  activeOpacity={0.7}
                >
                  <Text style={styles.previewToolButtonPremiumText}>🧪</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <SwipeableEditor 
        document={currentDocument}
        currentPage={swipePage}
        onPageChange={setSwipePage}
        viewMode={viewMode}
        onUpdateGlobalStyles={updateGlobalStyles}
        mobileDesignMode={swipePage === 0 && viewMode === 'mobile'}
      >
        <View style={styles.editorContainer}>
          <EmailHeader
            document={currentDocument}
            onUpdate={updateDocumentMetadata}
          />
          
          {viewMode === 'text' ? (
            <TextVersionView document={currentDocument} />
          ) : (
            <ResponsiveView viewMode={viewMode} style={styles.canvas}>
              <ScrollView
                style={styles.scrollView}
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
                    viewMode={viewMode}
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
            </ResponsiveView>
          )}
        </View>
      </SwipeableEditor>

      {/* FABs and Modals - outside SwipeableEditor */}
      
      {/* Block Picker FAB - Only show in Edit mode */}
      {swipePage === 1 && (
        <BlockPicker onSelectType={(type) => addBlock(type)} />
      )}

      {showProperties && selectedBlock && (
        <PropertyPanel
          block={selectedBlock}
          onUpdate={(props) => updateBlock(selectedBlock.id, { props: { ...selectedBlock.props, ...props } })}
          onClose={() => setSelectedBlockId(null)}
        />
      )}

      {/* Block Actions Modal */}
      {showBlockActions && actionBlockId && (() => {
        // Find the block for actions
        let actionBlock: BlockNode | null = null;
        for (const section of currentDocument?.sections || []) {
          for (const layout of section.layouts) {
            for (const column of layout.columns) {
              const found = column.blocks.find(b => b.id === actionBlockId);
              if (found) {
                actionBlock = found;
                break;
              }
            }
          }
        }

        return actionBlock ? (
          <BlockActions
            block={actionBlock}
            visible={showBlockActions}
            onClose={() => setShowBlockActions(false)}
            onCopy={handleCopyBlock}
            onDelete={handleDeleteBlock}
            onMove={handleMoveBlock}
            availableColumns={getAvailableColumns()}
            currentColumnId={getCurrentColumnId(actionBlockId)}
          />
        ) : null;
      })()}

      {/* Mobile App FAB - Only show in edit mode and web context */}
      {swipePage === 1 && Platform.OS === 'web' && (
        <MobileAppFAB currentDocument={currentDocument} />
      )}

      {/* Drag Preview */}
      {/* <DragPreview /> */}
    </KeyboardAvoidingView>
  );
};

interface MobileEmailEditorProps {
  onboardingData?: OnboardingData | null;
}

export const MobileEmailEditor: React.FC<MobileEmailEditorProps> = ({ onboardingData }) => {
  return <EmailEditorContent onboardingData={onboardingData} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  editorContainer: {
    flex: 1,
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
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333333',
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 10,
    color: '#333333',
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#1976d2',
  },
  saveButton: {
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#1976d2',
  },
  saveButtonActive: {
    backgroundColor: '#1976d2',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  
  // Toolbar styles
  toolbarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  primaryToolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 6,
  },
  secondaryToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 2,
    paddingBottom: 8,
    minHeight: 44,
  },
  toolbarSpacer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  pageToggle: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    height: 36,
    padding: 2,
  },
  pageToggleButton: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  pageToggleButtonActive: {
    backgroundColor: '#1976d2',
  },
  pageToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  pageToggleTextActive: {
    color: '#ffffff',
  },
  undoRedoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolbarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarButtonText: {
    fontSize: 18,
    color: '#666666',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e9ecef',
  },
  disabledButtonText: {
    color: '#bbb',
  },
  previewToolsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewToolButtonPremium: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewToolButtonPremiumText: {
    fontSize: 18,
    color: '#1976d2',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 18,
    height: 36,
    padding: 2,
  },
  viewModeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: '#ffffff',
  },
  viewModeIcon: {
    fontSize: 16,
  },
  disabledViewModeButton: {
    opacity: 0.4,
  },
  disabledViewModeIcon: {
    color: '#bbb',
  },
  canvas: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  toolsHeader: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  toolButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  toolButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
});