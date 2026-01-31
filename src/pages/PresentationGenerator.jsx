import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Presentation, Sparkles, Plus, Trash2, Save, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export default function PresentationGenerator() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [audience, setAudience] = useState('executive');
  const [slides, setSlides] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const createPresentation = useMutation({
    mutationFn: (data) => base44.entities.Presentation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presentations'] });
      toast.success('Présentation créée');
    }
  });

  const handleGenerate = async () => {
    if (!title || !subject) {
      toast.error('Titre et sujet requis');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Génère une présentation PowerPoint professionnelle complète.

Titre: ${title}
Sujet: ${subject}
Audience: ${audience}

Instructions CRITIQUES:
1. Crée exactement 20-30 slides
2. Structure:
   - Slide 1: Titre accrocheur
   - Slides 2-3: Introduction/Contexte
   - Slides 4-N-2: Développement détaillé
   - Slide N-1: Synthèse
   - Slide N: Conclusion + Call-to-Action

3. Pour CHAQUE slide, génère:
   - Titre court et impactant (max 8 mots)
   - 3-5 points clés (bullets courts)
   - Type de visuel recommandé (chart, diagram, image, infographic)
   - Description du visuel à générer
   - Notes orateur détaillées

4. Adapte le style selon l'audience:
   - Executive: minimaliste, chiffres clés, ROI
   - Technique: détaillé, architecture, specs
   - Commercial: dynamique, bénéfices, témoignages
   - Académique: rigoureux, méthodologie, sources
   - Grand public: accessible, simple, analogies

5. Génère au format JSON strictement:
{
  "slides": [
    {
      "slide_number": 1,
      "title": "...",
      "bullet_points": ["...", "..."],
      "visual_type": "chart|diagram|image|infographic|none",
      "visual_description": "...",
      "speaker_notes": "..."
    }
  ]
}

Réponds UNIQUEMENT avec le JSON valide, rien d'autre.`,
        add_context_from_internet: subject.includes('actualité') || subject.includes('2024') || subject.includes('2025'),
        response_json_schema: {
          type: "object",
          properties: {
            slides: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  slide_number: { type: "integer" },
                  title: { type: "string" },
                  bullet_points: { type: "array", items: { type: "string" } },
                  visual_type: { type: "string" },
                  visual_description: { type: "string" },
                  speaker_notes: { type: "string" }
                }
              }
            }
          }
        }
      });

      setSlides(response.slides || []);
      toast.success(`${response.slides?.length || 0} slides générées`);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la génération');
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (slides.length === 0) {
      toast.error('Générez d\'abord des slides');
      return;
    }

    await createPresentation.mutateAsync({
      title,
      subject,
      audience_type: audience,
      total_slides: slides.length,
      slides: slides,
      version: 1,
      status: 'draft',
      quality_scores: {
        structure: 85,
        visuals: 80,
        clarity: 90,
        overall: 85
      }
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-300 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <Presentation className="w-5 h-5 text-slate-700" />
          <h2 className="font-bold text-slate-900">Générateur de Présentations PowerPoint IA</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {slides.length === 0 ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <Label>Titre de la présentation</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Stratégie Marketing 2025"
              />
            </div>

            <div>
              <Label>Sujet détaillé</Label>
              <Textarea
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                rows={4}
                placeholder="Décrivez le sujet en détail: objectifs, points clés à couvrir, contexte..."
              />
            </div>

            <div>
              <Label>Audience cible</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executives (C-Level, décideurs)</SelectItem>
                  <SelectItem value="technique">Technique (développeurs, ingénieurs)</SelectItem>
                  <SelectItem value="commercial">Commercial (ventes, marketing)</SelectItem>
                  <SelectItem value="academique">Académique (chercheurs, étudiants)</SelectItem>
                  <SelectItem value="grand_public">Grand Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !title || !subject}
              className="w-full bg-purple-600 hover:bg-purple-700 h-12"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isGenerating ? 'Génération en cours (20-30 slides)...' : 'Générer Présentation Complète avec IA'}
            </Button>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">✨ Fonctionnalités IA</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 20-30 slides complètes générées automatiquement</li>
                <li>• Visuels recommandés (charts, diagrammes, infographies)</li>
                <li>• Adaptation style selon audience</li>
                <li>• Notes orateur détaillées</li>
                <li>• Structure professionnelle optimisée</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {slides.length} slides générées
              </h3>
              <Button onClick={handleSave} className="bg-blue-600">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder Présentation
              </Button>
            </div>

            {slides.map((slide, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg border-2 border-slate-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold">
                    {slide.slide_number}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-900 mb-2">{slide.title}</h4>
                    <ul className="list-disc list-inside space-y-1 mb-3">
                      {slide.bullet_points?.map((point, i) => (
                        <li key={i} className="text-sm text-slate-700">{point}</li>
                      ))}
                    </ul>
                    {slide.visual_type && slide.visual_type !== 'none' && (
                      <div className="p-3 bg-white rounded border border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">
                            Visuel: {slide.visual_type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{slide.visual_description}</p>
                      </div>
                    )}
                    {slide.speaker_notes && (
                      <details className="mt-2">
                        <summary className="text-sm font-medium text-slate-700 cursor-pointer">
                          Notes orateur
                        </summary>
                        <p className="text-sm text-slate-600 mt-2 pl-4 border-l-2 border-slate-300">
                          {slide.speaker_notes}
                        </p>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={() => setSlides([])}
              variant="outline"
              className="w-full"
            >
              Nouvelle Présentation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}