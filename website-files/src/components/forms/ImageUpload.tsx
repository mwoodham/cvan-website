'use client';

import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { compressImage, formatFileSize, isValidImageType, needsCompression } from '@/lib/image-utils';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  error?: string;
  maxSizeMB?: number;
}

type UploadStatus = 'idle' | 'processing' | 'ready' | 'error';

export function ImageUpload({ onImageChange, error, maxSizeMB = 5 }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [fileInfo, setFileInfo] = useState<{
    originalSize: number;
    finalSize: number;
    wasCompressed: boolean;
  } | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isValidImageType(file)) {
      setProcessingError('Please upload a PNG, JPEG, or WEBP image');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setProcessingError(null);

    try {
      let finalFile = file;
      let wasCompressed = false;

      // Compress if needed (> 1MB or > maxSize)
      if (needsCompression(file, maxSizeMB)) {
        const compressed = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.8,
          maxSizeMB,
        });
        finalFile = compressed.file;
        setPreview(compressed.preview);
        wasCompressed = true;
        setFileInfo({
          originalSize: compressed.originalSize,
          finalSize: compressed.compressedSize,
          wasCompressed: true,
        });
      } else {
        // Just create preview without compression
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setFileInfo({
          originalSize: file.size,
          finalSize: file.size,
          wasCompressed: false,
        });
      }

      // Check if final file is still too large
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (finalFile.size > maxBytes) {
        setProcessingError(`Image is still too large after compression. Please use a smaller image.`);
        setStatus('error');
        return;
      }

      onImageChange(finalFile);
      setStatus('ready');
    } catch (err) {
      console.error('Image processing error:', err);
      setProcessingError('Failed to process image. Please try another file.');
      setStatus('error');
    }
  }, [maxSizeMB, onImageChange]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    setStatus('idle');
    setFileInfo(null);
    setProcessingError(null);
    onImageChange(null);
  }, [onImageChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create a synthetic event to reuse handleFileChange logic
      const input = document.createElement('input');
      input.type = 'file';
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      const syntheticEvent = { target: input } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative">
        {preview && status === 'ready' ? (
          // Image Preview
          <div className="relative w-full h-64 border-2 border-cvan-green rounded-lg overflow-hidden bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Remove image"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4 text-cvan-green" />
                <span className="text-xs font-medium text-gray-700">Image ready</span>
              </div>
              {fileInfo && (
                <div className="px-3 py-1.5 bg-white/90 rounded-full shadow-sm">
                  <span className="text-xs text-gray-600">
                    {fileInfo.wasCompressed ? (
                      <>
                        {formatFileSize(fileInfo.originalSize)} → {formatFileSize(fileInfo.finalSize)}
                        <span className="text-cvan-green ml-1">(optimized)</span>
                      </>
                    ) : (
                      formatFileSize(fileInfo.finalSize)
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Upload Zone
          <label
            htmlFor="image-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              status === 'error'
                ? 'border-red-300 bg-red-50'
                : status === 'processing'
                ? 'border-cvan-purple bg-cvan-purple/5'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {status === 'processing' ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-10 h-10 mb-3 text-cvan-purple animate-spin" />
                <p className="text-sm font-medium text-cvan-purple">Optimizing image...</p>
                <p className="mt-1 text-xs text-gray-500">This may take a moment</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <Upload className={`w-10 h-10 mb-3 ${status === 'error' ? 'text-red-400' : 'text-gray-400'}`} />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or WEBP (max. {maxSizeMB}MB)</p>
                <p className="text-xs text-gray-400 mt-1">Images will be automatically optimized</p>
              </div>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={status === 'processing'}
            />
          </label>
        )}
      </div>

      {/* Error Messages */}
      {(error || processingError) && (
        <p className="text-sm text-red-600">{processingError || error}</p>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Recommended: 16:9 aspect ratio (e.g., 1920x1080px). Large images will be automatically resized and compressed.
      </p>
    </div>
  );
}
