import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  FileText,
  Image,
  Video,
  Code,
  Database,
  Workflow,
  Zap,
  Brain,
  Sparkles,
  LineChart,
  Shield,
  Globe,
  Mail,
  MessageSquare,
  Settings,
  Search,
  Plus,
  ChevronRight,
  Layers
} from 'lucide-react';

const TOOL_CATEGORIES = {
  creation: {
    name: "Création de Contenu",
    icon: Sparkles,
    color: "#8b5cf6",
    tools: [
      { id: 'text-gen', name: 'Générateur Textes Avancés', description: 'Créez du contenu textuel optimisé', icon: FileText },
      { id: 'image-gen', name: 'Images 4K Ultra-HD', description: 'Générez des images professionnelles', icon: Image },
      { id: 'video-gen', name: 'Vidéos IA Complètes', description: 'Créez des vidéos automatiquement', icon: Video },
      { id: 'audio-gen', name: 'Audio & Musique IA', description: 'Générez voix et musique', icon: MessageSquare },
      { id: 'code-gen', name: 'Code Multi-Languages', description: 'Générez du code dans 50+ langages', icon: Code },
      { id: '3d-gen', name: 'Modèles 3D & Jeux', description: 'Créez des mondes 3D interactifs', icon: Layers },
      { id: 'presentation-gen', name: 'Présentations PPT Pro', description: 'Slides professionnels auto', icon: FileText },
    ]
  },
  analysis: {
    name: "Analyse & Intelligence",
    icon: Brain,
    color: "#06b6d4",
    tools: [
      { id: 'data-analysis', name: 'Analyse Données Massives', description: 'Analysez des millions de données', icon: Database },
      { id: 'sentiment-analysis', name: 'Analyse Sentiments', description: 'Comprenez les émotions', icon: MessageSquare },
      { id: 'pattern-recognition', name: 'Reconnaissance Patterns', description: 'Détectez des patterns complexes', icon: LineChart },
      { id: 'predictive-ai', name: 'Prédictions IA', description: 'Prédisez les tendances futures', icon: Sparkles },
      { id: 'anomaly-detection', name: 'Détection Anomalies', description: 'Identifiez les anomalies', icon: Shield },
      { id: 'knowledge-extraction', name: 'Extraction Connaissances', description: 'Extrayez des insights', icon: Brain },
    ]
  },
  automation: {
    name: "Automatisation & Workflows",
    icon: Workflow,
    color: "#10b981",
    tools: [
      { id: 'workflow-builder', name: 'Constructeur Workflows', description: 'Créez des workflows automatiques', icon: Workflow },
      { id: 'task-automation', name: 'Automatisation Tâches', description: 'Automatisez toutes vos tâches', icon: Zap },
      { id: 'email-automation', name: 'Emails Automatiques', description: 'Gérez vos emails avec IA', icon: Mail },
      { id: 'social-automation', name: 'Réseaux Sociaux Auto', description: 'Automatisez vos publications', icon: Globe },
      { id: 'data-pipeline', name: 'Pipelines de Données', description: 'Flux de données automatisés', icon: Database },
      { id: 'api-integration', name: 'Intégrations API', description: 'Connectez tous vos outils', icon: Settings },
    ]
  },
  agents: {
    name: "Agents IA Autonomes",
    icon: Bot,
    color: "#ec4899",
    tools: [
      { id: 'customer-agent', name: 'Agent Service Client', description: 'Support client 24/7 automatisé', icon: MessageSquare },
      { id: 'sales-agent', name: 'Agent Commercial', description: 'Ventes automatiques intelligentes', icon: Sparkles },
      { id: 'research-agent', name: 'Agent Recherche', description: 'Recherche et veille automatique', icon: Search },
      { id: 'content-agent', name: 'Agent Contenu', description: 'Création contenu automatique', icon: FileText },
      { id: 'code-agent', name: 'Agent Développeur', description: 'Développement code autonome', icon: Code },
      { id: 'data-agent', name: 'Agent Données', description: 'Gestion données intelligente', icon: Database },
      { id: 'manager-agent', name: 'Agent Manager', description: 'Coordination équipes IA', icon: Workflow },
    ]
  },
  optimization: {
    name: "Optimisation & Performance",
    icon: Zap,
    color: "#f59e0b",
    tools: [
      { id: 'performance-optimizer', name: 'Optimiseur Performance', description: 'Optimisez tout automatiquement', icon: Zap },
      { id: 'cost-optimizer', name: 'Optimiseur Coûts', description: 'Réduisez vos dépenses', icon: LineChart },
      { id: 'resource-optimizer', name: 'Optimiseur Ressources', description: 'Gérez efficacement ressources', icon: Settings },
      { id: 'seo-optimizer', name: 'Optimiseur SEO', description: 'Référencement automatique', icon: Globe },
      { id: 'conversion-optimizer', name: 'Optimiseur Conversions', description: 'Maximisez vos conversions', icon: Sparkles },
    ]
  }
};

export default function AIToolsHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('creation');

  const filteredTools = Object.entries(TOOL_CATEGORIES).map(([key, category]) => ({
    ...category,
    key,
    tools: category.tools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.tools.length > 0);

  const handleOpenTool = (toolId) => {
    console.log('Opening tool:', toolId);
    // TODO: Implémenter l'ouverture de l'outil dans une nouvelle fenêtre
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              🤖 Hub Outils IA Minima-X
            </h1>
            <p className="text-slate-400">
              {Object.values(TOOL_CATEGORIES).reduce((acc, cat) => acc + cat.tools.length, 0)} outils IA disponibles
            </p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Créer Outil Personnalisé
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un outil IA..."
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="h-full flex flex-col">
          {/* Category Tabs */}
          <div className="border-b border-slate-700/50 px-6">
            <TabsList className="bg-transparent border-0 gap-2">
              {Object.entries(TOOL_CATEGORIES).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg px-4 py-2 flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" style={{ color: category.color }} />
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-300">
                      {category.tools.length}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tools Grid */}
          <ScrollArea className="flex-1 p-6">
            {Object.entries(TOOL_CATEGORIES).map(([key, category]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                      <Card
                        key={tool.id}
                        className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group"
                        onClick={() => handleOpenTool(tool.id)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div
                              className="p-3 rounded-xl mb-3"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <ToolIcon className="w-6 h-6" style={{ color: category.color }} />
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-500 transition-colors" />
                          </div>
                          <CardTitle className="text-white text-lg">{tool.name}</CardTitle>
                          <CardDescription className="text-slate-400">
                            {tool.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              IA Avancée
                            </Badge>
                            <Badge variant="outline" className="border-green-600 text-green-400">
                              Gratuit
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
        <div className="grid grid-cols-5 gap-4 text-center">
          {Object.entries(TOOL_CATEGORIES).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <Icon className="w-5 h-5" style={{ color: category.color }} />
                <span className="text-2xl font-bold text-white">{category.tools.length}</span>
                <span className="text-xs text-slate-400">{category.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}