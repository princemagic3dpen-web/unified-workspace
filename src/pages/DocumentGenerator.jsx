import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Sparkles, Save, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function DocumentGenerator() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [targetPages, setTargetPages] = useState(50);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const saveDocument = useMutation({
    mutationFn: (data) => base44.entities.File.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('Document sauvegardé');
    }
  });

  const handleGenerate = async () => {
    if (!title || !subject) {
      toast.error('Titre et sujet requis');
      return;
    }

    setIsGenerating(true);
    setContent('Génération en cours...\n\n');

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Génère un document professionnel complet de ${targetPages} pages minimum.

Titre: ${title}
Sujet: ${subject}

STRUCTURE OBLIGATOIRE (format livre professionnel):

1. PAGE DE GARDE (1 page)
   - Titre principal
   - Sous-titre
   - Auteur
   - Date

2. TABLE DES MATIÈRES (2-3 pages)
   - Liste détaillée de tous les chapitres et sections
   - Numérotation des pages

3. PRÉFACE/AVANT-PROPOS (2 pages)
   - Contexte
   - Objectifs du document
   - Public cible

4. INTRODUCTION (10% du document, ~5 pages)
   - Présentation du sujet
   - Problématique
   - Méthodologie
   - Plan du document

5. DÉVELOPPEMENT (75% du document, ~${Math.floor(targetPages * 0.75)} pages)
   Divisé en 5-8 CHAPITRES MAJEURS:
   
   Chapitre 1: [Titre]
   - Section 1.1: [Détails approfondis]
   - Section 1.2: [Analyses]
   - Section 1.3: [Exemples concrets]
   - Section 1.4: [Études de cas]
   
   [Répéter structure pour chaque chapitre]
   
   IMPORTANT pour chaque chapitre:
   - Minimum 8-12 pages par chapitre
   - Paragraphes détaillés de 200-300 mots
   - Exemples concrets et chiffrés
   - Citations et références
   - Tableaux et listes si pertinent

6. SYNTHÈSE/RECOMMANDATIONS (5 pages)
   - Résumé des points clés
   - Recommandations actionnables
   - Perspectives futures

7. CONCLUSION (10% du document, ~5 pages)
   - Récapitulatif général
   - Réponse à la problématique
   - Ouverture

8. ANNEXES (3-5 pages)
   - Glossaire
   - Bibliographie
   - Ressources complémentaires

STYLE D'ÉCRITURE:
- Professionnel et académique
- Paragraphes structurés et fluides
- Transitions entre sections
- Vocabulaire riche et précis
- Aucun contenu partiel ou "TODO"
- Contenu 100% complet et rédigé

LONGUEUR:
- MINIMUM ${targetPages} pages
- Chaque page = ~500 mots
- Total: ${targetPages * 500} mots minimum

Génère le document COMPLET maintenant, sans raccourcis ni placeholders.`,
        add_context_from_internet: subject.includes('actualité') || subject.includes('recherche')
      });

      setContent(response);
      toast.success(`Document généré (${Math.ceil(response.length / 500)} pages estimées)`);
    } catch (error) {
      toast.error('Erreur lors de la génération');
      setContent('');
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!content || content === 'Génération en cours...\n\n') {
      toast.error('Générez d\'abord le document');
      return;
    }

    await saveDocument.mutateAsync({
      name: `${title}.txt`,
      content: content,
      file_type: 'document',
      mime_type: 'text/plain',
      metadata: {
        target_pages: targetPages,
        word_count: content.split(/\s+/).length,
        estimated_pages: Math.ceil(content.length / 2500)
      }
    });
  };

  const estimatedWords = targetPages * 500;
  const currentWords = content.split(/\s+/).filter(Boolean).length;
  const currentPages = Math.ceil(content.length / 2500);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-300 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-slate-700" />
          <h2 className="font-bold text-slate-900">Générateur de Documents Longs (50-500 pages)</h2>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel */}
        <div className="w-80 border-r border-slate-300 p-4 space-y-4 overflow-y-auto">
          <div>
            <Label>Titre du document</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Guide Complet..."
            />
          </div>

          <div>
            <Label>Sujet</Label>
            <Textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              rows={5}
              placeholder="Décrivez le sujet en détail..."
            />
          </div>

          <div>
            <Label>Nombre de pages cibles</Label>
            <Input
              type="number"
              value={targetPages}
              onChange={(e) => setTargetPages(parseInt(e.target.value) || 50)}
              min="10"
              max="500"
            />
            <p className="text-xs text-slate-600 mt-1">
              ~{estimatedWords.toLocaleString()} mots
            </p>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !title || !subject}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? 'Génération...' : 'Générer Document IA'}
          </Button>

          {content && content !== 'Génération en cours...\n\n' && (
            <>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-900 text-sm mb-2">✓ Document généré</h4>
                <div className="text-xs text-green-800 space-y-1">
                  <div>Mots: {currentWords.toLocaleString()}</div>
                  <div>Pages estimées: {currentPages}</div>
                  <div>Caractères: {content.length.toLocaleString()}</div>
                </div>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-blue-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </>
          )}

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 text-sm mb-2">📖 Structure</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Page de garde</li>
              <li>• Table des matières</li>
              <li>• Préface (2 pages)</li>
              <li>• Introduction (10%)</li>
              <li>• Développement (75%)</li>
              <li>• Synthèse (5 pages)</li>
              <li>• Conclusion (10%)</li>
              <li>• Annexes</li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-slate-300 flex items-center justify-between">
            <div className="text-sm text-slate-700">
              {content && content !== 'Génération en cours...\n\n' ? (
                <span>{currentWords.toLocaleString()} mots | ~{currentPages} pages</span>
              ) : (
                <span>Aucun contenu</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setContent('')}>
                Effacer
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                {content || 'Le document généré apparaîtra ici...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}