import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Settings, ChevronRight, ChevronDown, Code } from 'lucide-react';
import { toast } from 'sonner';

export default function AdvancedParametersManager() {
  const [parameters, setParameters] = useState([
    {
      id: 1,
      name: 'Voix',
      description: 'Paramètres vocaux complets',
      active: true,
      expanded: false,
      subParameters: [
        {
          id: 11,
          name: 'Vitesse',
          description: 'Vitesse de parole',
          active: true,
          value: 1.0,
          type: 'slider',
          min: 0.5,
          max: 2.0,
          subSubParameters: []
        },
        {
          id: 12,
          name: 'Ton',
          description: 'Tonalité voix',
          active: true,
          value: 1.0,
          type: 'slider',
          min: 0.5,
          max: 2.0,
          subSubParameters: []
        },
        {
          id: 13,
          name: 'Émotions',
          description: 'Émotions vocales disponibles',
          active: true,
          expanded: false,
          subSubParameters: [
            { id: 131, name: 'Joie', active: true },
            { id: 132, name: 'Tristesse', active: false },
            { id: 133, name: 'Colère', active: false },
            { id: 134, name: 'Surprise', active: true },
            { id: 135, name: 'Peur', active: false },
            { id: 136, name: 'Neutre', active: true },
            { id: 137, name: 'Excitation', active: true },
            { id: 138, name: 'Calme', active: true },
            { id: 139, name: 'Professionnelle', active: true }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Intelligence Artificielle',
      description: 'Moteurs IA et capacités',
      active: true,
      expanded: false,
      subParameters: [
        { id: 21, name: 'Création Dossiers Auto', active: true, subSubParameters: [] },
        { id: 22, name: 'Création Fichiers Auto', active: true, subSubParameters: [] },
        { id: 23, name: 'Création Paramètres Auto', active: true, subSubParameters: [] },
        { id: 24, name: 'Moteurs Mathématiques', active: true, subSubParameters: [] },
        { id: 25, name: 'Transcription Paroles', active: true, subSubParameters: [] },
        { id: 26, name: 'Création Paroles IA', active: true, subSubParameters: [] },
        { id: 27, name: 'Vérificateur Introduction', active: true, subSubParameters: [] },
        { id: 28, name: 'Langage Naturel Humain', active: true, subSubParameters: [] }
      ]
    }
  ]);

  const [showCreate, setShowCreate] = useState(false);
  const [newParam, setNewParam] = useState({ name: '', description: '', code: '' });

  const toggleParameter = (id, subId = null, subSubId = null) => {
    setParameters(prev => prev.map(p => {
      if (p.id === id && !subId) {
        return { ...p, active: !p.active };
      }
      if (p.id === id && subId && !subSubId) {
        return {
          ...p,
          subParameters: p.subParameters.map(sp =>
            sp.id === subId ? { ...sp, active: !sp.active } : sp
          )
        };
      }
      if (p.id === id && subId && subSubId) {
        return {
          ...p,
          subParameters: p.subParameters.map(sp =>
            sp.id === subId ? {
              ...sp,
              subSubParameters: sp.subSubParameters.map(ssp =>
                ssp.id === subSubId ? { ...ssp, active: !ssp.active } : ssp
              )
            } : sp
          )
        };
      }
      return p;
    }));
  };

  const toggleExpand = (id, subId = null) => {
    setParameters(prev => prev.map(p => {
      if (p.id === id && !subId) {
        return { ...p, expanded: !p.expanded };
      }
      if (p.id === id && subId) {
        return {
          ...p,
          subParameters: p.subParameters.map(sp =>
            sp.id === subId ? { ...sp, expanded: !sp.expanded } : sp
          )
        };
      }
      return p;
    }));
  };

  const createParameter = () => {
    const newParameter = {
      id: Date.now(),
      name: newParam.name,
      description: newParam.description,
      active: true,
      expanded: false,
      code: newParam.code,
      subParameters: []
    };
    setParameters(prev => [...prev, newParameter]);
    toast.success(`Paramètre "${newParam.name}" créé!`);
    setNewParam({ name: '', description: '', code: '' });
    setShowCreate(false);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur-xl p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Gestionnaire Paramètres Avancés</h1>
              <p className="text-slate-400 text-sm">Hiérarchie complète • Paramètres dynamiques • Sous-sous-paramètres</p>
            </div>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Paramètre
          </Button>
        </div>

        {showCreate && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">✨ Créer Nouveau Paramètre</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Nom du paramètre</label>
                <Input
                  value={newParam.name}
                  onChange={(e) => setNewParam({...newParam, name: e.target.value})}
                  placeholder="Ex: Système Audio Avancé"
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Description</label>
                <Textarea
                  value={newParam.description}
                  onChange={(e) => setNewParam({...newParam, description: e.target.value})}
                  placeholder="Description détaillée du paramètre..."
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Code Programmation Dynamique</label>
                <Textarea
                  value={newParam.code}
                  onChange={(e) => setNewParam({...newParam, code: e.target.value})}
                  placeholder="// Code JavaScript pour le comportement dynamique..."
                  className="bg-slate-900/50 border-slate-700 text-white min-h-[150px] font-mono text-xs"
                />
              </div>
              <Button onClick={createParameter} className="w-full bg-blue-600 hover:bg-blue-700">
                Créer Paramètre
              </Button>
            </div>
          </Card>
        )}

        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {parameters.map(param => (
              <Card key={param.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleExpand(param.id)}
                      className="h-6 w-6 p-0"
                    >
                      {param.expanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                    <div>
                      <h3 className="text-white font-semibold">{param.name}</h3>
                      <p className="text-xs text-slate-400">{param.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={param.active}
                    onCheckedChange={() => toggleParameter(param.id)}
                  />
                </div>

                {param.expanded && param.subParameters.length > 0 && (
                  <div className="ml-8 mt-3 space-y-2 border-l-2 border-slate-700 pl-4">
                    {param.subParameters.map(subParam => (
                      <div key={subParam.id} className="bg-slate-900/30 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            {subParam.subSubParameters?.length > 0 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleExpand(param.id, subParam.id)}
                                className="h-5 w-5 p-0"
                              >
                                {subParam.expanded ? (
                                  <ChevronDown className="w-3 h-3 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-slate-400" />
                                )}
                              </Button>
                            )}
                            <div>
                              <p className="text-sm text-white font-medium">{subParam.name}</p>
                              <p className="text-xs text-slate-500">{subParam.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={subParam.active}
                            onCheckedChange={() => toggleParameter(param.id, subParam.id)}
                          />
                        </div>

                        {subParam.type === 'slider' && (
                          <div className="mt-2">
                            <input
                              type="range"
                              min={subParam.min}
                              max={subParam.max}
                              step="0.1"
                              value={subParam.value}
                              className="w-full"
                            />
                            <span className="text-xs text-slate-400">{subParam.value.toFixed(1)}</span>
                          </div>
                        )}

                        {subParam.expanded && subParam.subSubParameters?.length > 0 && (
                          <div className="ml-6 mt-2 space-y-1 border-l-2 border-slate-600 pl-3">
                            {subParam.subSubParameters.map(subSubParam => (
                              <div key={subSubParam.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                                <span className="text-xs text-slate-300">{subSubParam.name}</span>
                                <Switch
                                  checked={subSubParam.active}
                                  onCheckedChange={() => toggleParameter(param.id, subParam.id, subSubParam.id)}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {param.code && (
                  <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-slate-400">Code Programmation</span>
                    </div>
                    <pre className="text-xs text-slate-300 overflow-auto max-h-[100px]">
                      {param.code}
                    </pre>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}