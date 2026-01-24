import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  File, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function FileUploadModal({ 
  isOpen, 
  onClose, 
  onUploadComplete, 
  currentFolderId,
  currentEventId 
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const fileObjects = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: getFileType(file.type),
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...fileObjects]);
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
    if (mimeType.startsWith('text/')) return 'text';
    return 'other';
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const uploadFiles = async () => {
    setUploading(true);

    for (const fileObj of files) {
      if (fileObj.status !== 'pending') continue;

      try {
        setUploadProgress(prev => ({ ...prev, [fileObj.id]: 0 }));
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileObj.id]: Math.min((prev[fileObj.id] || 0) + 10, 90)
          }));
        }, 200);

        // Upload file
        const { file_url } = await base44.integrations.Core.UploadFile({
          file: fileObj.file
        });

        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [fileObj.id]: 100 }));

        // Create file record
        await base44.entities.File.create({
          name: fileObj.name,
          file_url,
          file_type: fileObj.type,
          mime_type: fileObj.file.type,
          size: fileObj.size,
          folder_id: currentFolderId || null,
          event_id: currentEventId || null
        });

        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'success' } : f
        ));
      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error' } : f
        ));
      }
    }

    setUploading(false);
    onUploadComplete?.();
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const successCount = files.filter(f => f.status === 'success').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            Importer des fichiers
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`
              border-2 border-dashed rounded-2xl p-8 text-center transition-all
              ${dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }
            `}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="p-4 rounded-2xl bg-slate-100 w-fit mx-auto mb-4">
                <Upload className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-lg font-medium text-slate-700">
                Glissez-déposez vos fichiers ici
              </p>
              <p className="text-sm text-slate-500 mt-1">
                ou cliquez pour sélectionner
              </p>
            </label>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-auto">
              <AnimatePresence>
                {files.map(fileObj => (
                  <motion.div
                    key={fileObj.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <File className="w-4 h-4 text-slate-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {fileObj.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatSize(fileObj.size)}
                      </p>
                      
                      {uploadProgress[fileObj.id] !== undefined && fileObj.status === 'pending' && (
                        <Progress 
                          value={uploadProgress[fileObj.id]} 
                          className="h-1 mt-2" 
                        />
                      )}
                    </div>

                    {fileObj.status === 'pending' && !uploading && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(fileObj.id)}
                        className="h-8 w-8 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {fileObj.status === 'pending' && uploading && (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    
                    {fileObj.status === 'success' && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    
                    {fileObj.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              {files.length > 0 && (
                <>
                  {pendingCount} en attente
                  {successCount > 0 && ` • ${successCount} importé${successCount > 1 ? 's' : ''}`}
                </>
              )}
            </p>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="rounded-xl">
                {successCount === files.length && files.length > 0 ? 'Fermer' : 'Annuler'}
              </Button>
              {pendingCount > 0 && (
                <Button
                  onClick={uploadFiles}
                  disabled={uploading}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Importer {pendingCount} fichier{pendingCount > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}