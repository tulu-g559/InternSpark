'use client';

import { UploadCloud, File } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface StoredResume {
  dataUri: string;
  name: string;
}

interface FileDropzoneProps {
  onFileAccepted: (resume: StoredResume) => void;
  onFileRemoved: () => void;
  storedResume: StoredResume | null;
  disabled?: boolean;
  className?: string;
  accept?: Accept;
}

export function FileDropzone({
  onFileAccepted,
  onFileRemoved,
  storedResume,
  disabled,
  className,
  accept = {
    'application/pdf': ['.pdf'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
  },
}: FileDropzoneProps) {
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const droppedFile = acceptedFiles[0];
      if (droppedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onFileAccepted({ name: droppedFile.name, dataUri: content });
        };
        reader.onerror = () => {
          setError('Failed to read the file.');
          onFileRemoved();
        };
        reader.readAsDataURL(droppedFile);
      }
    },
    [onFileAccepted, onFileRemoved]
  );

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileRemoved();
    setError(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled,
  });

  const isImage = storedResume?.dataUri.startsWith('data:image/');

  if (storedResume?.dataUri) {
    return (
      <div className={cn('relative w-full rounded-xl border border-dashed p-4 text-center border-indigo-400/50 bg-indigo-900/10', className)}>
        <div className="flex flex-col items-center justify-center gap-2 text-white">
          {isImage ? (
            <img src={storedResume.dataUri} alt="Resume preview" className="max-h-48 w-auto rounded-md object-contain" />
          ) : (
            <File className="h-12 w-12 text-indigo-400" />
          )}
          <p className="text-sm font-semibold text-indigo-300">{storedResume.name}</p>
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
        'flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-800/50 text-center transition-colors hover:border-primary',
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
        <p className="mb-2 text-sm text-indigo-300">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">PDF, PNG, or JPG</p>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
