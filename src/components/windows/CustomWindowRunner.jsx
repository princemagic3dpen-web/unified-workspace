import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Code } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function CustomWindowRunner({ windowData }) {
  const executeAllActive = () => {
    const activeProgrammations = windowData.programmations.filter(p => p.active);
    
    try {
      activeProgrammations.forEach((prog, index) => {
        setTimeout(() => {
          try {
            const func = new Function('base44', 'toast', prog.code);
            func(base44, toast);
            toast.success(`✅ ${prog.name} exécuté`);
          } catch (err) {
            toast.error(`❌ Erreur ${prog.name}: ${err.message}`);
          }
        }, index * 500);
      });
      
      toast.success(`🎯 ${activeProgrammations.length} programmations lancées`);
    } catch (error) {
      toast.error('Erreur exécution');
    }
  };

  // Auto-exécution au chargement
  useEffect(() => {
    executeAllActive();
  }, []);

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900/95 via-emerald-900/95 to-slate-900/95 backdrop-blur-xl overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{windowData.title}</h1>
                <p className="text-slate-400 text-sm">
                  {windowData.programmations.filter(p => p.active).length} programmations actives
                </p>
              </div>
            </div>

            <Button onClick={executeAllActive} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Ré-exécuter tout
            </Button>
          </div>

          <ScrollArea className="h-[500px] w-full">
            <div className="space-y-3">
              {windowData.programmations.map((prog) => (
                <Card key={prog.id} className="bg-slate-900/50 p-4 border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${prog.active ? 'text-green-400' : 'text-slate-600'}`}>
                        {prog.active ? '●' : '○'}
                      </span>
                      <h3 className="text-white font-semibold">{prog.name}</h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${prog.active ? 'bg-green-600' : 'bg-slate-700'}`}>
                      {prog.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {prog.description && (
                    <p className="text-sm text-slate-400 mb-3">{prog.description}</p>
                  )}

                  <pre className="text-xs text-slate-300 bg-slate-800/50 p-3 rounded-lg overflow-auto">
                    {prog.code}
                  </pre>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-100">
              💡 Cette fenêtre exécute automatiquement toutes les programmations actives au chargement.
              Cliquez sur "Ré-exécuter tout" pour relancer l'exécution.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}