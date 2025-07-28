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
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmailDocument, BlockNode } from '@/types';
import { documentStorage } from '@/utils/documentStorage';
import { useDeepLink } from '@/contexts/DeepLinkContext';
import { DocumentList } from './DocumentList';
import { ContainerBlock } from './blocks/ContainerBlock';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { BlockToolbox } from './BlockToolbox';
import { PropertyPanel } from './PropertyPanel';

export const MobileEmailEditor: React.FC = () => {
  const { pendingDocument, clearPendingDocument } = useDeepLink();
  const [currentDocument, setCurrentDocument] = useState<EmailDocument | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showToolbox, setShowToolbox] = useState(false);
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
    setCurrentDocument(document);
    setSelectedBlockId(null);
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
      content: updateBlockRecursive(currentDocument.content),
    });
    setHasChanges(true);
  };

  const addBlock = (type: 'container' | 'text' | 'image') => {
    if (!currentDocument) return;

    const newBlock: BlockNode = {
      id: `block-${Date.now()}`,
      type,
      props: getDefaultProps(type),
      children: type === 'container' ? [] : undefined,
    };

    setCurrentDocument({
      ...currentDocument,
      content: [...currentDocument.content, newBlock],
    });
    setHasChanges(true);
    setShowToolbox(false);
    setSelectedBlockId(newBlock.id);
  };

  const getDefaultProps = (type: string) => {
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
            node={node as unknown as { id: string; props: import('@/types').TextProps }}
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
            node={node as unknown as { id: string; props: import('@/types').ImageProps }}
            isSelected={isSelected}
            onSelect={() => setSelectedBlockId(node.id)}
          />
        );
      default:
        return null;
    }
  };

  if (!currentDocument) {
    return <DocumentList onSelectDocument={handleSelectDocument} />;
  }

  const selectedBlock = currentDocument.content.find(b => b.id === selectedBlockId);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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

        <ScrollView
          style={styles.canvas}
          contentContainerStyle={styles.canvasContent}
        >
          <TouchableOpacity 
            style={styles.canvasBackground}
            onPress={() => setSelectedBlockId(null)}
            activeOpacity={1}
          >
            {currentDocument.content.map((block) => (
              <View key={block.id} style={styles.blockWrapper}>
                {renderBlock(block)}
              </View>
            ))}
            
            {currentDocument.content.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Tap + to add your first block</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => setShowToolbox(true)}
          >
            <Text style={styles.toolbarButtonText}>+ Add Block</Text>
          </TouchableOpacity>
        </View>

        {showToolbox && (
          <BlockToolbox
            onSelectType={addBlock}
            onClose={() => setShowToolbox(false)}
          />
        )}

        {showProperties && selectedBlock && (
          <PropertyPanel
            block={selectedBlock}
            onUpdate={(props) => updateBlock(selectedBlock.id, { props: { ...selectedBlock.props, ...props } })}
            onClose={() => setSelectedBlockId(null)}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
    paddingBottom: 100,
  },
  canvasBackground: {
    flex: 1,
    minHeight: '100%',
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
  },
  toolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  toolbarButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  toolbarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});