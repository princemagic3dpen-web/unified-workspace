import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Zap, Power, Activity, Cpu, Gauge, Sparkles, Settings } from 'lucide-react';

export default function AIOrchestrator() {
  const [engines, setEngines] = useState([
    { id: 1, name: 'LLaMA 500x', status: 'active', qi: '∞', power: 100 },
    { id: 2, name: 'Transformers 500x', status: 'active', qi: '∞', power: 100 },
    { id: 3, name: 'Intelligence Émotionnelle', status: 'active', qi: '∞', power: 95 },
    { id: 4, name: 'Moteur Mathématique', status: 'active', qi: '∞', power: 100 },
    { id: 5, name: 'Orchestrateur Proactif', status: 'active', qi: '∞', power: 98 },
    { id: 6, name: 'Auto-Amélioration', status: 'active', qi: '∞', power: 92 },
    { id: 7, name: 'Vérificateur QI Illimité', status: 'active', qi: '∞', power: 100 },
    { id: 8, name: 'Génération Créative', status: 'active', qi: '∞', power: 97 }
  ]);

  const toggleEngine = (id) => {
    setEngines(engines.map(e => 
      e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e
    ));
  };

  const toggleAll = (status) => {
    setEngines(engines.map(e => ({ ...e, status })));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              🧠 Orchestrateur IA - QI Illimité
            </h1>
            <p className="text-slate-400">
              Contrôle centralisé de tous les moteurs d'intelligence artificielle
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => toggleAll('active')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Power className="w-4 h-4 mr-2" />
              Activer Tout
            </Button>
            <Button
              onClick={() => toggleAll('inactive')}
              variant="destructive"
            >
              <Power className="w-4 h-4 mr-2" />
              Désactiver Tout
            </Button>
          </div>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Moteurs Actifs</p>
                  <p className="text-2xl font-bold text-green-400">
                    {engines.filter(e => e.status === 'active').length}/{engines.length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">QI Moyen</p>
                  <p className="text-2xl font-bold text-purple-400">∞</p>
                </div>
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Puissance Totale</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {Math.round(engines.reduce((acc, e) => acc + e.power, 0) / engines.length)}%
                  </p>
                </div>
                <Zap className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Mode</p>
                  <p className="text-2xl font-bold text-yellow-400">Autonome</p>
                </div>
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Liste des moteurs */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-4">
          {engines.map((engine) => (
            <Card
              key={engine.id}
              className={`border-2 transition-all ${
                engine.status === 'active'
                  ? 'bg-slate-800/50 border-green-500/50'
                  : 'bg-slate-800/30 border-slate-700'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      engine.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'
                    }`} />
                    <div>
                      <CardTitle className="text-white text-lg">{engine.name}</CardTitle>
                      <CardDescription>
                        QI: {engine.qi} | Puissance: {engine.power}%
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={engine.status === 'active' ? 'default' : 'outline'}
                    onClick={() => toggleEngine(engine.id)}
                    className={engine.status === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {engine.status === 'active' ? (
                      <>
                        <Power className="w-4 h-4 mr-1" />
                        ON
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4 mr-1" />
                        OFF
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Statut</span>
                    <Badge variant={engine.status === 'active' ? 'default' : 'secondary'}>
                      {engine.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        engine.status === 'active' ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                      style={{ width: `${engine.power}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="text-slate-300">
              Système autonome • Proactif • Auto-amélioration continue
            </span>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres Avancés
          </Button>
        </div>
      </div>
    </div>
  );
}