export type AppContext = 'desktop' | 'mobile-web' | 'native';

export interface ContextDetection {
  getAppContext(): AppContext;
  isDesktop(): boolean;
  isMobileWeb(): boolean;
  isNative(): boolean;
}

export interface EmailDocument {
  id: string;
  name: string;
  content: BlockNode[];
  lastModified: string;
  created: string;
}

export interface BlockNode {
  id: string;
  type: 'container' | 'text' | 'image';
  props: Record<string, any>;
  children?: BlockNode[];
}

export interface ContainerProps {
  padding: number;
  backgroundColor: string;
  width: string;
}

export interface TextProps {
  content: string;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
}

export interface ImageProps {
  src: string;
  alt: string;
  width: string;
  height: string;
}