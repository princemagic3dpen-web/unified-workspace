import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Plus, Settings, Zap, Clock, FileText, Brain, Sparkles, Play, Pause, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ProactiveAgentsCreator() {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    triggers: [],
    actions: [],
    aiSources: [],
    autonomy: 100,
    qi: '∞',
    active: true
  });

  const aiSources = [
    'Base44 QI Illimité',
    'ChatGPT (GPT-4)',
    'Grok (xAI)',
    'LLaMA 500x',
    'Transformers 500x',
    'Claude 3',
    'Gemini Ultra',
    'Stable Diffusion XL',
    'DALL-E 3',
    'Midjourney',
    'Runway Gen-2',
    'Suno AI Music',
    'ElevenLabs Voice'
  ];

  const triggerTypes = [
    { value: 'time', label: 'Intervalle Temps' },
    { value: 'file', label: 'Événement Fichier' },
    { value: 'event', label: 'Événement Calendrier' },
    { value: 'system', label: 'Événement Système' },
    { value: 'voice', label: 'Commande Vocale' },
    { value: 'emotion', label: 'Détection Émotion' },
    { value: 'proactive', label: 'Proactif Automatique' }
  ];

  const actionTypes = [
    'Créer Document',
    'Générer Image',
    'Générer Vidéo',
    'Générer Musique',
    'Envoyer Email',
    'Créer Tâche',
    'Analyser Données',
    'Écrire Code',
    'Modifier Fichier',
    'Améliorer Contenu',
    'Vérifier QI Illimité',
    'Enregistrer Audio',
    'Synthèse Vocale'
  ];

  const createAgent = async () => {
    if (!newAgent.name.trim()) {
      toast.error('Nom requis');
      return;
    }

    const agent = {
      ...newAgent,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      qi: '∞',
      status: 'active'
    };

    setAgents([...agents, agent]);
    toast.success(`Agent "${agent.name}" créé avec QI ∞`);
    
    // Reset form
    setNewAgent({
      name: '',
      description: '',
      triggers: [],
      actions: [],
      aiSources: [],
      autonomy: 100,
      qi: '∞',
      active: true
    });
  };

  const toggleAgent = (id) => {
    setAgents(agents.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
  };

  const deleteAgent = (id) => {
    setAgents(agents.filter(a => a.id !== id));
    toast.success('Agent supprimé');
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900">
      {/* Sidebar - Créateur */}
      <div className="w-[450px] border-r border-slate-700 bg-slate-800/50 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              🤖 Créateur d'Agents Proactifs
            </h2>
            <p className="text-sm text-slate-400">QI Illimité • Autonomie Totale</p>
          </div>

          <div className="space-y-6">
            {/* Nom & Description */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Nom de l'Agent
              </label>
              <Input
                value={newAgent.name}
                onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                placeholder="Ex: Assistant Personnel Pro"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Description & Mission
              </label>
              <Textarea
                value={newAgent.description}
                onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                placeholder="Décrivez le rôle et les capacités de cet agent..."
                className="bg-slate-900 border-slate-700 text-white min-h-24"
              />
            </div>

            {/* Sources IA */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Sources IA (Multi-sélection)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto p-2 bg-slate-900 rounded-lg border border-slate-700">
                {aiSources.map((source) => (
                  <button
                    key={source}
                    onClick={() => {
                      const sources = newAgent.aiSources.includes(source)
                        ? newAgent.aiSources.filter(s => s !== source)
                        : [...newAgent.aiSources, source];
                      setNewAgent({...newAgent, aiSources: sources});
                    }}
                    className={`p-2 rounded text-xs transition-all ${
                      newAgent.aiSources.includes(source)
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>

            {/* Déclencheurs */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Déclencheurs d'Action
              </label>
              <div className="space-y-2">
                {triggerTypes.map((trigger) => (
                  <button
                    key={trigger.value}
                    onClick={() => {
                      const triggers = newAgent.triggers.includes(trigger.value)
                        ? newAgent.triggers.filter(t => t !== trigger.value)
                        : [...newAgent.triggers, trigger.value];
                      setNewAgent({...newAgent, triggers});
                    }}
                    className={`w-full p-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                      newAgent.triggers.includes(trigger.value)
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    {trigger.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Actions Disponibles
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto p-2 bg-slate-900 rounded-lg border border-slate-700">
                {actionTypes.map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      const actions = newAgent.actions.includes(action)
                        ? newAgent.actions.filter(a => a !== action)
                        : [...newAgent.actions, action];
                      setNewAgent({...newAgent, actions});
                    }}
                    className={`p-2 rounded text-xs transition-all ${
                      newAgent.actions.includes(action)
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Autonomie */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Niveau d'Autonomie: {newAgent.autonomy}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={newAgent.autonomy}
                onChange={(e) => setNewAgent({...newAgent, autonomy: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            {/* Bouton création */}
            <Button
              onClick={createAgent}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-12"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer Agent QI ∞
            </Button>
          </div>
        </div>
      </div>

      {/* Zone principale - Liste agents */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-slate-700 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Agents Actifs</h2>
              <p className="text-sm text-slate-400">{agents.length} agents créés</p>
            </div>
            <Badge variant="outline" className="border-green-500 text-green-400 animate-pulse">
              ✓ Système Autonome
            </Badge>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          {agents.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Bot className="w-20 h-20 mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Aucun agent créé
                </h3>
                <p className="text-slate-400">
                  Créez votre premier agent proactif avec QI illimité
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {agents.map((agent) => (
                <Card key={agent.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          agent.active ? 'bg-green-500 animate-pulse' : 'bg-slate-600'
                        }`} />
                        <div>
                          <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                          <p className="text-sm text-slate-400 mt-1">{agent.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={agent.active ? 'default' : 'outline'}
                          onClick={() => toggleAgent(agent.id)}
                          className={agent.active ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          {agent.active ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteAgent(agent.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Sources IA:</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.aiSources.slice(0, 3).map((source) => (
                          <Badge key={source} variant="outline" className="border-purple-500 text-purple-400 text-xs">
                            {source}
                          </Badge>
                        ))}
                        {agent.aiSources.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.aiSources.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 mb-1">Déclencheurs:</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.triggers.map((trigger) => (
                          <Badge key={trigger} variant="outline" className="border-cyan-500 text-cyan-400 text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 mb-1">Actions:</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.actions.slice(0, 4).map((action) => (
                          <Badge key={action} variant="outline" className="border-green-500 text-green-400 text-xs">
                            {action}
                          </Badge>
                        ))}
                        {agent.actions.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.actions.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-slate-400">QI: {agent.qi}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-slate-400">Autonomie: {agent.autonomy}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}