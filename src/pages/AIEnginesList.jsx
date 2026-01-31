import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Plus, Code } from 'lucide-react';
import { toast } from 'sonner';

export default function AIEnginesList() {
  const [engines] = useState([
    { id: 1, name: 'Moteur LLaMA 500x', type: 'language', status: 'active', description: '500 instances parallèles' },
    { id: 2, name: 'Moteur Transformers 500x', type: 'language', status: 'active', description: 'Traitement parallèle massif' },
    { id: 3, name: 'Moteur Mathématique', type: 'computation', status: 'active', description: 'Calculs formules avancées' },
    { id: 4, name: 'Moteur Graphique 4K', type: 'graphics', status: 'active', description: 'Rendu images ultra HD' },
    { id: 5, name: 'Moteur Audio', type: 'audio', status: 'active', description: 'Synthèse vocale émotionnelle' },
    { id: 6, name: 'Moteur Vidéo', type: 'video', status: 'active', description: 'Génération vidéos cinématiques' },
    { id: 7, name: 'Moteur 3D', type: '3d', status: 'active', description: 'Mondes jeux temps réel' },
    { id: 8, name: 'Moteur Vision', type: 'vision', status: 'active', description: 'Analyse images avancée' },
  ]);

  const [showCreate, setShowCreate] = useState(false);
  const [newEngine, setNewEngine] = useState({ name: '', type: '', description: '', code: '' });

  const handleCreate = () => {
    toast.success(`Moteur "${newEngine.name}" créé!`);
    setNewEngine({ name: '', type: '', description: '', code: '' });
    setShowCreate(false);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/95 via-orange-900/95 to-slate-900/95 backdrop-blur-xl p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Liste Moteurs IA</h1>
              <p className="text-slate-400 text-sm">{engines.length} moteurs actifs</p>
            </div>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Moteur
          </Button>
        </div>

        {showCreate && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Créer Nouveau Moteur</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Nom du moteur</label>
                <Input
                  value={newEngine.name}
                  onChange={(e) => setNewEngine({...newEngine, name: e.target.value})}
                  placeholder="Ex: Moteur Quantique"
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Type</label>
                <Input
                  value={newEngine.type}
                  onChange={(e) => setNewEngine({...newEngine, type: e.target.value})}
                  placeholder="language/graphics/audio/etc"
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Description</label>
                <Textarea
                  value={newEngine.description}
                  onChange={(e) => setNewEngine({...newEngine, description: e.target.value})}
                  placeholder="Description détaillée du moteur..."
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Code Programmation</label>
                <Textarea
                  value={newEngine.code}
                  onChange={(e) => setNewEngine({...newEngine, code: e.target.value})}
                  placeholder="// Code JavaScript du moteur..."
                  className="bg-slate-900/50 border-slate-700 text-white min-h-[200px] font-mono text-xs"
                />
              </div>
              <Button onClick={handleCreate} className="w-full bg-orange-600 hover:bg-orange-700">
                Créer Moteur
              </Button>
            </div>
          </Card>
        )}

        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {engines.map(engine => (
              <Card key={engine.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{engine.name}</h3>
                    <span className="text-xs text-slate-400">{engine.type}</span>
                  </div>
                  <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                    {engine.status}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-4">{engine.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs border-slate-700">
                    <Code className="w-3 h-3 mr-1" />
                    Voir Code
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs border-slate-700">
                    Configurer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}