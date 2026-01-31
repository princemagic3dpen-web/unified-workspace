import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Bot, Sparkles, MessageSquare, Zap, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ProactiveAgents() {
  const [agents, setAgents] = useState([
    { 
      id: 1, 
      name: 'Agent Assistance Contextuelle', 
      active: true, 
      context: 'Surveille l\'activité et propose des actions pertinentes',
      suggestions: []
    },
    { 
      id: 2, 
      name: 'Agent Création Automatique', 
      active: true, 
      context: 'Crée automatiquement dossiers, fichiers selon besoin',
      suggestions: []
    },
    { 
      id: 3, 
      name: 'Agent Optimisation', 
      active: true, 
      context: 'Détecte inefficacités et propose améliorations',
      suggestions: []
    },
    { 
      id: 4, 
      name: 'Agent Communication', 
      active: true, 
      context: 'Initie conversations pertinentes basées sur contexte',
      suggestions: []
    }
  ]);

  const [currentSuggestions, setCurrentSuggestions] = useState([]);

  // Simulation agents proactifs
  useEffect(() => {
    const interval = setInterval(() => {
      const activeAgents = agents.filter(a => a.active);
      if (activeAgents.length > 0 && Math.random() > 0.7) {
        const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
        const suggestions = [
          `${agent.name}: Voulez-vous créer un dossier pour organiser vos fichiers récents?`,
          `${agent.name}: J'ai détecté une répétition de tâches. Puis-je automatiser cela?`,
          `${agent.name}: Votre productivité serait améliorée en activant le mode focus.`,
          `${agent.name}: Souhaitez-vous que je génère un rapport basé sur votre activité?`
        ];
        const newSuggestion = {
          id: Date.now(),
          agent: agent.name,
          message: suggestions[Math.floor(Math.random() * suggestions.length)],
          timestamp: new Date()
        };
        setCurrentSuggestions(prev => [newSuggestion, ...prev].slice(0, 10));
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [agents]);

  const toggleAgent = (id) => {
    setAgents(prev => prev.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
    const agent = agents.find(a => a.id === id);
    toast.success(agent.active ? `${agent.name} désactivé` : `${agent.name} activé`);
  };

  const handleSuggestionAction = (suggestion, action) => {
    if (action === 'accept') {
      toast.success('Action acceptée - Agent exécute la tâche...');
    } else {
      toast.info('Suggestion ignorée');
    }
    setCurrentSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/95 via-indigo-900/95 to-slate-900/95 backdrop-blur-xl p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Agents IA Proactifs</h1>
            <p className="text-slate-400 text-sm">Assistance contextuelle • Actions automatiques • Suggestions intelligentes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste Agents */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Agents Actifs
            </h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {agents.map(agent => (
                  <div key={agent.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Bot className={`w-5 h-5 ${agent.active ? 'text-green-400' : 'text-slate-600'}`} />
                        <div>
                          <h4 className="text-white font-semibold text-sm">{agent.name}</h4>
                          <p className="text-xs text-slate-400 mt-1">{agent.context}</p>
                        </div>
                      </div>
                      <Switch
                        checked={agent.active}
                        onCheckedChange={() => toggleAgent(agent.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Suggestions Temps Réel */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              Suggestions Proactives ({currentSuggestions.length})
            </h3>
            <ScrollArea className="h-[500px]">
              <AnimatePresence>
                {currentSuggestions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Les agents analysent votre activité...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentSuggestions.map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/30"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <MessageSquare className="w-4 h-4 text-indigo-400 mt-1" />
                          <div className="flex-1">
                            <p className="text-sm text-white mb-1">{suggestion.message}</p>
                            <span className="text-xs text-slate-500">
                              {suggestion.timestamp.toLocaleTimeString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSuggestionAction(suggestion, 'accept')}
                            className="bg-green-600 hover:bg-green-700 text-xs"
                          >
                            ✅ Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSuggestionAction(suggestion, 'ignore')}
                            className="text-xs border-slate-700"
                          >
                            Ignorer
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </Card>
        </div>

        {/* Statistiques */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6 mt-6">
          <h3 className="text-lg font-bold text-white mb-4">📊 Statistiques Agents</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-400">{agents.filter(a => a.active).length}</p>
              <p className="text-xs text-slate-400">Agents actifs</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-400">{currentSuggestions.length}</p>
              <p className="text-xs text-slate-400">Suggestions en attente</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-400">47</p>
              <p className="text-xs text-slate-400">Actions automatisées</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-400">98%</p>
              <p className="text-xs text-slate-400">Efficacité</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}