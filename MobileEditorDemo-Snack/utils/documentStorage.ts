import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { EmailDocument } from '../types';

// Import bundled documents (now as JS files)
import simpleLayout from '../assets/documents/simple-layout.js';
import twoColumn from '../assets/documents/two-column.js';
import complexLayout from '../assets/documents/complex-layout.js';

const STORAGE_KEY = 'mobile-email-editor-documents';
const DOCUMENT_DIR = `${FileSystem.documentDirectory}documents/`;

class DocumentStorageService {
  private bundledDocuments: EmailDocument[] = [
    simpleLayout as EmailDocument,
    twoColumn as EmailDocument,
    complexLayout as EmailDocument,
  ];

  async initialize(): Promise<void> {
    if (Platform.OS !== 'web') {
      // Create documents directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(DOCUMENT_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(DOCUMENT_DIR, { intermediates: true });
      }
      
      // Initialize with bundled documents if no documents exist
      const documents = await this.getAllDocuments();
      if (documents.length === 0) {
        for (const doc of this.bundledDocuments) {
          await this.saveDocument(doc);
        }
      }
    } else {
      // Web: Initialize localStorage if empty
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bundledDocuments));
      }
    }
  }

  async getAllDocuments(): Promise<EmailDocument[]> {
    if (Platform.OS === 'web') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.bundledDocuments;
    } else {
      try {
        const files = await FileSystem.readDirectoryAsync(DOCUMENT_DIR);
        const documents: EmailDocument[] = [];
        
        for (const file of files) {
          if (file.endsWith('.json')) {
            const content = await FileSystem.readAsStringAsync(`${DOCUMENT_DIR}${file}`);
            documents.push(JSON.parse(content));
          }
        }
        
        return documents.length > 0 ? documents : this.bundledDocuments;
      } catch (error) {
        console.error('Error reading documents:', error);
        return this.bundledDocuments;
      }
    }
  }

  async getDocument(id: string): Promise<EmailDocument | null> {
    if (Platform.OS === 'web') {
      const documents = await this.getAllDocuments();
      return documents.find(doc => doc.id === id) || null;
    } else {
      try {
        const content = await FileSystem.readAsStringAsync(`${DOCUMENT_DIR}${id}.json`);
        return JSON.parse(content);
      } catch (error) {
        // Try to find in bundled documents
        return this.bundledDocuments.find(doc => doc.id === id) || null;
      }
    }
  }

  async saveDocument(document: EmailDocument): Promise<void> {
    document.lastModified = new Date().toISOString();
    
    if (Platform.OS === 'web') {
      const documents = await this.getAllDocuments();
      const index = documents.findIndex(doc => doc.id === document.id);
      
      if (index >= 0) {
        documents[index] = document;
      } else {
        documents.push(document);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } else {
      await FileSystem.writeAsStringAsync(
        `${DOCUMENT_DIR}${document.id}.json`,
        JSON.stringify(document, null, 2)
      );
    }
  }

  async createDocument(name: string): Promise<EmailDocument> {
    const newDocument: EmailDocument = {
      id: `doc-${Date.now()}`,
      name,
      content: [],
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    
    await this.saveDocument(newDocument);
    return newDocument;
  }

  async deleteDocument(id: string): Promise<void> {
    if (Platform.OS === 'web') {
      const documents = await this.getAllDocuments();
      const filtered = documents.filter(doc => doc.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } else {
      try {
        await FileSystem.deleteAsync(`${DOCUMENT_DIR}${id}.json`);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  }
}

export const documentStorage = new DocumentStorageService();