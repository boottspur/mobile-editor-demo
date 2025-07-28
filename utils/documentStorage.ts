import { EmailDocument } from '../types';
import { supabase } from './supabase';

// Import bundled documents (as fallback templates)
import simpleLayout from '../assets/documents/simple-layout.js';
import twoColumn from '../assets/documents/two-column.js';
import complexLayout from '../assets/documents/complex-layout.js';

class DocumentStorageService {
  private bundledDocuments: EmailDocument[] = [
    simpleLayout as EmailDocument,
    twoColumn as EmailDocument,
    complexLayout as EmailDocument,
  ];

  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing Supabase document storage...');
      
      // Check if any documents exist in Supabase
      const { data: existingDocs, error } = await supabase
        .from('documents')
        .select('id')
        .limit(1);

      if (error) {
        console.warn('⚠️ Supabase not available, using bundled documents:', error.message);
        return;
      }

      // If no documents exist, seed with bundled documents
      if (!existingDocs || existingDocs.length === 0) {
        console.log('📚 Seeding Supabase with bundled documents...');
        for (const doc of this.bundledDocuments) {
          await this.saveDocument(doc);
        }
        console.log('✅ Seeded Supabase with', this.bundledDocuments.length, 'documents');
      } else {
        console.log('✅ Supabase already has documents, skipping seed');
      }
    } catch (error) {
      console.warn('⚠️ Failed to initialize Supabase, using bundled documents:', error);
    }
  }

  async getAllDocuments(): Promise<EmailDocument[]> {
    try {
      console.log('📖 Fetching all documents from Supabase...');
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('last_modified', { ascending: false });

      if (error) {
        console.warn('⚠️ Error fetching from Supabase:', error.message);
        return this.bundledDocuments;
      }

      if (!data || data.length === 0) {
        console.log('📄 No documents in Supabase, returning bundled documents');
        return this.bundledDocuments;
      }

      // Convert Supabase format to EmailDocument format
      const documents: EmailDocument[] = data.map(doc => ({
        id: doc.id,
        name: doc.name,
        content: doc.content,
        created: doc.created,
        lastModified: doc.last_modified,
      }));

      console.log('✅ Fetched', documents.length, 'documents from Supabase');
      return documents;
    } catch (error) {
      console.warn('⚠️ Failed to fetch documents from Supabase:', error);
      return this.bundledDocuments;
    }
  }

  async getDocument(id: string): Promise<EmailDocument | null> {
    try {
      console.log('🔍 Fetching document:', id);
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.warn('⚠️ Document not found in Supabase, checking bundled:', error?.message);
        return this.bundledDocuments.find(doc => doc.id === id) || null;
      }

      const document: EmailDocument = {
        id: data.id,
        name: data.name,
        content: data.content,
        created: data.created,
        lastModified: data.last_modified,
      };

      console.log('✅ Fetched document:', document.name);
      return document;
    } catch (error) {
      console.warn('⚠️ Failed to fetch document from Supabase:', error);
      return this.bundledDocuments.find(doc => doc.id === id) || null;
    }
  }

  async saveDocument(document: EmailDocument): Promise<void> {
    try {
      console.log('💾 Saving document to Supabase:', document.id, document.name);
      console.log('📝 Document content blocks:', document.content.length);
      
      const now = new Date().toISOString();
      document.lastModified = now;

      // Convert EmailDocument to Supabase format
      const supabaseDoc = {
        id: document.id,
        name: document.name,
        content: document.content,
        created: document.created || now,
        last_modified: now,
      };

      const { error } = await supabase
        .from('documents')
        .upsert(supabaseDoc, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('❌ Error saving to Supabase:', error.message);
        throw new Error(`Failed to save document: ${error.message}`);
      }

      console.log('✅ Successfully saved document to Supabase');
    } catch (error) {
      console.error('❌ Failed to save document:', error);
      throw error;
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
    try {
      console.log('🗑️ Deleting document:', id);
      
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting from Supabase:', error.message);
        throw new Error(`Failed to delete document: ${error.message}`);
      }

      console.log('✅ Successfully deleted document from Supabase');
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      throw error;
    }
  }
}

export const documentStorage = new DocumentStorageService();