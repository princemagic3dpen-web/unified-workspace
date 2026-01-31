import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Clock, Sparkles, Users, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AICollaborationHub() {
  const [collaborations, setCollaborations] = useState([]);
  const [pendingActions, setPendingActions] = useState([
    {
      id: 1,
      type: 'create',
      source: 'ChatGPT',
      action: 'Créer document stratégique 50 pages',
      status: 'pending',
      qi: '∞',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'generate',
      source: 'Grok Image',
      action: 'Générer 10 images haute résolution',
      status: 'pending',
      qi: '∞',
      timestamp: new Date()
    },
    {
      id: 3,
      type: 'modify',
      source: 'Base44 QI ∞',
      action: 'Améliorer tous fichiers avec formules mathématiques',
      status: 'pending',
      qi: '∞',
      timestamp: new Date()
    }
  ]);

  const confirmAction = (id, approved) => {
    const action = pendingActions.find(a => a.id === id);
    
    setCollaborations([...collaborations, {
      ...action,
      status: approved ? 'approved' : 'rejected',
      decidedAt: new Date()
    }]);

    setPendingActions(pendingActions.filter(a => a.id !== id));
    
    toast.success(approved ? 
      `✅ Action confirmée: ${action.action}` : 
      `❌ Action rejetée: ${action.action}`
    );
  };

  const confirmAll = () => {
    pendingActions.forEach(action => {
      setCollaborations(prev => [...prev, {
        ...action,
        status: 'approved',
        decidedAt: new Date()
      }]);
    });
    setPendingActions([]);
    toast.success('✅ Toutes les actions confirmées');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              🤝 Hub Confirmations & Collaborations IA
            </h1>
            <p className="text-slate-400">
              Validation des actions proactives - QI Illimité
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              <Clock className="w-4 h-4 mr-1" />
              {pendingActions.length} en attente
            </Badge>
            <Button
              onClick={confirmAll}
              disabled={pendingActions.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Tout Confirmer
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">En Attente</p>
                  <p className="text-2xl font-bold text-yellow-400">{pendingActions.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Approuvées</p>
                  <p className="text-2xl font-bold text-green-400">
                    {collaborations.filter(c => c.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Rejetées</p>
                  <p className="text-2xl font-bold text-red-400">
                    {collaborations.filter(c => c.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Sources IA</p>
                  <p className="text-2xl font-bold text-purple-400">12+</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions en attente */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">⏳ Actions en Attente de Confirmation</h2>
        {pendingActions.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <p className="text-slate-400">Aucune action en attente</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingActions.map((action) => (
              <Card key={action.id} className="bg-slate-800/50 border-2 border-yellow-500/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-yellow-400 animate-pulse" />
                        <Badge variant="outline" className="border-purple-500 text-purple-400">
                          {action.source}
                        </Badge>
                        <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                          {action.type}
                        </Badge>
                        <Badge variant="outline" className="border-green-500 text-green-400">
                          QI: {action.qi}
                        </Badge>
                      </div>
                      <p className="text-white font-medium mb-1">{action.action}</p>
                      <p className="text-xs text-slate-400">
                        Demandé il y a {Math.floor((new Date() - action.timestamp) / 1000)}s
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => confirmAction(action.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button
                        onClick={() => confirmAction(action.id, false)}
                        variant="destructive"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Historique */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4">📜 Historique des Collaborations</h2>
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {collaborations.map((collab) => (
              <Card key={collab.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {collab.status === 'approved' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm text-white">{collab.action}</p>
                        <p className="text-xs text-slate-400">
                          {collab.source} • {new Date(collab.decidedAt).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={collab.status === 'approved' 
                        ? 'border-green-500 text-green-400'
                        : 'border-red-500 text-red-400'
                      }
                    >
                      {collab.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}