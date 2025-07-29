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

interface DocumentListProps {
  onSelectDocument: (document: EmailDocument) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ onSelectDocument }) => {
  const [documents, setDocuments] = useState<EmailDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBrowseModal, setShowBrowseModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderDocument = ({ item }: { item: EmailDocument }) => (
    <TouchableOpacity
      style={styles.documentCard}
      onPress={() => onSelectDocument(item)}
      activeOpacity={0.7}
    >
      <View style={styles.thumbnail}>
        <View style={styles.thumbnailGrid}>
          <View style={styles.thumbnailBlock} />
          <View style={styles.thumbnailBlock} />
          <View style={[styles.thumbnailBlock, styles.thumbnailBlockWide]} />
          <View style={styles.thumbnailBlock} />
        </View>
      </View>
      <Text style={styles.documentTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

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
    height: 80,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
    padding: 8,
  },
  thumbnailGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  thumbnailBlock: {
    flex: 1,
    height: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    minWidth: 30,
  },
  thumbnailBlockWide: {
    flex: 2,
    backgroundColor: '#1976d2',
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
});