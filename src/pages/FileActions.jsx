import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FolderPlus, FilePlus, FileText, FileImage, FileCode, 
  Copy, Scissors, Trash2, Edit, FolderOpen, File
} from 'lucide-react';
import { toast } from 'sonner';

export default function FileActions() {
  const queryClient = useQueryClient();
  const [actionType, setActionType] = useState('create');
  const [fileType, setFileType] = useState('text');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);

  const { data: folders = [] } = useQuery({
    queryKey: ['folders'],
    queryFn: () => base44.entities.Folder.list('name'),
    initialData: []
  });

  const { data: files = [] } = useQuery({
    queryKey: ['files'],
    queryFn: () => base44.entities.File.list('-created_date'),
    initialData: []
  });

  const createFile = useMutation({
    mutationFn: (data) => base44.entities.File.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('Fichier créé');
      setFileName('');
      setFileContent('');
    }
  });

  const createFolder = useMutation({
    mutationFn: (data) => base44.entities.Folder.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast.success('Dossier créé');
      setFileName('');
    }
  });

  const handleCreateFile = async () => {
    if (!fileName) {
      toast.error('Nom de fichier requis');
      return;
    }

    const fileData = {
      name: fileName,
      file_type: fileType,
      content: fileContent,
      folder_id: selectedFolder,
      mime_type: {
        text: 'text/plain',
        document: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        pdf: 'application/pdf',
        image: 'image/png',
        code: 'text/plain'
      }[fileType]
    };

    await createFile.mutateAsync(fileData);
  };

  const handleCreateFolder = async () => {
    if (!fileName) {
      toast.error('Nom de dossier requis');
      return;
    }

    await createFolder.mutateAsync({
      name: fileName,
      parent_id: selectedFolder,
      color: '#3b82f6'
    });
  };

  const actions = [
    { id: 'create', label: 'Créer', icon: FilePlus, color: 'bg-blue-600' },
    { id: 'copy', label: 'Copier', icon: Copy, color: 'bg-green-600' },
    { id: 'cut', label: 'Couper', icon: Scissors, color: 'bg-orange-600' },
    { id: 'rename', label: 'Renommer', icon: Edit, color: 'bg-purple-600' },
    { id: 'delete', label: 'Supprimer', icon: Trash2, color: 'bg-red-600' }
  ];

  const fileTypes = [
    { id: 'text', label: 'Texte (.txt)', icon: FileText },
    { id: 'document', label: 'Document (.docx)', icon: FileText },
    { id: 'pdf', label: 'PDF', icon: File },
    { id: 'image', label: 'Image (.png)', icon: FileImage },
    { id: 'code', label: 'Code (.js/.py)', icon: FileCode }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-slate-300">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Actions sur Fichiers & Dossiers</h1>
        <p className="text-sm text-slate-600">Créer, copier, couper, renommer, supprimer</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Action Selection */}
        <div>
          <h3 className="font-bold text-slate-900 mb-3">Type d'action</h3>
          <div className="grid grid-cols-5 gap-3">
            {actions.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => setActionType(action.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    actionType === action.id
                      ? `${action.color} text-white border-transparent`
                      : 'border-slate-300 hover:border-slate-400 text-slate-700'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{action.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Create Actions */}
        {actionType === 'create' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Type de création</h3>
              <div className="flex gap-3 mb-4">
                <Button
                  variant={fileType === 'folder' ? 'default' : 'outline'}
                  onClick={() => setFileType('folder')}
                  className="flex-1"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Nouveau Dossier
                </Button>
                <Button
                  variant={fileType !== 'folder' ? 'default' : 'outline'}
                  onClick={() => setFileType('text')}
                  className="flex-1"
                >
                  <FilePlus className="w-4 h-4 mr-2" />
                  Nouveau Fichier
                </Button>
              </div>

              {fileType !== 'folder' && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {fileTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFileType(type.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          fileType === type.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1 text-slate-700" />
                        <div className="text-xs font-medium text-slate-700">{type.label}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {fileType === 'folder' ? 'Nom du dossier' : 'Nom du fichier'}
              </label>
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder={fileType === 'folder' ? 'Mon Dossier' : 'mon-fichier.txt'}
                className="mb-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Dossier parent (optionnel)
              </label>
              <Select value={selectedFolder || 'root'} onValueChange={(v) => setSelectedFolder(v === 'root' ? null : v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Racine</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {fileType !== 'folder' && fileType !== 'image' && (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Contenu du fichier
                </label>
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  rows={10}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Écrivez le contenu ici..."
                />
              </div>
            )}

            <Button
              onClick={fileType === 'folder' ? handleCreateFolder : handleCreateFile}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!fileName}
            >
              {fileType === 'folder' ? <FolderPlus className="w-4 h-4 mr-2" /> : <FilePlus className="w-4 h-4 mr-2" />}
              {fileType === 'folder' ? 'Créer le dossier' : 'Créer le fichier'}
            </Button>
          </div>
        )}

        {/* Other Actions */}
        {actionType !== 'create' && (
          <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-300 text-center">
            <p className="text-slate-600">
              Sélectionnez des fichiers/dossiers dans l'Explorateur pour les {actionType === 'copy' ? 'copier' : actionType === 'cut' ? 'couper' : actionType === 'rename' ? 'renommer' : 'supprimer'}.
            </p>
          </div>
        )}

        {/* Recent Files */}
        <div>
          <h3 className="font-bold text-slate-900 mb-3">Fichiers récents ({files.length})</h3>
          <div className="space-y-2">
            {files.slice(0, 10).map(file => (
              <div key={file.id} className="p-3 bg-slate-50 rounded-lg border border-slate-300 flex items-center gap-3">
                <File className="w-5 h-5 text-slate-600" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate">{file.name}</div>
                  <div className="text-xs text-slate-600">{file.file_type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}