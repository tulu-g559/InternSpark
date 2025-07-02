'use client';

import { UploadCloud, File, Image as ImageIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface FileDropzoneProps {
  onFileRead: (content: string) => void;
  accept?: Accept;
  disabled?: boolean;
  className?: string;
}

export function FileDropzone({
  onFileRead,
  accept = {
    'application/pdf': ['.pdf'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
  },
  disabled,
  className,
}: FileDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const droppedFile = acceptedFiles[0];
      if (droppedFile) {
        setFile(droppedFile);
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onFileRead(content);
          if (droppedFile.type.startsWith('image/')) {
            setPreview(content);
          } else {
            setPreview(null);
          }
        };
        reader.onerror = () => {
          setError('Failed to read the file.');
          setFile(null);
          setPreview(null);
        };
        reader.readAsDataURL(droppedFile);
      }
    },
    [onFileRead]
  );
  
  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    onFileRead('');
    setError(null);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled,
  });

  if (file) {
    return (
      <div className={cn('relative w-full rounded-xl border border-dashed p-4 text-center', className)}>
        <div className="flex flex-col items-center justify-center gap-2 text-white">
          {preview ? (
            <img src={preview} alt="Resume preview" className="max-h-48 w-auto rounded-md object-contain" />
          ) : (
            <File className="h-12 w-12 text-blue-400" />
          )}
          <p className="text-sm font-semibold text-blue-300">{file.name}</p>
          <Button onClick={clearFile} variant="destructive" size="sm" className="mt-2">
            Remove File
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900 text-center transition-colors hover:border-primary',
        {
          'border-primary bg-primary/10': isDragActive,
          'cursor-not-allowed opacity-50': disabled,
        },
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <UploadCloud className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="mb-2 text-sm text-blue-300">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">PDF, PNG, or JPG</p>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
