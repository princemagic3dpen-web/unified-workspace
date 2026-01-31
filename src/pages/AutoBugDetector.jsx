import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function AutoBugDetector() {
  const [scanning, setScanning] = useState(false);
  const [bugs, setBugs] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [autoCorrectEnabled, setAutoCorrectEnabled] = useState(true);

  const scanForBugs = async () => {
    setScanning(true);
    toast.info('🔍 Scan des bugs en cours...');

    try {
      const files = await base44.entities.File.list();
      const events = await base44.entities.Event.list();
      const folders = await base44.entities.Folder.list();

      const detectedBugs = [];

      // Détection fichiers sans extension
      files.forEach(file => {
        if (!file.name.includes('.')) {
          detectedBugs.push({
            id: Date.now() + Math.random(),
            type: 'file_no_extension',
            severity: 'low',
            message: `Fichier sans extension: ${file.name}`,
            resource: file,
            autoFixable: true
          });
        }
      });

      // Détection événements passés non terminés
      events.forEach(event => {
        if (new Date(event.end_date) < new Date() && event.status !== 'completed') {
          detectedBugs.push({
            id: Date.now() + Math.random(),
            type: 'event_not_completed',
            severity: 'medium',
            message: `Événement passé non marqué terminé: ${event.title}`,
            resource: event,
            autoFixable: true
          });
        }
      });

      // Détection dossiers vides
      folders.forEach(folder => {
        const hasFiles = files.some(f => f.folder_id === folder.id);
        if (!hasFiles) {
          detectedBugs.push({
            id: Date.now() + Math.random(),
            type: 'empty_folder',
            severity: 'low',
            message: `Dossier vide: ${folder.name}`,
            resource: folder,
            autoFixable: false
          });
        }
      });

      setBugs(detectedBugs);
      toast.success(`✅ Scan terminé: ${detectedBugs.length} bugs détectés`);

      if (autoCorrectEnabled && detectedBugs.length > 0) {
        autoCorrectBugs(detectedBugs);
      }
    } catch (error) {
      toast.error('Erreur scan');
    }

    setScanning(false);
  };

  const autoCorrectBugs = async (bugsToFix) => {
    const fixableBugs = bugsToFix.filter(b => b.autoFixable);
    
    for (const bug of fixableBugs) {
      try {
        if (bug.type === 'file_no_extension') {
          await base44.entities.File.update(bug.resource.id, {
            name: `${bug.resource.name}.txt`
          });
          setCorrections(prev => [...prev, { bugId: bug.id, status: 'fixed', time: new Date() }]);
        }
        
        if (bug.type === 'event_not_completed') {
          await base44.entities.Event.update(bug.resource.id, {
            status: 'completed'
          });
          setCorrections(prev => [...prev, { bugId: bug.id, status: 'fixed', time: new Date() }]);
        }
      } catch (error) {
        setCorrections(prev => [...prev, { bugId: bug.id, status: 'failed', time: new Date() }]);
      }
    }

    toast.success(`🔧 ${fixableBugs.length} bugs auto-corrigés!`);
  };

  useEffect(() => {
    scanForBugs();
    const interval = setInterval(scanForBugs, 60000); // Scan toutes les minutes
    return () => clearInterval(interval);
  }, []);

  const severityColors = {
    low: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/30',
    medium: 'bg-orange-600/30 text-orange-300 border-orange-500/30',
    high: 'bg-red-600/30 text-red-300 border-red-500/30'
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900/95 via-red-900/95 to-slate-900/95 backdrop-blur-xl overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">🐛 Détecteur & Correcteur Automatique de Bugs</h1>
              <p className="text-slate-400 text-sm">{bugs.length} bugs détectés - {corrections.length} corrigés</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={scanForBugs} disabled={scanning} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className={`w-4 h-4 mr-2 ${scanning ? 'animate-spin' : ''}`} />
              Scanner
            </Button>
            <Button 
              onClick={() => setAutoCorrectEnabled(!autoCorrectEnabled)}
              className={autoCorrectEnabled ? 'bg-green-600' : 'bg-slate-600'}
            >
              <Zap className="w-4 h-4 mr-2" />
              Auto-Correction: {autoCorrectEnabled ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4">🔍 Bugs Détectés</h3>
            <ScrollArea className="h-[600px] w-full">
              <div className="space-y-3">
                {bugs.map(bug => (
                  <Card key={bug.id} className={`p-4 border ${severityColors[bug.severity]}`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{bug.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-slate-900/50 rounded">
                            {bug.severity.toUpperCase()}
                          </span>
                          {bug.autoFixable && (
                            <span className="text-xs px-2 py-1 bg-green-900/50 rounded text-green-300">
                              Auto-fixable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {bugs.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                    <p>Aucun bug détecté! ✨</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4">✅ Corrections Effectuées</h3>
            <ScrollArea className="h-[600px] w-full">
              <div className="space-y-2">
                {corrections.map((correction, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/50 rounded flex items-center justify-between">
                    <span className="text-sm text-white">
                      Bug #{correction.bugId.toString().slice(-4)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {new Date(correction.time).toLocaleTimeString('fr-FR')}
                      </span>
                      {correction.status === 'fixed' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}