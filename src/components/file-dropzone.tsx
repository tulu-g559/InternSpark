'use client';

import { UploadCloud } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileRead: (content: string) => void;
  accept?: Accept;
  disabled?: boolean;
  className?: string;
}

export function FileDropzone({
  onFileRead,
  accept = { 'text/plain': ['.txt'], 'text/markdown': ['.md'] },
  disabled,
  className,
}: FileDropzoneProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (file) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onFileRead(content);
        };
        reader.onerror = () => {
          setError('Failed to read the file.');
        };
        reader.readAsText(file);
      }
    },
    [onFileRead]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary/50 transition-colors',
        {
          'border-primary bg-secondary/50': isDragActive,
          'cursor-not-allowed opacity-50': disabled,
        },
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
        {fileName ? (
          <>
            <p className="mb-2 text-sm font-semibold text-foreground">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              Drop another file or click to replace
            </p>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm text-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">TXT or MD files</p>
          </>
        )}
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
