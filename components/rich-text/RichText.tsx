import React from 'react';
import Link from 'next/link';
import { CodeBlock } from './CodeBlock';
import { DownloadFileBlock } from './DownloadFileBlock';
import { CalloutBlock } from './CalloutBlock';
import { MermaidBlock } from './MermaidBlock';
import { MathBlock } from './MathBlock';
import { DetailsBlock } from './DetailsBlock';
import { LexicalRootNode, LexicalNode } from '@/lib/payload/types';
import { getProxiedMediaUrl } from '@/lib/payload/client';

const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;
const IS_SUBSCRIPT = 1 << 5;
const IS_SUPERSCRIPT = 1 << 6;

interface RichTextProps {
  content?: LexicalRootNode | any;
  className?: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function RichText({ content, className = '' }: RichTextProps) {
  if (!content || !content.root || !content.root.children) {
    return null;
  }

  return (
    <div className={`prose-markdown ${className}`}>
      {content.root.children.map((child: LexicalNode, index: number) =>
        renderNode(child, index)
      )}
    </div>
  );
}

function renderTextNode(node: any, index: number): React.ReactNode {
  let text: React.ReactNode = node.text;

  if (!text && text !== '') return null;

  const format = node.format || 0;

  if (format & IS_BOLD) {
    text = <strong key={`b-${index}`}>{text}</strong>;
  }
  if (format & IS_ITALIC) {
    text = <em key={`i-${index}`}>{text}</em>;
  }
  if (format & IS_UNDERLINE) {
    text = <u key={`u-${index}`}>{text}</u>;
  }
  if (format & IS_STRIKETHROUGH) {
    text = <s key={`s-${index}`}>{text}</s>;
  }
  if (format & IS_CODE) {
    text = (
      <code
        key={`c-${index}`}
        className="font-mono text-xs px-1.5 py-0.5 bg-muted/10 border border-border rounded text-foreground"
      >
        {text}
      </code>
    );
  }
  if (format & IS_SUBSCRIPT) {
    text = <sub key={`sub-${index}`}>{text}</sub>;
  }
  if (format & IS_SUPERSCRIPT) {
    text = <sup key={`sup-${index}`}>{text}</sup>;
  }

  return <React.Fragment key={index}>{text}</React.Fragment>;
}

function getNodeText(node: any): string {
  if (node.type === 'text') return node.text || '';
  if (node.children) {
    return node.children.map(getNodeText).join('');
  }
  return '';
}

function renderNode(node: any, index: number): React.ReactNode {
  if (!node) return null;

  if (node.type === 'text') {
    return renderTextNode(node, index);
  }

  if (node.type === 'block') {
    const fields = node.fields || {};
    const blockType = (fields.blockType || '').toLowerCase();
    switch (blockType) {
      case 'codeblock':
      case 'code':
        return (
          <CodeBlock
            key={index}
            code={fields.code || ''}
            language={fields.language || 'text'}
            filename={fields.filename || fields.title}
            highlightLines={fields.highlightLines || fields.highlightedLines}
            showLineNumbers={fields.showLineNumbers ?? fields.lineNumbers ?? true}
          />
        );

      case 'filedownloadblock':
      case 'filedownload':
      case 'downloadfile':
        return (
          <DownloadFileBlock
            key={index}
            file={fields.file}
            displayLabel={fields.displayLabel}
            description={fields.description}
          />
        );

      case 'calloutblock':
      case 'callout':
        return (
          <CalloutBlock
            key={index}
            calloutType={fields.calloutType}
            title={fields.title}
            content={fields.content}
          />
        );

      case 'mermaidblock':
      case 'mermaid':
        return (
          <MermaidBlock
            key={index}
            diagram={fields.diagram}
            caption={fields.caption}
          />
        );

      case 'mathblock':
      case 'math':
        return (
          <MathBlock
            key={index}
            expression={fields.expression}
            displayMode={fields.displayMode ?? true}
          />
        );

      case 'detailsblock':
      case 'details':
        return (
          <DetailsBlock
            key={index}
            summary={fields.summary}
            body={fields.body}
          />
        );

      default:
        return null;
    }
  }

  const children = node.children ? node.children.map(renderNode) : null;

  switch (node.type) {
    case 'paragraph':
      if (!node.children || node.children.length === 0) {
        return <p key={index} className="my-3">&nbsp;</p>;
      }
      return (
        <p key={index} className="my-4 leading-relaxed text-base sm:text-[17px] text-foreground">
          {children}
        </p>
      );

    case 'heading': {
      const tag = node.tag || 'h2';
      const plainText = getNodeText(node);
      const headingId = slugify(plainText);

      const headingClasses: Record<string, string> = {
        h1: 'text-3xl font-bold tracking-tight text-foreground mt-10 mb-4 pb-2 border-b border-border',
        h2: 'text-2xl font-bold tracking-tight text-foreground mt-8 mb-3 pb-2 border-b border-border/70',
        h3: 'text-xl font-semibold tracking-tight text-foreground mt-6 mb-2.5',
        h4: 'text-lg font-semibold text-foreground mt-5 mb-2',
        h5: 'text-sm font-semibold text-secondary mt-4 mb-1 uppercase tracking-wider',
        h6: 'text-xs font-semibold text-muted mt-4 mb-1 uppercase tracking-wider',
      };

      const className = headingClasses[tag] || headingClasses.h2;

      return React.createElement(
        tag,
        {
          key: index,
          id: headingId,
          className: `${className} scroll-mt-20 group`,
        },
        <>
          <span>{children}</span>
          <a
            href={`#${headingId}`}
            className="opacity-0 group-hover:opacity-100 text-muted hover:text-foreground ml-2 text-xs font-mono no-underline transition-opacity"
            aria-label={`Link to ${plainText}`}
          >
            #
          </a>
        </>
      );
    }

    case 'quote':
      return (
        <blockquote
          key={index}
          className="my-5 border-l-2 border-border pl-4 py-1 italic text-secondary text-sm"
        >
          {children}
        </blockquote>
      );

    case 'list': {
      const isOrdered = node.listType === 'number';
      const TagName = isOrdered ? 'ol' : 'ul';
      const listClass = isOrdered
        ? 'list-decimal my-4 pl-6 space-y-2 leading-relaxed text-foreground text-base'
        : 'list-disc my-4 pl-6 space-y-2 leading-relaxed text-foreground text-base';

      return (
        <TagName key={index} className={listClass}>
          {children}
        </TagName>
      );
    }

    case 'listitem':
      return (
        <li key={index} className="pl-1">
          {children}
        </li>
      );

    case 'link': {
      const href = node.fields?.url || node.url || '#';
      const isExternal = href.startsWith('http://') || href.startsWith('https://');

      if (isExternal) {
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          key={index}
          href={href}
          className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
        >
          {children}
        </Link>
      );
    }

    case 'upload': {
      const value = node.value;
      if (!value) return null;

      const rawUrl = value.url || '';
      const imageUrl = getProxiedMediaUrl(rawUrl);
      const altText = value.alt || value.filename || 'Article visual';

      return (
        <figure key={index} className="my-6 border border-border p-2">
          <div className="relative w-full overflow-hidden flex justify-center">
            <img
              src={imageUrl}
              alt={altText}
              className="max-h-[500px] max-w-full w-auto h-auto object-contain"
              loading="lazy"
            />
          </div>
          {(value.caption || value.description) && (
            <figcaption className="mt-2 text-center text-xs font-mono text-muted border-t border-border pt-1.5">
              {value.caption || value.description}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'table':
      return (
        <div key={index} className="my-6 overflow-x-auto border border-border">
          <table className="w-full border-collapse text-xs text-left">
            <tbody>{children}</tbody>
          </table>
        </div>
      );

    case 'tablerow':
      return (
        <tr key={index} className="border-b border-border last:border-b-0 hover:bg-muted/5 transition-colors">
          {children}
        </tr>
      );

    case 'tablecell': {
      const isHeader = node.headerState === 1 || node.headerState === 2;
      const CellTag = isHeader ? 'th' : 'td';
      return (
        <CellTag
          key={index}
          className={`p-2 font-mono text-xs border-r border-border last:border-r-0 ${
            isHeader ? 'bg-muted/10 font-semibold text-foreground' : 'text-foreground'
          }`}
        >
          {children}
        </CellTag>
      );
    }

    case 'code': {
      const codeText = getNodeText(node);
      const language = node.language || 'text';
      return (
        <CodeBlock
          key={index}
          code={codeText}
          language={language}
          showLineNumbers={true}
        />
      );
    }

    case 'horizontalrule':
      return <hr key={index} className="my-8 border-t border-border" />;

    default:
      if (children) {
        return <div key={index}>{children}</div>;
      }
      return null;
  }
}
