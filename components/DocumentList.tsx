import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { EmailDocument } from '../types';
import { documentStorage } from '../utils/documentStorage';
import { AIOnboardingScreen } from './ai/AIOnboardingScreen';

interface DocumentListProps {
  onSelectDocument: (document: EmailDocument) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ onSelectDocument }) => {
  const [documents, setDocuments] = useState<EmailDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBrowseModal, setShowBrowseModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showAIOnboarding, setShowAIOnboarding] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      await documentStorage.initialize();
      const docs = await documentStorage.getAllDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      Alert.alert('Error', 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const newDoc = await documentStorage.createDocument('New Email');
      setDocuments([...documents, newDoc]);
      onSelectDocument(newDoc);
    } catch (error) {
      console.error('Error creating document:', error);
      Alert.alert('Error', 'Failed to create template');
    }
  };

  const handleAIComplete = async (aiDocument: any) => {
    try {
      // Create a new document from AI-generated content
      const newDoc = await documentStorage.createDocument(aiDocument.name);
      
      // Update the document with AI-generated data
      const updatedDoc = {
        ...newDoc,
        subject: aiDocument.subject,
        fromName: aiDocument.fromName,
        fromEmail: aiDocument.fromEmail,
        preheader: aiDocument.preheader,
        globalStyles: aiDocument.globalStyles,
        // Store AI content for potential future use
        aiGenerated: true,
        aiContent: aiDocument.aiContent,
        brandData: aiDocument.brandData,
      };

      await documentStorage.saveDocument(updatedDoc);
      setDocuments([...documents, updatedDoc]);
      setShowAIOnboarding(false);
      
      // Navigate to the new AI-generated document
      onSelectDocument(updatedDoc);
    } catch (error) {
      console.error('Error creating AI document:', error);
      Alert.alert('Error', 'Failed to create AI-generated email');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getThumbnailType = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('newsletter') || lowerName.includes('weekly')) return 'newsletter';
    if (lowerName.includes('welcome') || lowerName.includes('onboard')) return 'welcome';
    if (lowerName.includes('promo') || lowerName.includes('sale') || lowerName.includes('offer')) return 'promo';
    if (lowerName.includes('product') || lowerName.includes('launch')) return 'product';
    return 'generic';
  };

  const renderThumbnail = (type: string) => {
    switch (type) {
      case 'newsletter':
        return (
          <View style={styles.emailThumbnail}>
            {/* Header */}
            <View style={styles.emailHeader}>
              <View style={[styles.emailLogo, { backgroundColor: '#1976d2' }]} />
              <View style={styles.emailNav}>
                <View style={styles.navItem} />
                <View style={styles.navItem} />
                <View style={styles.navItem} />
              </View>
            </View>
            {/* Hero section */}
            <View style={styles.emailHero}>
              <View style={[styles.heroImage, { backgroundColor: '#e3f2fd' }]} />
              <View style={styles.heroText}>
                <View style={[styles.textLine, { width: '80%' }]} />
                <View style={[styles.textLine, { width: '60%' }]} />
              </View>
            </View>
            {/* Content blocks */}
            <View style={styles.emailContent}>
              <View style={styles.contentBlock}>
                <View style={[styles.textLine, { width: '100%' }]} />
                <View style={[styles.textLine, { width: '75%' }]} />
              </View>
            </View>
          </View>
        );
      
      case 'welcome':
        return (
          <View style={styles.emailThumbnail}>
            {/* Header */}
            <View style={styles.emailHeader}>
              <View style={[styles.emailLogo, { backgroundColor: '#4caf50' }]} />
            </View>
            {/* Welcome message */}
            <View style={styles.welcomeContent}>
              <View style={[styles.welcomeIcon, { backgroundColor: '#4caf50' }]} />
              <View style={[styles.textLine, { width: '70%', backgroundColor: '#333' }]} />
              <View style={[styles.textLine, { width: '90%' }]} />
              <View style={[styles.textLine, { width: '80%' }]} />
              <View style={[styles.ctaButton, { backgroundColor: '#4caf50' }]} />
            </View>
          </View>
        );
      
      case 'promo':
        return (
          <View style={styles.emailThumbnail}>
            {/* Header */}
            <View style={styles.emailHeader}>
              <View style={[styles.emailLogo, { backgroundColor: '#ff9800' }]} />
            </View>
            {/* Promo banner */}
            <View style={[styles.promoBanner, { backgroundColor: '#ff9800' }]}>
              <View style={[styles.promoText, { backgroundColor: '#fff' }]} />
            </View>
            {/* Product grid */}
            <View style={styles.productGrid}>
              <View style={[styles.productItem, { backgroundColor: '#f5f5f5' }]} />
              <View style={[styles.productItem, { backgroundColor: '#f5f5f5' }]} />
            </View>
            <View style={styles.productGrid}>
              <View style={[styles.productItem, { backgroundColor: '#f5f5f5' }]} />
              <View style={[styles.productItem, { backgroundColor: '#f5f5f5' }]} />
            </View>
          </View>
        );
      
      case 'product':
        return (
          <View style={styles.emailThumbnail}>
            {/* Header */}
            <View style={styles.emailHeader}>
              <View style={[styles.emailLogo, { backgroundColor: '#9c27b0' }]} />
            </View>
            {/* Product showcase */}
            <View style={styles.productShowcase}>
              <View style={[styles.productImage, { backgroundColor: '#e1bee7' }]} />
              <View style={styles.productInfo}>
                <View style={[styles.textLine, { width: '60%', backgroundColor: '#333' }]} />
                <View style={[styles.textLine, { width: '40%' }]} />
                <View style={[styles.textLine, { width: '80%' }]} />
                <View style={[styles.ctaButton, { backgroundColor: '#9c27b0' }]} />
              </View>
            </View>
          </View>
        );
      
      default: // generic
        return (
          <View style={styles.emailThumbnail}>
            {/* Header */}
            <View style={styles.emailHeader}>
              <View style={[styles.emailLogo, { backgroundColor: '#607d8b' }]} />
            </View>
            {/* Generic content */}
            <View style={styles.genericContent}>
              <View style={[styles.textLine, { width: '100%', backgroundColor: '#333' }]} />
              <View style={[styles.textLine, { width: '80%' }]} />
              <View style={[styles.textLine, { width: '90%' }]} />
              <View style={[styles.textLine, { width: '60%' }]} />
              <View style={styles.spacer} />
              <View style={[styles.textLine, { width: '85%' }]} />
              <View style={[styles.textLine, { width: '70%' }]} />
            </View>
          </View>
        );
    }
  };

  const renderDocument = ({ item }: { item: EmailDocument }) => {
    const thumbnailType = getThumbnailType(item.name);
    
    return (
      <TouchableOpacity
        style={styles.documentCard}
        onPress={() => onSelectDocument(item)}
        activeOpacity={0.7}
      >
        <View style={styles.thumbnail}>
          {renderThumbnail(thumbnailType)}
        </View>
        <Text style={styles.documentTitle}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Templates</Text>
      </View>

      {/* AI Create Button */}
      <View style={styles.aiCreateContainer}>
        <TouchableOpacity 
          style={styles.aiCreateButton}
          onPress={() => setShowAIOnboarding(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.aiCreateIcon}>🤖</Text>
          <View style={styles.aiCreateTextContainer}>
            <Text style={styles.aiCreateTitle}>Create with AI Assistant</Text>
            <Text style={styles.aiCreateSubtitle}>Get professional emails in minutes</Text>
          </View>
          <Text style={styles.aiCreateArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search templates with natural language..."
          placeholderTextColor="#999"
          // Non-functional for demo
        />
      </View>

      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No templates yet</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleCreateNew}>
              <Text style={styles.emptyButtonText}>Create your first email</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity 
            style={styles.browseContainer}
            onPress={() => setShowBrowseModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.browseText}>📚 Browse templates</Text>
          </TouchableOpacity>
        }
      />

      {/* Browse Templates Modal */}
      <Modal
        visible={showBrowseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBrowseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Browse Templates</Text>
            <Text style={styles.modalText}>
              In production, this would open an expanded template library with:
              
              • Professional newsletter templates
              • Industry-specific designs  
              • Seasonal and promotional layouts
              • Advanced filtering and search
              • Template categories and tags
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowBrowseModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Banner Modal */}
      <Modal
        visible={showBannerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBannerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📱 Try Our Mobile App</Text>
            <Text style={styles.modalText}>
              In production, this would:
              
              • Detect your device platform (iOS/Android)
              • Check if our mobile app is already installed
              • Open the app directly if installed
              • Redirect to App Store/Play Store if not installed
              • Sync your templates and preferences automatically
              • Provide native mobile editing experience
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowBannerModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* AI Onboarding Modal */}
      <Modal
        visible={showAIOnboarding}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AIOnboardingScreen
          onComplete={handleAIComplete}
          onBack={() => setShowAIOnboarding(false)}
        />
      </Modal>

      {/* Bottom Banner */}
      <View style={styles.bottomBanner}>
        <Text style={styles.bannerText}>📱 Try our mobile app</Text>
        <TouchableOpacity 
          style={styles.bannerButton} 
          onPress={() => setShowBannerModal(true)}
        >
          <Text style={styles.bannerButtonText}>Get App</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 20,
  },
  documentCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  separator: {
    height: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 20,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  browseContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  browseText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  thumbnail: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emailThumbnail: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 3,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emailLogo: {
    width: 12,
    height: 8,
    borderRadius: 2,
  },
  emailNav: {
    flexDirection: 'row',
    gap: 2,
  },
  navItem: {
    width: 8,
    height: 3,
    backgroundColor: '#ccc',
    borderRadius: 1,
  },
  emailHero: {
    padding: 4,
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 16,
    borderRadius: 2,
    marginBottom: 2,
  },
  heroText: {
    width: '100%',
    alignItems: 'center',
    gap: 1,
  },
  emailContent: {
    padding: 4,
    paddingTop: 0,
  },
  contentBlock: {
    gap: 1,
  },
  textLine: {
    height: 2,
    backgroundColor: '#ddd',
    borderRadius: 1,
  },
  welcomeContent: {
    padding: 4,
    alignItems: 'center',
    gap: 3,
  },
  welcomeIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 2,
  },
  ctaButton: {
    width: 24,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  promoBanner: {
    height: 12,
    margin: 4,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoText: {
    width: 20,
    height: 3,
    borderRadius: 1,
  },
  productGrid: {
    flexDirection: 'row',
    gap: 2,
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  productItem: {
    flex: 1,
    height: 16,
    borderRadius: 2,
  },
  productShowcase: {
    padding: 4,
    gap: 3,
  },
  productImage: {
    width: '100%',
    height: 20,
    borderRadius: 2,
  },
  productInfo: {
    gap: 1,
  },
  genericContent: {
    padding: 4,
    gap: 2,
  },
  spacer: {
    height: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1976d2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 25,
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // AI Create Button Styles
  aiCreateContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  aiCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Fallback
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiCreateIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  aiCreateTextContainer: {
    flex: 1,
  },
  aiCreateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  aiCreateSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  aiCreateArrow: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});