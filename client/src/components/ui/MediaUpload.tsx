import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface MediaFile {
  file: File;
  preview: string;
  id: string;
  type: 'image' | 'video';
}

interface MediaUploadProps {
  media: MediaFile[];
  onMediaChange: (media: MediaFile[]) => void;
  maxFiles?: number;
  className?: string;
  acceptedTypes?: ('image' | 'video')[];
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  media,
  onMediaChange,
  maxFiles = 10,
  className = '',
  acceptedTypes = ['image', 'video']
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const createPreviewUrl = useCallback((file: File): string => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    } else if (file.type.startsWith('video/')) {
      return URL.createObjectURL(file);
    }
    return '';
  }, []);

  const revokePreviewUrl = useCallback((url: string) => {
    URL.revokeObjectURL(url);
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    if (media.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newMedia: MediaFile[] = files
      .filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        
        if (acceptedTypes.includes('image') && acceptedTypes.includes('video')) {
          return isImage || isVideo;
        } else if (acceptedTypes.includes('image')) {
          return isImage;
        } else if (acceptedTypes.includes('video')) {
          return isVideo;
        }
        return false;
      })
      .map(file => ({
        file,
        preview: createPreviewUrl(file),
        id: `${Date.now()}_${Math.random()}`,
        type: file.type.startsWith('image/') ? 'image' : 'video'
      }));

    onMediaChange([...media, ...newMedia]);
  }, [media, maxFiles, onMediaChange, acceptedTypes, createPreviewUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, [handleFiles]);

  const removeMedia = useCallback((mediaId: string) => {
    const mediaToRemove = media.find(m => m.id === mediaId);
    if (mediaToRemove) {
      revokePreviewUrl(mediaToRemove.preview);
    }
    
    const updatedMedia = media.filter(m => m.id !== mediaId);
    onMediaChange(updatedMedia);
  }, [media, onMediaChange, revokePreviewUrl]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getAcceptedTypesString = useCallback(() => {
    if (acceptedTypes.includes('image') && acceptedTypes.includes('video')) {
      return 'images and videos';
    } else if (acceptedTypes.includes('image')) {
      return 'images';
    } else if (acceptedTypes.includes('video')) {
      return 'videos';
    }
    return 'files';
  }, [acceptedTypes]);

  const getAcceptedMimeTypes = useCallback(() => {
    const types = [];
    if (acceptedTypes.includes('image')) {
      types.push('image/*');
    }
    if (acceptedTypes.includes('video')) {
      types.push('video/*');
    }
    return types.join(',');
  }, [acceptedTypes]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drag & Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAcceptedMimeTypes()}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
              {acceptedTypes.includes('image') && acceptedTypes.includes('video') ? (
                <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ) : acceptedTypes.includes('video') ? (
                <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                </svg>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop {getAcceptedTypesString()} here or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {acceptedTypes.includes('image') && acceptedTypes.includes('video') 
                ? 'Supports JPG, PNG, WebP, MP4, AVI, MOV up to 50MB each'
                : acceptedTypes.includes('video')
                ? 'Supports MP4, AVI, MOV, WMV, FLV up to 50MB each'
                : 'Supports JPG, PNG, WebP up to 5MB each'
              }
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {media.length}/{maxFiles} files selected
            </p>
          </div>
          
          <button
            type="button"
            onClick={openFileDialog}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Browse Files
          </button>
        </div>
      </div>

      {/* Media Previews */}
      {media.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Selected Files ({media.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                {file.type === 'image' ? (
                  <img
                    src={file.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={file.preview}
                    className="w-full h-full object-cover"
                    muted
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                )}
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeMedia(file.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Media Type Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    file.type === 'image' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-purple-500 text-white'
                  }`}>
                    {file.type}
                  </span>
                </div>
                
                {/* File Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="truncate">{file.file.name}</p>
                  <p>{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
