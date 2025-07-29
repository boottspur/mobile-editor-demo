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
  // Email metadata
  fromName?: string;
  fromEmail?: string;
  replyToEmail?: string;
  subject?: string;
  preheader?: string;
  // Document structure
  sections: Section[];
  // Global styles
  globalStyles?: GlobalStyles;
  lastModified: string;
  created: string;
}

export interface GlobalStyles {
  bodyBackgroundColor?: string;
  bodyBackgroundImage?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  linkColor?: string;
  headingColor?: string;
}

export interface Section {
  id: string;
  name?: string;
  layouts: Layout[];
}

export interface Layout {
  id: string;
  columns: Column[];
  backgroundColor?: string;
  isDynamic?: boolean;
  mobileOrder?: number[]; // Column order for mobile view
}

export interface Column {
  id: string;
  width: number; // Percentage width (e.g., 50 for 50%)
  blocks: BlockNode[];
}

export type BlockType = 
  | 'container' 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'divider' 
  | 'spacer' 
  | 'social-share' 
  | 'social-follow' 
  | 'video' 
  | 'read-more' 
  | 'data-table' 
  | 'event' 
  | 'feedback' 
  | 'rsvp' 
  | 'product';

export interface BlockNode {
  id: string;
  type: BlockType;
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

export interface ButtonProps {
  text: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  padding: string;
  url: string;
  width: string;
}

export interface DividerProps {
  color: string;
  thickness: number;
  style: 'solid' | 'dashed' | 'dotted';
  margin: string;
}

export interface SpacerProps {
  height: number;
}

export interface SocialShareProps {
  platforms: ('facebook' | 'twitter' | 'linkedin' | 'email' | 'whatsapp')[];
  url: string;
  title: string;
  layout: 'horizontal' | 'vertical';
}

export interface SocialFollowProps {
  accounts: Array<{
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
    url: string;
    handle: string;
  }>;
  style: 'icons' | 'buttons';
}

export interface VideoProps {
  src: string;
  thumbnail: string;
  title: string;
  autoplay: boolean;
  controls: boolean;
  width: string;
  height: string;
}

export interface ReadMoreProps {
  shortText: string;
  fullText: string;
  buttonText: string;
  expanded: boolean;
}

export interface DataTableProps {
  headers: string[];
  rows: string[][];
  striped: boolean;
  bordered: boolean;
}

export interface EventProps {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  rsvpUrl?: string;
}

export interface FeedbackProps {
  question: string;
  type: 'rating' | 'yes-no' | 'text';
  placeholder?: string;
  submitUrl: string;
}

export interface RsvpProps {
  event: string;
  date: string;
  options: string[];
  submitUrl: string;
}

export interface ProductProps {
  name: string;
  image: string;
  price: string;
  description: string;
  buyUrl: string;
  layout: 'horizontal' | 'vertical';
}