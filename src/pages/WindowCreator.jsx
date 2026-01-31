import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Code, Plus, Play, Trash2, Save, Edit, Key, Copy, ExternalLink, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function WindowCreator({ onOpenWindow }) {
  const [mode, setMode] = useState('developer'); // 'developer' ou 'functional'
  const [currentWindow, setCurrentWindow] = useState({
    title: '',
    programmations: []
  });
  const [savedWindows, setSavedWindows] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [showApiPanel, setShowApiPanel] = useState(false);

  const addProgrammation = () => {
    setCurrentWindow(prev => ({
      ...prev,
      programmations: [...prev.programmations, {
        id: Date.now(),
        name: `Programmation ${prev.programmations.length + 1}`,
        code: '',
        description: '',
        active: true
      }]
    }));
  };

  const updateProgrammation = (id, field, value) => {
    setCurrentWindow(prev => ({
      ...prev,
      programmations: prev.programmations.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const removeProgrammation = (id) => {
    setCurrentWindow(prev => ({
      ...prev,
      programmations: prev.programmations.filter(p => p.id !== id)
    }));
  };

  const saveWindow = async () => {
    if (!currentWindow.title.trim()) {
      toast.error('Veuillez entrer un titre');
      return;
    }
    if (currentWindow.programmations.length === 0) {
      toast.error('Ajoutez au moins une programmation');
      return;
    }

    try {
      // Sauvegarder dans base de données
      await base44.entities.File.create({
        name: `${currentWindow.title}.json`,
        file_type: 'other',
        content: JSON.stringify(currentWindow, null, 2)
      });

      setSavedWindows(prev => [...prev, { ...currentWindow, id: Date.now() }]);
      toast.success(`Fenêtre "${currentWindow.title}" sauvegardée!`);
      setCurrentWindow({ title: '', programmations: [] });
    } catch (error) {
      toast.error('Erreur sauvegarde');
    }
  };

  const executeWindow = (window) => {
    const activeProgrammations = window.programmations.filter(p => p.active);
    
    try {
      activeProgrammations.forEach((prog, index) => {
        setTimeout(() => {
          try {
            // Exécution intelligente du code
            const func = new Function('base44', 'toast', prog.code);
            func(base44, toast);
            toast.success(`✅ ${prog.name} exécuté`);
          } catch (err) {
            toast.error(`❌ Erreur ${prog.name}: ${err.message}`);
          }
        }, index * 500);
      });
      
      toast.success(`🎯 Exécution "${window.title}" lancée (${activeProgrammations.length} programmations)`);
    } catch (error) {
      toast.error('Erreur exécution');
    }
  };

  const generateApiKey = () => {
    const key = `MINIMA-X-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newKey = {
      id: Date.now(),
      key,
      name: `API Key ${apiKeys.length + 1}`,
      created: new Date().toISOString(),
      url: `${window.location.origin}/api/windows?key=${key}`
    };
    setApiKeys(prev => [...prev, newKey]);
    toast.success('🔑 Clé API générée!');
    return newKey;
  };

  const deleteApiKey = (id) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    toast.success('Clé API supprimée');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('📋 Copié dans le presse-papier');
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900/95 via-emerald-900/95 to-slate-900/95 backdrop-blur-xl overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Créateur de Fenêtres Personnalisées</h1>
              <p className="text-slate-400 text-sm">Mode: {mode === 'developer' ? '🛠️ Développeur' : '▶️ Fonctionnel'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowApiPanel(!showApiPanel)}
              variant="outline"
              className="bg-purple-600/20 border-purple-500 hover:bg-purple-600/30"
            >
              <Key className="w-4 h-4 mr-2" />
              Clés API ({apiKeys.length})
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Mode:</span>
              <Switch
                checked={mode === 'functional'}
                onCheckedChange={(checked) => setMode(checked ? 'functional' : 'developer')}
              />
              <span className="text-sm text-white">{mode === 'developer' ? 'Développeur' : 'Fonctionnel'}</span>
            </div>
          </div>
        </div>

        {/* PANNEAU API */}
        {showApiPanel && (
          <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/30 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">🌐 Accès API Public - ChatGPT, Grok, IA Externes</h3>
              </div>
              <Button onClick={generateApiKey} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Générer Clé API
              </Button>
            </div>

            <div className="space-y-3">
              {apiKeys.map(apiKey => (
                <Card key={apiKey.id} className="bg-slate-900/50 p-4 border-purple-500/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-semibold">{apiKey.name}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(apiKey.created).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className="bg-slate-800/50 p-2 rounded mb-2">
                        <p className="text-xs text-slate-400 mb-1">Clé API:</p>
                        <code className="text-xs text-purple-300 break-all">{apiKey.key}</code>
                      </div>
                      
                      <div className="bg-slate-800/50 p-2 rounded">
                        <p className="text-xs text-slate-400 mb-1">URL API:</p>
                        <code className="text-xs text-blue-300 break-all">{apiKey.url}</code>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="bg-slate-800 hover:bg-slate-700"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(apiKey.url)}
                        className="bg-slate-800 hover:bg-slate-700"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteApiKey(apiKey.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {apiKeys.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Aucune clé API générée</p>
                  <p className="text-xs mt-1">Cliquez sur "Générer Clé API" pour permettre l'accès aux IA externes</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
              <p className="text-sm text-blue-100 mb-2">💡 <strong>Utilisation avec ChatGPT, Grok, Claude:</strong></p>
              <ul className="text-xs text-blue-100 space-y-1 ml-4">
                <li>• Copiez la clé API et l'URL</li>
                <li>• Partagez avec l'IA: "Utilise cette API pour modifier mes fenêtres"</li>
                <li>• L'IA pourra lire/créer/modifier vos fenêtres personnalisées</li>
                <li>• Révocation possible à tout moment</li>
              </ul>
            </div>
          </Card>
        )}

        {/* MODE DÉVELOPPEUR */}
        {mode === 'developer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Création */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-400" />
                Créer Nouvelle Fenêtre
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Titre de la fenêtre</label>
                  <Input
                    value={currentWindow.title}
                    onChange={(e) => setCurrentWindow({ ...currentWindow, title: e.target.value })}
                    placeholder="Ex: Analyseur de Données Avancé"
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Programmations: {currentWindow.programmations.length}</span>
                  <Button onClick={addProgrammation} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter Programmation
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-3">
                  {currentWindow.programmations.map((prog, index) => (
                    <Card key={prog.id} className="bg-slate-900/50 p-4 border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <Input
                          value={prog.name}
                          onChange={(e) => updateProgrammation(prog.id, 'name', e.target.value)}
                          placeholder="Nom programmation"
                          className="bg-slate-800 border-slate-700 text-white text-sm"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeProgrammation(prog.id)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <Textarea
                        value={prog.description}
                        onChange={(e) => updateProgrammation(prog.id, 'description', e.target.value)}
                        placeholder="Description..."
                        className="bg-slate-800 border-slate-700 text-white text-xs mb-2"
                        rows={2}
                      />

                      <Textarea
                        value={prog.code}
                        onChange={(e) => updateProgrammation(prog.id, 'code', e.target.value)}
                        placeholder={`// Code JavaScript programmation ${index + 1}
// Exemple:
toast.success('Programmation ${index + 1} exécutée!');
// Vous avez accès à: base44, toast`}
                        className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
                        rows={6}
                      />

                      <div className="flex items-center gap-2 mt-2">
                        <Switch
                          checked={prog.active}
                          onCheckedChange={(checked) => updateProgrammation(prog.id, 'active', checked)}
                        />
                        <span className="text-xs text-slate-400">
                          {prog.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </Card>
                  ))}

                  {currentWindow.programmations.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Cliquez sur "Ajouter Programmation" pour commencer</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <Button
                onClick={saveWindow}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder Fenêtre
              </Button>
            </Card>

            {/* Aperçu Code */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">📋 Aperçu Code Complet</h3>
              <ScrollArea className="h-[600px] w-full">
                <pre className="text-xs text-slate-300 bg-slate-900/50 p-4 rounded-lg">
                  {JSON.stringify(currentWindow, null, 2)}
                </pre>
              </ScrollArea>
            </Card>
          </div>
        )}

        {/* MODE FONCTIONNEL */}
        {mode === 'functional' && (
          <div>
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">▶️ Fenêtres Sauvegardées</h3>
              
              {savedWindows.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Aucune fenêtre sauvegardée</p>
                  <p className="text-xs mt-1">Passez en mode développeur pour créer des fenêtres</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedWindows.map(window => (
                    <Card key={window.id} className="bg-slate-900/50 p-4 border-slate-700">
                      <h4 className="text-white font-semibold mb-2">{window.title}</h4>
                      <div className="text-xs text-slate-400 mb-3 space-y-1">
                        <p>📦 {window.programmations.length} programmations</p>
                        <p>✅ {window.programmations.filter(p => p.active).length} actives</p>
                      </div>
                      
                      <div className="space-y-1 mb-3 max-h-[100px] overflow-auto">
                        {window.programmations.map(prog => (
                          <div key={prog.id} className="text-xs text-slate-500 flex items-center gap-2">
                            <span className={prog.active ? 'text-green-400' : 'text-slate-600'}>
                              {prog.active ? '●' : '○'}
                            </span>
                            {prog.name}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => executeWindow(window)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Exécuter
                        </Button>
                        
                        {onOpenWindow && (
                          <Button
                            onClick={() => onOpenWindow('custom-window', window)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                            size="sm"
                          >
                            Exécuter Fenêtre
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-900/30 backdrop-blur-sm border-blue-500/30 p-6">
              <h4 className="text-white font-semibold mb-3">💡 Mode Fonctionnel</h4>
              <ul className="text-sm text-blue-100 space-y-2">
                <li>✓ Cliquez sur "Exécuter" pour lancer toutes les programmations actives</li>
                <li>✓ Les programmations s'exécutent intelligemment dans l'ordre</li>
                <li>✓ Vous verrez les résultats en temps réel</li>
                <li>✓ Retournez en mode développeur pour modifier</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}