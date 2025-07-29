import { EmailDocument, BlockNode, Section, Layout, Column } from '../types';

// Convert old format (direct blocks) to new format (sections/layouts/columns)
export function migrateDocument(doc: any): EmailDocument {
  // If already in new format, return as-is
  if (doc.sections && Array.isArray(doc.sections)) {
    return doc as EmailDocument;
  }

  // Migrate from old format
  const migratedDoc: EmailDocument = {
    id: doc.id,
    name: doc.name,
    fromName: doc.fromName || 'Your Name',
    fromEmail: doc.fromEmail || 'hello@example.com',
    replyToEmail: doc.replyToEmail || 'hello@example.com',
    subject: doc.subject || 'Email Subject',
    preheader: doc.preheader || 'Email preview text...',
    sections: [],
    globalStyles: {
      bodyBackgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      textColor: '#333333',
      linkColor: '#1976d2',
      headingColor: '#000000',
    },
    lastModified: doc.lastModified,
    created: doc.created,
  };

  // Convert old content array to new structure
  if (doc.content && Array.isArray(doc.content)) {
    const section: Section = {
      id: `section-${Date.now()}`,
      name: 'Main Content',
      layouts: [],
    };

    // Group blocks into layouts (each block becomes its own layout for now)
    doc.content.forEach((block: BlockNode, index: number) => {
      const layout: Layout = {
        id: `layout-${Date.now()}-${index}`,
        columns: [{
          id: `column-${Date.now()}-${index}`,
          width: 100, // Full width
          blocks: [block],
        }],
        backgroundColor: '#ffffff',
        isDynamic: false,
      };
      section.layouts.push(layout);
    });

    migratedDoc.sections.push(section);
  }

  return migratedDoc;
}