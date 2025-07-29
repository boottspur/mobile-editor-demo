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
import { TextVersionView } from './TextVersionView';

interface EmailPreviewProps {
  document: EmailDocument;
  onBack?: () => void;
  viewMode?: 'mobile' | 'desktop' | 'text';
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

  const handleSchedule = () => {
    Alert.alert(
      '📅 Schedule Email',
      'Schedule this email to be sent at a specific date and time.\n\nThis feature would progress the user to the existing scheduling feature in the flow.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Schedule', onPress: () => {
          Alert.alert('📅 Scheduled!', 'Email scheduled for delivery (demo)');
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
        viewMode === 'mobile' 
          ? { width: '100%' } // Stack columns on mobile
          : { width: `${column.width}%` } // Use column widths on desktop
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
      <View style={[
        styles.layoutColumns,
        viewMode === 'mobile' && styles.layoutColumnsMobile
      ]}>
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
        </View>
        
        <Text style={styles.subjectText}>{document.subject}</Text>
        {document.preheader && (
          <Text style={styles.preheaderText}>{document.preheader}</Text>
        )}
      </View>

      {/* Email Content */}
      {viewMode === 'text' ? (
        <View style={styles.emailContent}>
          <TextVersionView document={document} />
        </View>
      ) : (
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
      )}

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionButton, styles.sendTestButton]}
          onPress={handleTestSend}
          disabled={isSending}
        >
          <Text style={styles.sendTestButtonText}>
            {isSending ? '📤 Sending...' : '📧 Send Test'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.scheduleButton]}
          onPress={handleSchedule}
        >
          <Text style={styles.scheduleButtonText}>📅 Schedule</Text>
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
  layoutColumnsMobile: {
    flexDirection: 'column',
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
  sendTestButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendTestButtonText: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleButton: {
    backgroundColor: '#1976d2',
  },
  scheduleButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});