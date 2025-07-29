import { EmailDocument } from '../types';
import { supabase } from './supabase';
import { migrateDocument } from './documentMigration';


class DocumentStorageService {

  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing Supabase document storage...');
      
      // Test Supabase connection
      const { error } = await supabase
        .from('documents')
        .select('id')
        .limit(1);

      if (error) {
        console.warn('⚠️ Supabase connection error:', error.message);
        return;
      }

      console.log('✅ Supabase connection established');
    } catch (error) {
      console.warn('⚠️ Failed to initialize Supabase:', error);
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
        return [];
      }

      if (!data || data.length === 0) {
        console.log('📄 No documents found in Supabase');
        return [];
      }

      // Convert Supabase format to EmailDocument format and migrate
      const documents: EmailDocument[] = data.map(doc => {
        const rawDocument = {
          id: doc.id,
          name: doc.name,
          content: doc.content, // This might be old format
          sections: doc.sections, // This might be new format
          fromName: doc.from_name,
          fromEmail: doc.from_email,
          replyToEmail: doc.reply_to_email,
          subject: doc.subject,
          preheader: doc.preheader,
          globalStyles: doc.global_styles,
          created: doc.created,
          lastModified: doc.last_modified,
        };
        return migrateDocument(rawDocument);
      });

      console.log('✅ Fetched', documents.length, 'documents from Supabase');
      return documents;
    } catch (error) {
      console.warn('⚠️ Failed to fetch documents from Supabase:', error);
      return [];
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
        console.warn('⚠️ Document not found in Supabase:', error?.message);
        return null;
      }

      // Migrate document from database format to current format
      const rawDocument = {
        id: data.id,
        name: data.name,
        content: data.content, // This might be old format
        sections: data.sections, // This might be new format
        fromName: data.from_name,
        fromEmail: data.from_email,
        replyToEmail: data.reply_to_email,
        subject: data.subject,
        preheader: data.preheader,
        globalStyles: data.global_styles,
        created: data.created,
        lastModified: data.last_modified,
      };
      
      const document = migrateDocument(rawDocument);

      console.log('✅ Fetched document:', document.name);
      return document;
    } catch (error) {
      console.warn('⚠️ Failed to fetch document from Supabase:', error);
      return null;
    }
  }

  async saveDocument(document: EmailDocument): Promise<void> {
    try {
      console.log('💾 Saving document to Supabase:', document.id, document.name);
      console.log('📝 Document sections:', document.sections.length);
      
      const now = new Date().toISOString();
      document.lastModified = now;

      // Convert EmailDocument to Supabase format
      const supabaseDoc = {
        id: document.id,
        name: document.name,
        sections: document.sections,
        from_name: document.fromName,
        from_email: document.fromEmail,
        reply_to_email: document.replyToEmail,
        subject: document.subject,
        preheader: document.preheader,
        global_styles: document.globalStyles,
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
      fromName: 'Your Name',
      fromEmail: 'hello@example.com',
      replyToEmail: 'hello@example.com',
      subject: 'Email Subject',
      preheader: 'Email preview text...',
      sections: [{
        id: `section-${Date.now()}`,
        name: 'Main Content',
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
      }],
      globalStyles: {
        bodyBackgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        textColor: '#333333',
        linkColor: '#1976d2',
        headingColor: '#000000',
      },
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