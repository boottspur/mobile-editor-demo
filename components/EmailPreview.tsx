import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { EmailDocument, Section, Layout, Column, BlockNode } from '../types';
import { ContainerBlock } from './blocks/ContainerBlock';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { DividerBlock } from './blocks/DividerBlock';
import { SpacerBlock } from './blocks/SpacerBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { ProductBlock } from './blocks/ProductBlock';
import { ResponsiveView } from './ResponsiveView';

interface EmailPreviewProps {
  document: EmailDocument;
  onBack?: () => void;
  viewMode?: 'mobile' | 'desktop';
}

const { width: screenWidth } = Dimensions.get('window');

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  document,
  onBack,
  viewMode = 'mobile',
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleTestSend = async () => {
    setIsSending(true);
    
    // Mock sending delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    
    Alert.alert(
      '✅ Test Email Sent!',
      `Test email "${document.subject}" has been sent to ${document.fromEmail}\n\nThis is a demo - no actual email was sent.`,
      [{ text: 'Great!', style: 'default' }]
    );
  };

  const handleExportHTML = () => {
    Alert.alert(
      '📧 Export HTML',
      'HTML export functionality would generate clean email HTML code ready for any email service.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Copy HTML', onPress: () => {
          Alert.alert('📋 Copied!', 'HTML code copied to clipboard (demo)');
        }}
      ]
    );
  };

  const renderBlock = (block: BlockNode): React.ReactElement => {
    const commonProps = {
      node: block,
      isSelected: false,
      isEditing: false,
      onSelect: () => {},
      onUpdate: () => {},
      onStartEditing: () => {},
      onStopEditing: () => {},
      isPreview: true, // Add preview flag to blocks
    };

    switch (block.type) {
      case 'container':
        return <ContainerBlock key={block.id} {...commonProps} />;
      case 'text':
        return <TextBlock key={block.id} {...commonProps} />;
      case 'image':
        return <ImageBlock key={block.id} {...commonProps} />;
      case 'button':
        return <ButtonBlock key={block.id} {...commonProps} />;
      case 'divider':
        return <DividerBlock key={block.id} {...commonProps} />;
      case 'spacer':
        return <SpacerBlock key={block.id} {...commonProps} />;
      case 'video':
        return <VideoBlock key={block.id} {...commonProps} />;
      case 'product':
        return <ProductBlock key={block.id} {...commonProps} />;
      default:
        return <View key={block.id} />;
    }
  };

  const renderColumn = (column: Column) => (
    <View
      key={column.id}
      style={[
        styles.column,
        { width: `${column.width}%` }
      ]}
    >
      {column.blocks.map(renderBlock)}
    </View>
  );

  const renderLayout = (layout: Layout) => (
    <View
      key={layout.id}
      style={[
        styles.layout,
        layout.backgroundColor && { backgroundColor: layout.backgroundColor }
      ]}
    >
      <View style={styles.layoutColumns}>
        {layout.columns.map(renderColumn)}
      </View>
    </View>
  );

  const renderSection = (section: Section) => (
    <View key={section.id} style={styles.section}>
      {section.layouts.map(renderLayout)}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Email Header */}
      <View style={styles.emailHeader}>
        <View style={styles.headerTop}>
          <View style={styles.headerMeta}>
            <Text style={styles.fromText}>From: {document.fromName}</Text>
            <Text style={styles.emailText}>&lt;{document.fromEmail}&gt;</Text>
          </View>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.subjectText}>{document.subject}</Text>
        {document.preheader && (
          <Text style={styles.preheaderText}>{document.preheader}</Text>
        )}
      </View>

      {/* Email Content */}
      <ResponsiveView viewMode={viewMode} style={styles.emailContent}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.emailContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.emailBody,
              document.globalStyles?.bodyBackgroundColor && {
                backgroundColor: document.globalStyles.bodyBackgroundColor
              }
            ]}
          >
            {document.sections.map(renderSection)}
          </View>
        </ScrollView>
      </ResponsiveView>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={handleExportHTML}
        >
          <Text style={styles.exportButtonText}>📄 Export HTML</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.sendButton,
            isSending && styles.sendButtonDisabled
          ]}
          onPress={handleTestSend}
          disabled={isSending}
        >
          <Text style={styles.sendButtonText}>
            {isSending ? '📤 Sending...' : '📧 Send Test'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Email Header
  emailHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerMeta: {
    flex: 1,
  },
  fromText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  emailText: {
    fontSize: 12,
    color: '#666666',
  },
  backButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  preheaderText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  
  // Email Content
  emailContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  emailContentContainer: {
    paddingVertical: 16,
  },
  emailBody: {
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Layout Components
  section: {
    // Section styling handled by individual layouts
  },
  layout: {
    // Layout background will be set dynamically
  },
  layoutColumns: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  column: {
    paddingHorizontal: 4,
  },
  
  // Action Bar
  actionBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  exportButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exportButtonText: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#1976d2',
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});