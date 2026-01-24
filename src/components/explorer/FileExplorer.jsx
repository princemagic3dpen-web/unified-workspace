import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown,
  Plus,
  Upload,
  FolderPlus,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Move,
  Star,
  StarOff,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  Presentation,
  FileCode
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const FILE_ICONS = {
  document: FileText,
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  spreadsheet: FileSpreadsheet,
  presentation: Presentation,
  pdf: FileText,
  text: FileText,
  other: File
};

export default function FileExplorer({
  folders = [],
  files = [],
  currentFolderId,
  onFolderClick,
  onFileClick,
  onCreateFolder,
  onUploadFile,
  onRename,
  onDelete,
  onMove,
  onToggleFavorite,
  onDrop
}) {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [dragOverId, setDragOverId] = useState(null);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const startRename = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const finishRename = (id, type) => {
    if (editName.trim()) {
      onRename(id, editName.trim(), type);
    }
    setEditingId(null);
    setEditName('');
  };

  const handleDragStart = (e, item, type) => {
    e.dataTransfer.setData('itemId', item.id);
    e.dataTransfer.setData('itemType', type);
  };

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    setDragOverId(folderId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e, targetFolderId) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const itemType = e.dataTransfer.getData('itemType');
    
    if (itemId && onDrop) {
      onDrop(itemId, itemType, targetFolderId);
    }
    setDragOverId(null);
  };

  const currentFolderFiles = files.filter(f => f.folder_id === currentFolderId);
  const currentSubFolders = folders.filter(f => f.parent_id === currentFolderId);

  const FileIcon = ({ type }) => {
    const Icon = FILE_ICONS[type] || FILE_ICONS.other;
    return <Icon className="w-5 h-5" />;
  };

  const renderFolder = (folder, depth = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const subFolders = folders.filter(f => f.parent_id === folder.id);
    const folderFiles = files.filter(f => f.folder_id === folder.id);
    const isSelected = currentFolderId === folder.id;
    const isDragOver = dragOverId === folder.id;

    return (
      <div key={folder.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer
                transition-all duration-200 group
                ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}
                ${isDragOver ? 'ring-2 ring-blue-400 bg-blue-900/30' : ''}
              `}
              style={{ paddingLeft: `${depth * 16 + 12}px` }}
              onClick={() => {
                onFolderClick(folder.id);
                if (subFolders.length > 0) toggleFolder(folder.id);
              }}
              onDragOver={(e) => handleDragOver(e, folder.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, folder.id)}
              draggable
              onDragStart={(e) => handleDragStart(e, folder, 'folder')}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                className="w-4 h-4 flex-shrink-0"
              >
                {(subFolders.length > 0 || folderFiles.length > 0) && (
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                )}
              </motion.div>
              
              <div 
                className="p-1.5 rounded-lg flex-shrink-0"
                style={{ backgroundColor: folder.color + '30' }}
              >
                <Folder className="w-4 h-4" style={{ color: isSelected ? '#ffffff' : folder.color || '#3b82f6' }} />
              </div>
              
              {editingId === folder.id ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => finishRename(folder.id, 'folder')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') finishRename(folder.id, 'folder');
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="h-6 py-0 px-1 text-sm bg-slate-700 border-slate-600 text-white"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className={`text-sm font-medium truncate flex-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {folder.name}
                </span>
              )}

              {folder.is_favorite && (
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0 ${isSelected ? 'text-white hover:bg-white/20' : 'text-slate-400 hover:bg-slate-600'}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => startRename(folder.id, folder.name)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Renommer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleFavorite(folder.id, 'folder')}>
                    {folder.is_favorite ? (
                      <>
                        <StarOff className="w-4 h-4 mr-2" />
                        Retirer des favoris
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Ajouter aux favoris
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(folder.id, 'folder')}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </ContextMenuTrigger>
          
          <ContextMenuContent className="rounded-xl">
            <ContextMenuItem onClick={() => onCreateFolder(folder.id)}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Nouveau sous-dossier
            </ContextMenuItem>
            <ContextMenuItem onClick={() => startRename(folder.id, folder.name)}>
              <Edit className="w-4 h-4 mr-2" />
              Renommer
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onClick={() => onDelete(folder.id, 'folder')}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {subFolders.map(sub => renderFolder(sub, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderFile = (file) => {
    const FileIconComponent = FILE_ICONS[file.file_type] || FILE_ICONS.other;

    return (
      <ContextMenu key={file.id}>
        <ContextMenuTrigger>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer group"
            onClick={() => onFileClick(file)}
            draggable
            onDragStart={(e) => handleDragStart(e, file, 'file')}
          >
            <div className="p-2 rounded-xl bg-slate-700 group-hover:bg-blue-600 transition-colors">
              <FileIconComponent className="w-5 h-5 text-slate-400 group-hover:text-white" />
            </div>
            
            {editingId === file.id ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => finishRename(file.id, 'file')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') finishRename(file.id, 'file');
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="flex-1 h-7 bg-slate-700 border-slate-600 text-white"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                {file.size && (
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
            )}

            {file.is_favorite && (
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 flex-shrink-0 text-slate-400 hover:text-white hover:bg-slate-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => onFileClick(file)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Ouvrir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => startRename(file.id, file.name)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Renommer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFavorite(file.id, 'file')}>
                  {file.is_favorite ? (
                    <>
                      <StarOff className="w-4 h-4 mr-2" />
                      Retirer des favoris
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Ajouter aux favoris
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(file.id, 'file')}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="rounded-xl">
          <ContextMenuItem onClick={() => onFileClick(file)}>
            <FileText className="w-4 h-4 mr-2" />
            Ouvrir
          </ContextMenuItem>
          <ContextMenuItem onClick={() => startRename(file.id, file.name)}>
            <Edit className="w-4 h-4 mr-2" />
            Renommer
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            onClick={() => onDelete(file.id, 'file')}
            className="text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const rootFolders = folders.filter(f => !f.parent_id);

  return (
    <div className="h-full flex bg-slate-900 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
      {/* Left Sidebar - Folder Tree */}
      <div className="w-80 flex flex-col border-r border-slate-700 bg-slate-800/50">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Dossiers</h2>
              <p className="text-xs text-slate-400">
                {folders.length} dossiers
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateFolder(currentFolderId)}
            className="w-full rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Nouveau dossier
          </Button>
        </div>

        {/* Folder tree */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {rootFolders.map(folder => renderFolder(folder))}
          </div>
          
          {folders.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="p-4 rounded-2xl bg-slate-700/50 mb-4">
                <Folder className="w-12 h-12 text-slate-500" />
              </div>
              <p className="text-slate-400 mb-2">Aucun dossier</p>
              <p className="text-sm text-slate-500">
                Créez votre premier dossier
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Content - Files */}
      <div className="flex-1 flex flex-col bg-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                {currentFolderId 
                  ? folders.find(f => f.id === currentFolderId)?.name || 'Fichiers'
                  : 'Tous les fichiers'
                }
              </h2>
              <p className="text-sm text-slate-400">
                {currentFolderFiles.length} fichier{currentFolderFiles.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <Button
              size="sm"
              onClick={onUploadFile}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer fichiers
            </Button>
          </div>
        </div>

        {/* Files grid */}
        <ScrollArea className="flex-1 p-4">
          {currentFolderFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentFolderFiles.map(file => renderFile(file))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="p-6 rounded-2xl bg-slate-800/50 mb-4">
                <File className="w-16 h-16 text-slate-600" />
              </div>
              <p className="text-slate-300 text-lg mb-2">Aucun fichier</p>
              <p className="text-sm text-slate-500 mb-4">
                Importez des fichiers ou demandez à l'IA d'en créer
              </p>
              <Button
                variant="outline"
                onClick={onUploadFile}
                className="rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importer des fichiers
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}