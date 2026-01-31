import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Book, Search, Layers, Brain, Zap, Settings, 
  FileText, Image, Video, Music, Code, Database,
  Network, Cpu, Activity, BarChart, Users, Calendar,
  Bot, Sparkles, Calculator, Mic, Eye, Shield,
  GitBranch, Globe, Rocket, ChevronRight
} from 'lucide-react';

export default function OSTableOfContents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const osStructure = {
    'Noyau Central QI ∞': {
      icon: Brain,
      color: 'purple',
      pages: [
        { id: 'os-orchestrator', name: 'Orchestration Globale OS', subpages: ['Paramètres système', 'Logs temps réel', 'Monitoring CPU/RAM'] },
        { id: 'ai-control-center', name: 'Centre Contrôle IA', subpages: ['500+ Modèles LLaMA', '500+ Transformers', 'Formules mathématiques'] },
        { id: 'unlimited-iq-verifier', name: 'Vérificateur QI Illimité', subpages: ['Vérification code', 'Vérification visuels', 'Rapports qualité'] },
        { id: 'mathematical-verifier', name: 'Vérificateur Mathématique', subpages: ['Générateur formules', 'Résolveur équations', 'Optimisation'] }
      ]
    },
    'Intelligence Artificielle': {
      icon: Bot,
      color: 'cyan',
      pages: [
        { id: 'chat', name: 'Assistant IA Minima-X v3.0', subpages: ['Conversations', 'Contexte intelligent', 'Voix neuronale'] },
        { id: 'ai-orchestrator', name: 'Orchestrateur IA', subpages: ['Gestion modèles', 'Parallélisation', 'Load balancing'] },
        { id: 'proactive-agents-creator', name: 'Créateur Agents Proactifs', subpages: ['Entraînement agents', 'Données custom', 'Tâches autonomes'] },
        { id: 'proactive-agents', name: 'Agents IA Proactifs', subpages: ['Liste agents', 'Monitoring', 'Logs actions'] },
        { id: 'ai-tools-hub', name: 'Hub Outils IA (35+)', subpages: ['Outils NLP', 'Outils vision', 'Outils audio'] },
        { id: 'ai-models', name: 'Configuration Modèles IA', subpages: ['HuggingFace', 'Ollama', 'Replicate'] }
      ]
    },
    'Génération Contenu': {
      icon: Sparkles,
      color: 'pink',
      pages: [
        { id: 'media-generator', name: 'Générateur Média IA', subpages: ['Images 4K', 'Vidéos HD', 'Audio pro'] },
        { id: 'image-generator', name: 'Générateur Images 4K', subpages: ['50+ styles', 'Batch generation', 'Inpainting'] },
        { id: 'advanced-image-gen', name: 'Générateur Images Avancé', subpages: ['ControlNet', 'Style transfer', 'Upscaling'] },
        { id: 'video-generator', name: 'Générateur Vidéos IA', subpages: ['Text-to-video', 'Animation', 'Montage auto'] },
        { id: 'music-generator-pro', name: 'Générateur Musique Pro', subpages: ['Paroles IA', 'Styles vocaux', 'Effets sonores'] },
        { id: 'game-world-generator', name: 'Générateur Jeux & Mondes 3D', subpages: ['Terrains', 'Assets', 'Scripts'] },
        { id: 'grok-integration', name: 'Grok xAI Visuels Deluxe', subpages: ['Images Grok', 'Vidéos Grok', 'Collaboration'] }
      ]
    },
    'Documents & Fichiers': {
      icon: FileText,
      color: 'green',
      pages: [
        { id: 'explorer', name: 'Explorateur Fichiers', subpages: ['Navigation', 'Recherche', 'Favoris'] },
        { id: 'text-editor', name: 'Éditeur Texte IA', subpages: ['Markdown', 'Rich text', 'Auto-complétion'] },
        { id: 'pdf-editor', name: 'Éditeur PDF', subpages: ['Annotation', 'Fusion', 'OCR'] },
        { id: 'presentation', name: 'Générateur Présentations', subpages: ['PowerPoint', 'Slides IA', 'Templates'] },
        { id: 'document', name: 'Documents Longs', subpages: ['Romans 500p', 'Rapports', 'Thèses'] },
        { id: 'file-actions', name: 'Actions Fichiers', subpages: ['Batch operations', 'Conversion', 'Compression'] }
      ]
    },
    'Entreprise & Business': {
      icon: Users,
      color: 'blue',
      pages: [
        { id: 'company-management', name: 'Gestion Entreprises', subpages: ['Liste entreprises', 'Projets', 'Employés'] },
        { id: 'business-prep', name: 'Préparation Entreprise', subpages: ['Plans stratégiques', 'Analyses marché', 'Projections'] },
        { id: 'ai-collaboration-hub', name: 'Hub Collaboration IA', subpages: ['Workflows', 'Confirmations', 'Sync équipe'] },
        { id: 'collaboration', name: 'Collaboration Temps Réel', subpages: ['Édition simultanée', 'Chat équipe', 'Résolution conflits'] }
      ]
    },
    'Organisation & Calendrier': {
      icon: Calendar,
      color: 'yellow',
      pages: [
        { id: 'calendar', name: 'Calendrier Événements', subpages: ['Vue mois', 'Rappels', 'Récurrence'] },
        { id: 'window-manager', name: 'Gestionnaire Fenêtres', subpages: ['Multi-fenêtres', 'Layouts', 'Raccourcis'] }
      ]
    },
    'Système & Développement': {
      icon: Code,
      color: 'orange',
      pages: [
        { id: 'system-functions', name: 'Fonctionnalités Système', subpages: ['Liste complète', 'API docs', 'Hooks'] },
        { id: 'ai-development', name: 'Auto-Développement IA', subpages: ['Génération code', 'Tests auto', 'Refactoring'] },
        { id: 'ai-testing', name: 'Tests IA (Romans 500p)', subpages: ['Tests unitaires', 'Tests intégration', 'Benchmark'] },
        { id: 'window-creator', name: 'Créateur Fenêtres Custom', subpages: ['Code editor', 'Preview live', 'Export'] },
        { id: 'auto-bug-detector', name: 'Détecteur Bugs Auto', subpages: ['Scan code', 'Fix suggestions', 'Auto-patch'] },
        { id: 'content-verifiers', name: 'Vérificateurs Contenu', subpages: ['Qualité', 'Performance', 'Sécurité'] }
      ]
    },
    'Paramètres Avancés': {
      icon: Settings,
      color: 'indigo',
      pages: [
        { id: 'advanced-parameters', name: 'Gestionnaire Paramètres', subpages: ['Tous paramètres', 'Profils', 'Import/Export'] },
        { id: 'parameters-diagram', name: 'Diagramme Paramètres 2D', subpages: ['Visualisation', 'Relations', 'Dépendances'] },
        { id: 'voice-system-control', name: 'Contrôle Système Vocal', subpages: ['Micro/sortie', 'Reconnaissance', 'Synthèse'] },
        { id: 'voice-commands', name: 'Commandes Vocales (5000+)', subpages: ['Liste complète', 'Personnalisation', 'Macros'] }
      ]
    }
  };

  const allPages = Object.entries(osStructure).flatMap(([category, data]) =>
    data.pages.map(page => ({ ...page, category, categoryColor: data.color }))
  );

  const filteredPages = searchTerm
    ? allPages.filter(page =>
        page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allPages;

  const getColorClasses = (color) => ({
    bg: `bg-${color}-600`,
    border: `border-${color}-500`,
    text: `text-${color}-400`,
    hover: `hover:bg-${color}-700`
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
          <Book className="w-10 h-10 text-indigo-400" />
          Table des Matières OS - QI Illimité × 10⁹⁹
        </h1>
        <p className="text-slate-300 text-xl">
          Navigation complète • {allPages.length} pages • {Object.keys(osStructure).length} catégories • Sous-pages illimitées
        </p>
      </div>

      {/* Recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une page, fenêtre, fonctionnalité..."
            className="pl-14 h-14 text-lg bg-slate-800/50 border-slate-700 text-white"
          />
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Pages Totales</p>
            <p className="text-3xl font-bold text-purple-400">{allPages.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Catégories</p>
            <p className="text-3xl font-bold text-cyan-400">{Object.keys(osStructure).length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Sous-Pages</p>
            <p className="text-3xl font-bold text-green-400">
              {allPages.reduce((acc, p) => acc + (p.subpages?.length || 0), 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">QI Niveau</p>
            <p className="text-3xl font-bold text-yellow-400">∞</p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu */}
      <ScrollArea className="flex-1">
        {searchTerm ? (
          <div className="space-y-3">
            {filteredPages.map((page) => (
              <Card key={page.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`bg-${page.categoryColor}-600 text-white text-xs`}>
                          {page.category}
                        </Badge>
                        <h3 className="text-lg font-semibold text-white">{page.name}</h3>
                      </div>
                      {page.subpages && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {page.subpages.map((sub, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(osStructure).map(([category, data]) => {
              const Icon = data.icon;
              const isExpanded = expandedCategory === category;
              
              return (
                <Card key={category} className="bg-slate-800/50 border-slate-700">
                  <CardHeader
                    className="cursor-pointer hover:bg-slate-800/70 transition-all"
                    onClick={() => setExpandedCategory(isExpanded ? null : category)}
                  >
                    <CardTitle className="flex items-center justify-between text-white text-xl">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-7 h-7 text-${data.color}-400`} />
                        {category}
                        <Badge className={`bg-${data.color}-600 text-white`}>
                          {data.pages.length} pages
                        </Badge>
                      </div>
                      <ChevronRight className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="space-y-3">
                      {data.pages.map((page) => (
                        <div
                          key={page.id}
                          className="p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-all cursor-pointer border border-slate-700"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg font-semibold text-white">{page.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              ID: {page.id}
                            </Badge>
                          </div>
                          
                          {page.subpages && (
                            <div>
                              <p className="text-sm text-slate-400 mb-2">
                                Sous-pages disponibles ({page.subpages.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {page.subpages.map((sub, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className={`border-${data.color}-500 text-${data.color}-400 hover:bg-${data.color}-600 hover:text-white transition-all cursor-pointer text-xs`}
                                  >
                                    {sub}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl border border-purple-700">
        <p className="text-center text-lg text-white">
          🧠 QI Illimité × 10⁹⁹ • 🌐 Connecté Internet • 🤖 500+ LLaMA + 500+ Transformers • ∞ Mémoire Illimitée
        </p>
      </div>
    </div>
  );
}