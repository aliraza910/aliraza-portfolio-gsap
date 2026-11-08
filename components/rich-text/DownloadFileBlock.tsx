'use client';

import React from 'react';
import { LordIcon } from '@/components/ui/LordIcon';
import { getProxiedMediaUrl } from '@/lib/payload/client';

interface DownloadFileBlockProps {
  file?: any;
  displayLabel?: string;
  description?: string;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function DownloadFileBlock({
  file,
  displayLabel,
  description,
}: DownloadFileBlockProps) {
  if (!file) return null;

  const fileData = typeof file === 'object' ? file : { url: file, filename: 'attachment' };
  const rawUrl = fileData.url || '';
  const downloadUrl = getProxiedMediaUrl(rawUrl);
  const filename = fileData.filename || 'downloadable-file';
  const filesize = formatBytes(fileData.filesize);

  return (
    <div className="my-5 border border-border p-3.5 text-xs bg-code-bg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/wxnxiano.json" // Document
            trigger="hover"
            size={20}
            className="mt-0.5"
          />
          <div>
            <span className="font-mono font-medium text-foreground">
              {displayLabel || filename}
            </span>
            {description && (
              <p className="text-secondary mt-0.5">{description}</p>
            )}
            <div className="text-muted mt-1 font-mono text-[11px]">
              {filename} · {filesize}
            </div>
          </div>
        </div>

        <div>
          <a
            href={downloadUrl}
            download={filename}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground hover:underline font-mono text-xs whitespace-nowrap"
          >
            <LordIcon
              src="https://cdn.lordicon.com/vduvxizq.json" // Download arrow
              trigger="hover"
              size={18}
            />
            <span>download file</span>
          </a>
        </div>
      </div>
    </div>
  );
}
