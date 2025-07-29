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
} from 'react-native';
import { EmailDocument } from '../types';
import { documentStorage } from '../utils/documentStorage';

interface DocumentListProps {
  onSelectDocument: (document: EmailDocument) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ onSelectDocument }) => {
  const [documents, setDocuments] = useState<EmailDocument[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Text style={styles.documentTitle}>{item.name}</Text>
      <Text style={styles.documentDate}>Modified: {formatDate(item.lastModified)}</Text>
      <Text style={styles.documentBlocks}>
        {item.sections?.length || 0} section{(item.sections?.length || 0) !== 1 ? 's' : ''}
      </Text>
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
        <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
          <Text style={styles.createButtonText}>+ New</Text>
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
          <View style={styles.browseContainer}>
            <Text style={styles.browseText}>📚 Browse templates</Text>
          </View>
        }
      />
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
  createButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  documentDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  documentBlocks: {
    fontSize: 14,
    color: '#999',
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
    paddingTop: 0,
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
});