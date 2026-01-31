import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Bot, User, AlertTriangle, CheckCircle, GitMerge, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function CollaborativeWorkspace() {
  const queryClient = useQueryClient();
  const [activeSession, setActiveSession] = useState(null);
  const [sessionName, setSessionName] = useState('');
  const [realTimeActions, setRealTimeActions] = useState([]);

  const { data: sessions = [] } = useQuery({
    queryKey: ['collaboration-sessions'],
    queryFn: () => base44.entities.CollaborationSession.list('-updated_date'),
    initialData: []
  });

  const { data: actions = [] } = useQuery({
    queryKey: ['collaborative-actions'],
    queryFn: () => base44.entities.CollaborativeAction.list('-timestamp'),
    initialData: [],
    refetchInterval: 2000 // Real-time refresh every 2s
  });

  const createSession = useMutation({
    mutationFn: (data) => base44.entities.CollaborationSession.create(data),
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ['collaboration-sessions'] });
      setActiveSession(session);
      toast.success('Session collaborative créée');
    }
  });

  const logAction = useMutation({
    mutationFn: (data) => base44.entities.CollaborativeAction.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborative-actions'] });
    }
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!activeSession) return;

    const unsubscribe = base44.entities.CollaborativeAction.subscribe((event) => {
      if (event.data.session_id === activeSession.id) {
        setRealTimeActions(prev => [event.data, ...prev.slice(0, 49)]);
        
        if (event.data.conflict_detected) {
          toast.warning(`⚠️ Conflit détecté: ${event.data.resource_type}`, {
            description: `Stratégie: ${event.data.conflict_resolution_strategy}`
          });
        }
      }
    });

    return unsubscribe;
  }, [activeSession]);

  const handleCreateSession = async () => {
    if (!sessionName.trim()) {
      toast.error('Nom de session requis');
      return;
    }

    await createSession.mutateAsync({
      name: sessionName,
      participants: [
        {
          id: 'user-1',
          type: 'human',
          name: 'Vous',
          role: 'owner',
          status: 'active'
        },
        {
          id: 'minima-x',
          type: 'agent',
          name: 'Minima-X',
          role: 'ai_assistant',
          status: 'active'
        }
      ],
      resources: [],
      conflicts: [],
      activity_log: [],
      status: 'active',
      start_time: new Date().toISOString()
    });

    setSessionName('');
  };

  const sessionActions = activeSession 
    ? actions.filter(a => a.session_id === activeSession.id)
    : [];

  const conflictStats = sessionActions.filter(a => a.conflict_detected).length;
  const totalActions = sessionActions.length;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-slate-300 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Espace Collaboratif Temps Réel</h1>
            <p className="text-sm text-slate-600">Co-travail humains + agents IA avec résolution intelligente de conflits</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Sessions */}
        <div className="w-80 border-r border-slate-300 flex flex-col">
          <div className="p-4 border-b border-slate-300">
            <h3 className="font-bold text-slate-900 mb-3">Sessions Actives</h3>
            <div className="flex gap-2">
              <Input
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Nom de session..."
                className="flex-1"
              />
              <Button onClick={handleCreateSession} size="sm">
                Créer
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => setActiveSession(session)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  activeSession?.id === session.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="font-medium text-slate-900 mb-1">{session.name}</div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={session.status === 'active' ? 'default' : 'outline'}>
                    {session.status}
                  </Badge>
                  <span className="text-slate-600">
                    {session.participants?.length || 0} participants
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Session Details */}
        <div className="flex-1 flex flex-col">
          {activeSession ? (
            <>
              {/* Session Info */}
              <div className="p-4 border-b border-slate-300 bg-slate-50">
                <h2 className="font-bold text-xl text-slate-900 mb-3">{activeSession.name}</h2>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-white rounded-lg border border-slate-300">
                    <div className="text-2xl font-bold text-blue-600">{totalActions}</div>
                    <div className="text-xs text-slate-600">Actions totales</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-300">
                    <div className="text-2xl font-bold text-orange-600">{conflictStats}</div>
                    <div className="text-xs text-slate-600">Conflits détectés</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-300">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.floor((totalActions - conflictStats) / totalActions * 100) || 0}%
                    </div>
                    <div className="text-xs text-slate-600">Taux succès</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-300">
                    <div className="text-2xl font-bold text-purple-600">
                      {activeSession.participants?.length || 0}
                    </div>
                    <div className="text-xs text-slate-600">Participants</div>
                  </div>
                </div>

                {/* Participants */}
                <div className="flex gap-2">
                  {activeSession.participants?.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-300">
                      {p.type === 'human' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      <span className="text-sm font-medium">{p.name}</span>
                      <Badge variant={p.status === 'active' ? 'default' : 'outline'} className="text-xs">
                        {p.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-slate-700" />
                  <h3 className="font-bold text-slate-900">Actions en temps réel (log immuable)</h3>
                </div>

                {realTimeActions.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-bold text-blue-900 mb-1">🔄 Mises à jour temps réel</div>
                    <div className="text-xs text-blue-700">
                      {realTimeActions.length} nouvelles actions depuis ouverture
                    </div>
                  </div>
                )}

                {sessionActions.map((action, idx) => (
                  <div
                    key={action.id || idx}
                    className={`p-3 rounded-lg border-l-4 ${
                      action.conflict_detected
                        ? 'bg-orange-50 border-orange-500'
                        : 'bg-slate-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {action.conflict_detected ? (
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        ) : action.action_type === 'merge' ? (
                          <GitMerge className="w-5 h-5 text-green-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900">
                            {action.action_type}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {action.resource_type}
                          </Badge>
                          <Badge variant={action.actor_type === 'human' ? 'default' : 'outline'} className="text-xs">
                            {action.actor_type === 'human' ? 'Humain' : 'IA'}
                          </Badge>
                        </div>
                        
                        {action.conflict_detected && (
                          <div className="text-sm text-orange-800 mb-1">
                            ⚠️ Conflit résolu via: <strong>{action.conflict_resolution_strategy}</strong>
                          </div>
                        )}

                        <div className="text-xs text-slate-600">
                          {new Date(action.timestamp || action.created_date).toLocaleString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </div>

                        {action.merge_details && (
                          <details className="mt-2 text-xs">
                            <summary className="cursor-pointer text-blue-600 font-medium">
                              Détails du merge
                            </summary>
                            <pre className="mt-1 p-2 bg-white rounded border border-slate-300 overflow-x-auto">
                              {JSON.stringify(action.merge_details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {sessionActions.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Aucune action dans cette session
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Sélectionnez ou créez une session
                </h3>
                <p className="text-sm text-slate-600">
                  Les sessions collaboratives permettent le co-travail temps réel<br/>
                  avec résolution automatique des conflits
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}