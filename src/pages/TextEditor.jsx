import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Save, Sparkles, Type, Bold, Italic, List, AlignLeft,
  AlignCenter, AlignRight, Undo, Redo, Download
} from 'lucide-react';
import { toast } from 'sonner';

export default function TextEditor({ file = null }) {
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState(file?.name || 'nouveau-document.txt');
  const [content, setContent] = useState(file?.content || '');
  const [aiLoading, setAiLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (file) {
      setFileName(file.name);
      setContent(file.content || '');
    }
  }, [file]);

  const saveFile = useMutation({
    mutationFn: (data) => file 
      ? base44.entities.File.update(file.id, data)
      : base44.entities.File.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('Document sauvegardé');
    }
  });

  const handleSave = async () => {
    const data = {
      name: fileName,
      content: content,
      file_type: 'text',
      mime_type: 'text/plain'
    };
    await saveFile.mutateAsync(data);
  };

  const handleAIEnhance = async () => {
    if (!content.trim()) {
      toast.error('Aucun contenu à améliorer');
      return;
    }

    setAiLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Améliore ce texte en le rendant plus professionnel, structuré et détaillé. Ajoute des transitions, améliore le vocabulaire, structure en paragraphes clairs.

Texte original:
${content}

Instructions:
- Garde le sens original
- Améliore la structure et la clarté
- Ajoute des transitions fluides
- Vocabulaire plus riche et précis
- Format professionnel

Retourne UNIQUEMENT le texte amélioré, sans commentaires.`,
        add_context_from_internet: false
      });

      setContent(response);
      addToHistory(response);
      toast.success('Texte amélioré par IA');
    } catch (error) {
      toast.error('Erreur lors de l\'amélioration IA');
    }
    setAiLoading(false);
  };

  const addToHistory = (newContent) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="p-3 border-b border-slate-300 bg-slate-50">
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-5 h-5 text-slate-700" />
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="flex-1 h-8"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" onClick={handleSave} className="bg-blue-600">
            <Save className="w-4 h-4 mr-1" />
            Sauvegarder
          </Button>
          
          <Button size="sm" variant="outline" onClick={handleAIEnhance} disabled={aiLoading}>
            <Sparkles className="w-4 h-4 mr-1" />
            {aiLoading ? 'Amélioration...' : 'Améliorer avec IA'}
          </Button>

          <div className="h-6 w-px bg-slate-300 mx-1" />

          <Button size="sm" variant="ghost" onClick={handleUndo} disabled={historyIndex <= 0}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
            <Redo className="w-4 h-4" />
          </Button>

          <div className="h-6 w-px bg-slate-300 mx-1" />

          <Button size="sm" variant="ghost">
            <Bold className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Italic className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <List className="w-4 h-4" />
          </Button>

          <div className="h-6 w-px bg-slate-300 mx-1" />

          <Button size="sm" variant="ghost">
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <AlignRight className="w-4 h-4" />
          </Button>

          <div className="flex-1" />

          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />
            Télécharger
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (e.target.value !== content) {
              addToHistory(e.target.value);
            }
          }}
          className="w-full h-full p-6 focus:outline-none resize-none font-mono text-sm"
          placeholder="Commencez à écrire ou demandez à l'IA d'améliorer votre texte..."
          style={{ lineHeight: '1.6' }}
        />
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-300 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
        <div>
          {content.length} caractères | {content.split(/\s+/).filter(Boolean).length} mots
        </div>
        <div>
          {file ? 'Modification' : 'Nouveau document'}
        </div>
      </div>
    </div>
  );
}