export interface Media {
  id: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  url?: string;
  alt?: string;
  caption?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name?: string;
  email?: string;
}

// Lexical AST Node Types
export interface LexicalNode {
  type: string;
  version: number;
  [key: string]: any;
}

export interface LexicalTextNode extends LexicalNode {
  type: 'text';
  text: string;
  format: number; // bitmask for bold, italic, underline, strikethrough, code, etc.
  style?: string;
  mode?: string;
}

export interface LexicalElementNode extends LexicalNode {
  children?: (LexicalNode | LexicalTextNode)[];
  direction?: 'ltr' | 'rtl' | null;
  format?: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify';
  indent?: number;
  tag?: string; // for headings h1..h6
}

export interface LexicalBlockNode extends LexicalNode {
  type: 'block';
  fields: {
    blockType: 'codeBlock' | 'downloadFile' | 'mermaid' | 'callout' | 'math' | 'details';
    // Code block fields
    code?: string;
    language?: string;
    filename?: string;
    highlightLines?: string;
    showLineNumbers?: boolean;

    // Download file fields
    file?: Media | string;
    displayLabel?: string;
    description?: string;

    // Mermaid diagram fields
    diagram?: string;
    caption?: string;

    // Callout fields
    calloutType?: 'info' | 'warning' | 'important' | 'danger' | 'tip' | 'note';
    title?: string;
    content?: string;

    // Math fields
    expression?: string;
    displayMode?: boolean;

    // Details fields
    summary?: string;
    body?: string;
  };
}

export interface LexicalRootNode {
  root: {
    type: 'root';
    format: string;
    indent: number;
    version: number;
    children: (LexicalNode | LexicalElementNode | LexicalBlockNode)[];
    direction: 'ltr' | 'rtl' | null;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: LexicalRootNode;
  coverImage?: Media | string | null;
  author?: Author | string | null;
  category?: Category | string | null;
  tags?: (Tag | string)[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
  readingTime?: number;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}

export interface ProjectHighlight {
  id?: string;
  highlight: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  category: string;
  stack: string;
  description: string;
  highlights?: Array<ProjectHighlight | string>;
  githubUrl?: string;
  liveUrl?: string;
  coverImage?: Media | string | null;
  featured?: boolean;
  order?: number;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  _status?: 'draft' | 'published';
}

export interface SiteSettings {
  siteTitle?: string;
  authorName?: string;
  authorBio?: string;
  authorAvatar?: Media | string | null;
  authorEmail?: string;
  authorWebsite?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultOgImage?: Media | string | null;
  defaultPostsPerPage?: number;
  canonicalDomain?: string;
  contactEmail?: string;
  seoDefaults?: {
    defaultTitle?: string;
    defaultDescription?: string;
  };
}

export interface PaginatedDocs<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

