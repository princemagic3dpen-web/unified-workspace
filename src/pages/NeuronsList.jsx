import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Plus, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function NeuronsList() {
  const [neurons] = useState([
    { id: 1, name: 'Neurone Analyse', type: 'input', connections: 500, status: 'active' },
    { id: 2, name: 'Neurone Création', type: 'output', connections: 450, status: 'active' },
    { id: 3, name: 'Neurone Apprentissage', type: 'hidden', connections: 1000, status: 'active' },
    { id: 4, name: 'Neurone Mémoire', type: 'recurrent', connections: 800, status: 'active' },
    { id: 5, name: 'Neurone Logique', type: 'processing', connections: 600, status: 'active' },
    { id: 6, name: 'Neurone Émotion', type: 'specialized', connections: 300, status: 'active' },
  ]);

  const [showCreate, setShowCreate] = useState(false);
  const [newNeuron, setNewNeuron] = useState({ name: '', type: '', description: '', code: '' });

  const handleCreate = () => {
    toast.success(`Neurone "${newNeuron.name}" créé!`);
    setNewNeuron({ name: '', type: '', description: '', code: '' });
    setShowCreate(false);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Liste Neurones</h1>
              <p className="text-slate-400 text-sm">{neurons.length} types neurones • {neurons.reduce((acc, n) => acc + n.connections, 0)} connexions totales</p>
            </div>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Neurone
          </Button>
        </div>

        {showCreate && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Créer Nouveau Neurone</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Nom du neurone</label>
                <Input
                  value={newNeuron.name}
                  onChange={(e) => setNewNeuron({...newNeuron, name: e.target.value})}
                  placeholder="Ex: Neurone Créativité"
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Type</label>
                <Input
                  value={newNeuron.type}
                  onChange={(e) => setNewNeuron({...newNeuron, type: e.target.value})}
                  placeholder="input/output/hidden/recurrent/specialized"
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Description</label>
                <Textarea
                  value={newNeuron.description}
                  onChange={(e) => setNewNeuron({...newNeuron, description: e.target.value})}
                  placeholder="Description fonctionnement neurone..."
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Code Programmation</label>
                <Textarea
                  value={newNeuron.code}
                  onChange={(e) => setNewNeuron({...newNeuron, code: e.target.value})}
                  placeholder="// Code activation, propagation..."
                  className="bg-slate-900/50 border-slate-700 text-white min-h-[200px] font-mono text-xs"
                />
              </div>
              <Button onClick={handleCreate} className="w-full bg-purple-600 hover:bg-purple-700">
                Créer Neurone
              </Button>
            </div>
          </Card>
        )}

        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {neurons.map(neuron => (
              <Card key={neuron.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-8 h-8 text-purple-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{neuron.name}</h3>
                    <span className="text-xs text-slate-400">{neuron.type}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Connexions:</span>
                    <span className="font-semibold">{neuron.connections}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Status:</span>
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                      {neuron.status}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-4 text-xs border-slate-700">
                  <Activity className="w-3 h-3 mr-1" />
                  Voir Activité
                </Button>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}