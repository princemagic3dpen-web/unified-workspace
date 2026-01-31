import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Code, 
  Eye, 
  Save, 
  X,
  Maximize,
  Minimize,
  Database,
  FileCode
} from 'lucide-react';
import { toast } from 'sonner';

export default function WindowManagerPage() {
  const [windows, setWindows] = useState([
    {
      id: 'welcome',
      title: 'Fenêtre de Bienvenue',
      code: `export default function Welcome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenue!</h1>
      <p>Ceci est une fenêtre personnalisée.</p>
    </div>
  );
}`,
      database_linked: false,
      active: true
    }
  ]);

  const [viewMode, setViewMode] = useState('visual'); // 'visual' or 'code'
  const [selectedWindow, setSelectedWindow] = useState('welcome');
  const [newWindowName, setNewWindowName] = useState('');
  const [editingCode, setEditingCode] = useState('');

  const selectedWindowData = windows.find(w => w.id === selectedWindow);

  const handleCreateWindow = () => {
    if (!newWindowName.trim()) {
      toast.error('Nom de fenêtre requis');
      return;
    }

    const newWindow = {
      id: `window_${Date.now()}`,
      title: newWindowName,
      code: `export default function ${newWindowName.replace(/\s/g, '')}() {
  return (
    <div className="h-full p-6 bg-white">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">${newWindowName}</h1>
      <p className="text-slate-700">Contenu de la fenêtre ${newWindowName}</p>
    </div>
  );
}`,
      database_linked: false,
      active: false
    };

    setWindows(prev => [...prev, newWindow]);
    setNewWindowName('');
    toast.success(`Fenêtre "${newWindowName}" créée`);
  };

  const handleSaveCode = () => {
    setWindows(prev => prev.map(w => 
      w.id === selectedWindow 
        ? { ...w, code: editingCode }
        : w
    ));
    toast.success('Code sauvegardé');
  };

  const handleDeleteWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (selectedWindow === id) {
      setSelectedWindow(windows[0]?.id);
    }
    toast.success('Fenêtre supprimée');
  };

  const handleToggleDatabase = (id) => {
    setWindows(prev => prev.map(w =>
      w.id === id
        ? { ...w, database_linked: !w.database_linked }
        : w
    ));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-300 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Gestionnaire de Fenêtres Dynamiques</h1>
        <p className="text-sm text-slate-600">
          Mode Programmeur (Code) & Mode Utilisateur (Visuel) | Bases de données dynamiques
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Liste fenêtres - Gauche */}
        <div className="w-80 border-r border-slate-300 flex flex-col">
          <div className="p-3 border-b border-slate-300 bg-slate-50">
            <h3 className="font-bold text-slate-900 mb-2">📋 Liste des Fenêtres</h3>
            <div className="flex gap-2">
              <Input
                value={newWindowName}
                onChange={(e) => setNewWindowName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateWindow()}
                placeholder="Nom nouvelle fenêtre"
                className="flex-1 text-sm"
              />
              <Button onClick={handleCreateWindow} size="sm" className="bg-blue-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {windows.map(window => (
                <div
                  key={window.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedWindow === window.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-slate-300 hover:border-blue-300'
                  }`}
                  onClick={() => {
                    setSelectedWindow(window.id);
                    setEditingCode(window.code);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-slate-900">{window.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWindow(window.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      <FileCode className="w-3 h-3 mr-1" />
                      Code
                    </Badge>
                    
                    <Button
                      variant={window.database_linked ? "default" : "outline"}
                      size="sm"
                      className="h-5 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleDatabase(window.id);
                      }}
                    >
                      <Database className="w-3 h-3 mr-1" />
                      DB
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Éditeur - Droite */}
        <div className="flex-1 flex flex-col">
          {selectedWindowData ? (
            <>
              <div className="p-3 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">{selectedWindowData.title}</h2>
                
                <div className="flex items-center gap-2">
                  <Tabs value={viewMode} onValueChange={setViewMode}>
                    <TabsList>
                      <TabsTrigger value="visual" className="text-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Visuel
                      </TabsTrigger>
                      <TabsTrigger value="code" className="text-sm">
                        <Code className="w-4 h-4 mr-1" />
                        Code
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {viewMode === 'code' ? (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 p-4">
                      <Textarea
                        value={editingCode}
                        onChange={(e) => setEditingCode(e.target.value)}
                        className="h-full font-mono text-sm"
                        placeholder="Code de la fenêtre..."
                      />
                    </div>
                    
                    <div className="p-3 border-t border-slate-300 bg-slate-50 flex justify-end gap-2">
                      <Button onClick={handleSaveCode} className="bg-green-600">
                        <Save className="w-4 h-4 mr-1" />
                        Sauvegarder Code
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full p-6 bg-slate-50">
                    <div className="h-full bg-white rounded-lg border-2 border-slate-300 p-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-4">
                        {selectedWindowData.title}
                      </h2>
                      <p className="text-slate-700 mb-4">
                        Mode visuel - Aperçu de la fenêtre
                      </p>
                      
                      {selectedWindowData.database_linked && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-300 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Database className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-blue-900">Base de données liée</span>
                          </div>
                          <p className="text-sm text-blue-800">
                            Cette fenêtre est connectée dynamiquement à une base de données.
                            Les données sont synchronisées en temps réel.
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-slate-600">
                        Pour modifier le contenu, basculez en mode <strong>Code</strong> ci-dessus.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Sélectionnez ou créez une fenêtre
            </div>
          )}
        </div>
      </div>
    </div>
  );
}