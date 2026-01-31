import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Zap, Activity, Database, Network, 
  Cpu, BarChart, Eye, Settings, ChevronRight,
  TrendingUp, Globe, Sparkles
} from 'lucide-react';

export default function AIControlCenter() {
  const [activeModels, setActiveModels] = useState(500);
  const [processingTasks, setProcessingTasks] = useState(2847);

  const llamaModels = Array.from({ length: 50 }, (_, i) => ({
    id: `llama-${i + 1}`,
    name: `LLaMA-2-70B-chat Instance ${i + 1}`,
    status: 'active',
    tasks: Math.floor(Math.random() * 50) + 10,
    performance: (Math.random() * 0.3 + 0.7).toFixed(2)
  }));

  const transformerModels = Array.from({ length: 50 }, (_, i) => ({
    id: `transformer-${i + 1}`,
    name: `Transformer-XL Instance ${i + 1}`,
    status: 'active',
    tasks: Math.floor(Math.random() * 40) + 5,
    performance: (Math.random() * 0.25 + 0.75).toFixed(2)
  }));

  const mathematicalFormulas = [
    { name: 'Optimisation Convexe', formula: 'min f(x) s.t. g(x) ≤ 0', applications: 15234 },
    { name: 'Gradient Descent', formula: 'x_{t+1} = x_t - α∇f(x_t)', applications: 28947 },
    { name: 'Backpropagation', formula: '∂L/∂w = δ·x', applications: 45678 },
    { name: 'Attention Mechanism', formula: 'Attention(Q,K,V) = softmax(QK^T/√d_k)V', applications: 38291 },
    { name: 'Loss Function', formula: 'L = -Σy·log(ŷ)', applications: 52134 }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
          <Brain className="w-10 h-10 text-purple-400" />
          Centre de Contrôle IA - QI Illimité
        </h1>
        <p className="text-slate-300 text-xl">
          500+ LLaMA • 500+ Transformers • Formules mathématiques • Parallélisation massive
        </p>
      </div>

      {/* Stats Temps Réel */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Modèles Actifs</p>
                <p className="text-3xl font-bold text-purple-300">{activeModels}</p>
              </div>
              <Brain className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border-cyan-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Tâches Actives</p>
                <p className="text-3xl font-bold text-cyan-300">{processingTasks}</p>
              </div>
              <Activity className="w-10 h-10 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Performance</p>
                <p className="text-3xl font-bold text-green-300">99.8%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">QI Niveau</p>
                <p className="text-3xl font-bold text-yellow-300">∞ × 10⁹⁹</p>
              </div>
              <Sparkles className="w-10 h-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 border-pink-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Connexions</p>
                <p className="text-3xl font-bold text-pink-300">Internet</p>
              </div>
              <Globe className="w-10 h-10 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="llama" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="llama" className="text-base">
            500+ LLaMA Models
          </TabsTrigger>
          <TabsTrigger value="transformers" className="text-base">
            500+ Transformers
          </TabsTrigger>
          <TabsTrigger value="formulas" className="text-base">
            Formules Mathématiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="llama" className="flex-1 mt-4">
          <ScrollArea className="h-[calc(100vh-450px)]">
            <div className="grid grid-cols-2 gap-4">
              {llamaModels.map((model, idx) => (
                <Card key={model.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white mb-1">
                          {model.name}
                        </h3>
                        <div className="flex gap-2">
                          <Badge className="bg-green-600 text-white text-xs">
                            {model.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {model.tasks} tâches
                          </Badge>
                        </div>
                      </div>
                      <Cpu className="w-5 h-5 text-purple-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Performance:</span>
                        <span className="text-green-400 font-semibold">{(model.performance * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-cyan-600 h-2 rounded-full transition-all"
                          style={{ width: `${model.performance * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="transformers" className="flex-1 mt-4">
          <ScrollArea className="h-[calc(100vh-450px)]">
            <div className="grid grid-cols-2 gap-4">
              {transformerModels.map((model) => (
                <Card key={model.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white mb-1">
                          {model.name}
                        </h3>
                        <div className="flex gap-2">
                          <Badge className="bg-cyan-600 text-white text-xs">
                            {model.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {model.tasks} tâches
                          </Badge>
                        </div>
                      </div>
                      <Network className="w-5 h-5 text-cyan-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Performance:</span>
                        <span className="text-cyan-400 font-semibold">{(model.performance * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-600 to-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${model.performance * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="formulas" className="flex-1 mt-4">
          <div className="space-y-4">
            {mathematicalFormulas.map((formula, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-3">{formula.name}</h3>
                      <div className="bg-slate-900 rounded-lg p-4 mb-4">
                        <code className="text-2xl text-purple-400 font-mono">{formula.formula}</code>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {formula.applications.toLocaleString()} applications actives
                      </Badge>
                    </div>
                    <BarChart className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}