import * as Linking from 'expo-linking';
import { documentStorage } from './documentStorage';
import { EmailDocument } from '../types';

export interface DeepLinkData {
  docId?: string;
}

export const parseDeepLink = (url: string): DeepLinkData | null => {
  try {
    const { queryParams } = Linking.parse(url);
    return {
      docId: queryParams?.docId as string,
    };
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
};

export const handleDeepLink = async (
  url: string,
  onDocumentLoad: (document: EmailDocument) => void
): Promise<void> => {
  const linkData = parseDeepLink(url);
  
  if (linkData?.docId) {
    try {
      const document = await documentStorage.getDocument(linkData.docId);
      if (document) {
        onDocumentLoad(document);
      }
    } catch (error) {
      console.error('Error loading document from deep link:', error);
    }
  }
};