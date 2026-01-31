import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Trash2, Save, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFEditor() {
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState('document.pdf');
  const [pages, setPages] = useState([
    { id: 1, title: 'Page 1', content: '' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const createPDF = useMutation({
    mutationFn: (data) => base44.entities.File.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('PDF créé');
    }
  });

  const addPage = () => {
    setPages([...pages, { 
      id: pages.length + 1, 
      title: `Page ${pages.length + 1}`, 
      content: '' 
    }]);
  };

  const removePage = (id) => {
    if (pages.length === 1) {
      toast.error('Impossible de supprimer la dernière page');
      return;
    }
    setPages(pages.filter(p => p.id !== id));
  };

  const updatePageContent = (id, content) => {
    setPages(pages.map(p => p.id === id ? { ...p, content } : p));
  };

  const handleAIGenerate = async (pageId) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    setAiLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Génère un contenu professionnel et structuré pour une page PDF sur le sujet: "${page.title}"

Instructions:
- Format professionnel adapté pour PDF
- Structure claire avec titres et paragraphes
- Contenu détaillé et informatif
- Style formel et précis
- Entre 300-500 mots

Génère uniquement le contenu, pas de commentaires.`,
        add_context_from_internet: false
      });

      updatePageContent(pageId, response);
      toast.success('Contenu généré par IA');
    } catch (error) {
      toast.error('Erreur génération IA');
    }
    setAiLoading(false);
  };

  const handleSave = async () => {
    const content = pages.map(p => 
      `=== ${p.title} ===\n\n${p.content}`
    ).join('\n\n\n');

    await createPDF.mutateAsync({
      name: fileName,
      content: content,
      file_type: 'pdf',
      mime_type: 'application/pdf'
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-300 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-slate-700" />
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="flex-1 h-8"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="bg-blue-600">
            <Save className="w-4 h-4 mr-1" />
            Sauvegarder PDF
          </Button>
          <Button size="sm" variant="outline" onClick={addPage}>
            <Plus className="w-4 h-4 mr-1" />
            Nouvelle page
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {pages.map((page, idx) => (
          <div key={page.id} className="border-2 border-slate-300 rounded-lg overflow-hidden">
            <div className="p-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
              <Input
                value={page.title}
                onChange={(e) => setPages(pages.map(p => 
                  p.id === page.id ? { ...p, title: e.target.value } : p
                ))}
                className="flex-1 h-7 font-bold"
              />
              <div className="flex gap-2 ml-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAIGenerate(page.id)}
                  disabled={aiLoading}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  IA
                </Button>
                {pages.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removePage(page.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            <textarea
              value={page.content}
              onChange={(e) => updatePageContent(page.id, e.target.value)}
              rows={8}
              className="w-full p-4 focus:outline-none resize-none"
              placeholder="Contenu de la page... (Ctrl+Alt+G pour générer avec IA)"
            />
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-slate-300 bg-slate-50 text-xs text-slate-600 text-center">
        {pages.length} pages | Document PDF professionnel
      </div>
    </div>
  );
}