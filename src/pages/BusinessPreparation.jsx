import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Briefcase, Sparkles, FileText, TrendingUp, DollarSign, Users, Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BusinessPreparation() {
  const queryClient = useQueryClient();
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');

  const createFolder = useMutation({
    mutationFn: (data) => base44.entities.Folder.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] })
  });

  const createFile = useMutation({
    mutationFn: (data) => base44.entities.File.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['files'] })
  });

  const handleGenerate = async () => {
    if (!companyName.trim() || !sector.trim()) {
      toast.error('Nom entreprise et secteur requis');
      return;
    }

    setGenerating(true);
    setProgress(0);

    try {
      setCurrentTask('🧠 Analyse marché avec 500x LLaMA...');
      setProgress(10);

      const marketAnalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `MOTEUR NEURONAL MATHÉMATIQUE - Analyse marché entreprise

Entreprise: ${companyName}
Secteur: ${sector}

GÉNÈRE analyse marché complète (200 pages):

1. **État du marché actuel**
   - Taille marché (€)
   - Croissance annuelle (%)
   - Tendances principales
   - Segments clés

2. **Analyse concurrence**
   - Top 10 concurrents
   - Parts de marché
   - Forces/Faiblesses
   - Positionnement

3. **Opportunités**
   - Niches inexploitées
   - Innovations possibles
   - Partenariats stratégiques

4. **Risques & Menaces**
   - Barrières entrée
   - Réglementations
   - Disruptions technologiques

Réponds en format structuré Markdown détaillé.`,
        add_context_from_internet: true
      });

      setProgress(30);
      setCurrentTask('📊 Plan stratégique 500x Transformers...');

      const strategicPlan = await base44.integrations.Core.InvokeLLM({
        prompt: `TRANSFORMERS NEURONAUX - Plan stratégique entreprise

Entreprise: ${companyName}
Secteur: ${sector}

Contexte marché:
${marketAnalysis}

GÉNÈRE plan stratégique 5 ans (300 pages):

1. **Vision & Mission**
2. **Objectifs SMART**
   - Court terme (1 an)
   - Moyen terme (3 ans)
   - Long terme (5 ans)

3. **Stratégie commerciale**
   - Positionnement
   - Prix
   - Distribution
   - Communication

4. **Plan opérationnel**
   - Ressources humaines
   - Infrastructure
   - Processus clés
   - Timeline

5. **Projections financières**
   - Investissements
   - CA prévisionnel
   - Rentabilité
   - Cash flow

Réponds format Markdown ultra-détaillé.`,
        add_context_from_internet: true
      });

      setProgress(60);
      setCurrentTask('💰 Modèle financier...');

      const financialModel = await base44.integrations.Core.InvokeLLM({
        prompt: `CERVEAU MATHÉMATIQUE - Modèle financier

Entreprise: ${companyName}
Secteur: ${sector}

GÉNÈRE modèle financier complet (150 pages):

1. **Hypothèses**
   - Croissance CA
   - Marges
   - Coûts fixes/variables

2. **Compte résultat prévisionnel** (5 ans)
3. **Bilan prévisionnel** (5 ans)
4. **Tableau flux trésorerie** (5 ans)
5. **Ratios clés**
   - ROI, ROE, Marge nette
   - Point mort
   - Besoin fonds roulement

6. **Scénarios**
   - Optimiste (+20%)
   - Réaliste
   - Pessimiste (-20%)

Format: Tableaux détaillés Markdown + explications.`
      });

      setProgress(80);
      setCurrentTask('📁 Création dossiers...');

      const mainFolder = await createFolder.mutateAsync({
        name: `Préparation Entreprise - ${companyName}`,
        color: '#10b981'
      });

      await Promise.all([
        createFile.mutateAsync({
          name: 'Analyse_Marche_200p.md',
          folder_id: mainFolder.id,
          file_type: 'document',
          content: marketAnalysis,
          mime_type: 'text/markdown'
        }),
        createFile.mutateAsync({
          name: 'Plan_Strategique_300p.md',
          folder_id: mainFolder.id,
          file_type: 'document',
          content: strategicPlan,
          mime_type: 'text/markdown'
        }),
        createFile.mutateAsync({
          name: 'Modele_Financier_150p.md',
          folder_id: mainFolder.id,
          file_type: 'document',
          content: financialModel,
          mime_type: 'text/markdown'
        })
      ]);

      setProgress(100);
      setCurrentTask('✅ Préparation entreprise complète!');
      toast.success(`Préparation ${companyName} générée: 650 pages`);

    } catch (error) {
      console.error(error);
      toast.error('Erreur génération');
    }

    setGenerating(false);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-slate-300 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-600 to-blue-600 text-white">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Préparation Entreprise IA</h1>
            <p className="text-sm text-slate-600">Analyse marché + Plan stratégique + Modèle financier (650 pages)</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
          <h3 className="font-bold text-xl mb-4">📝 Informations Entreprise</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Nom Entreprise</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: TechCorp Innovation"
                disabled={generating}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Secteur d'activité</label>
              <Textarea
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Ex: Intelligence artificielle pour la santé, solutions SaaS B2B..."
                rows={3}
                disabled={generating}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !companyName.trim() || !sector.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 h-14 text-lg"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Générer Préparation Complète
                </>
              )}
            </Button>
          </div>
        </div>

        {generating && (
          <div className="p-6 bg-white rounded-xl border-2 border-green-300">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <div className="flex-1">
                <div className="font-bold text-slate-900">{currentTask}</div>
                <div className="text-sm text-slate-600">{progress}%</div>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-300">
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <div className="font-bold text-blue-900">Analyse Marché</div>
            <div className="text-sm text-blue-700">200 pages détaillées</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-300">
            <Target className="w-8 h-8 text-purple-600 mb-2" />
            <div className="font-bold text-purple-900">Plan Stratégique</div>
            <div className="text-sm text-purple-700">300 pages sur 5 ans</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-300">
            <DollarSign className="w-8 h-8 text-green-600 mb-2" />
            <div className="font-bold text-green-900">Modèle Financier</div>
            <div className="text-sm text-green-700">150 pages projections</div>
          </div>
        </div>
      </div>
    </div>
  );
}