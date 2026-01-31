import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Bot, Plus, Play, Trash2, AlertTriangle, Calendar, FileText, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function ProactiveAgentsCreator() {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({
    name: '',
    triggers: [],
    actions: [],
    active: true
  });

  const triggerTypes = [
    { id: 'file_modified', name: 'Fichier modifié', icon: FileText },
    { id: 'event_created', name: 'Événement créé', icon: Calendar },
    { id: 'time_interval', name: 'Intervalle temps', icon: Calendar },
    { id: 'file_uploaded', name: 'Fichier uploadé', icon: FileText },
    { id: 'bug_detected', name: 'Bug détecté', icon: AlertTriangle }
  ];

  const actionTypes = [
    { id: 'send_notification', name: 'Envoyer notification', icon: Bell },
    { id: 'execute_script', name: 'Exécuter script', icon: Play },
    { id: 'generate_report', name: 'Générer rapport', icon: FileText },
    { id: 'auto_correct', name: 'Auto-corriger', icon: AlertTriangle }
  ];

  const addAgent = async () => {
    if (!newAgent.name.trim()) {
      toast.error('Nom requis');
      return;
    }

    const agent = { ...newAgent, id: Date.now(), created: new Date().toISOString() };
    setAgents(prev => [...prev, agent]);
    
    await base44.entities.File.create({
      name: `agent_${agent.id}.json`,
      file_type: 'other',
      content: JSON.stringify(agent, null, 2)
    });

    toast.success(`✅ Agent "${agent.name}" créé!`);
    setNewAgent({ name: '', triggers: [], actions: [], active: true });
  };

  const toggleAgent = async (id) => {
    setAgents(prev => prev.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
    toast.success('Agent mis à jour');
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">🤖 Création Agents IA Proactifs</h1>
            <p className="text-slate-400 text-sm">{agents.filter(a => a.active).length} agents actifs sur {agents.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Création */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4">➕ Nouvel Agent</h3>
            
            <div className="space-y-4">
              <Input
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                placeholder="Nom de l'agent..."
                className="bg-slate-900/50 border-slate-700 text-white"
              />

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Déclencheurs</label>
                <div className="space-y-2">
                  {triggerTypes.map(trigger => (
                    <div key={trigger.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                      <div className="flex items-center gap-2">
                        <trigger.icon className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-white">{trigger.name}</span>
                      </div>
                      <Switch
                        checked={newAgent.triggers.includes(trigger.id)}
                        onCheckedChange={(checked) => {
                          setNewAgent(prev => ({
                            ...prev,
                            triggers: checked 
                              ? [...prev.triggers, trigger.id]
                              : prev.triggers.filter(t => t !== trigger.id)
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Actions automatiques</label>
                <div className="space-y-2">
                  {actionTypes.map(action => (
                    <div key={action.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                      <div className="flex items-center gap-2">
                        <action.icon className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white">{action.name}</span>
                      </div>
                      <Switch
                        checked={newAgent.actions.includes(action.id)}
                        onCheckedChange={(checked) => {
                          setNewAgent(prev => ({
                            ...prev,
                            actions: checked 
                              ? [...prev.actions, action.id]
                              : prev.actions.filter(a => a !== action.id)
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={addAgent} className="w-full bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Créer Agent
              </Button>
            </div>
          </Card>

          {/* Liste */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4">📋 Agents Actifs</h3>
            <ScrollArea className="h-[600px] w-full">
              <div className="space-y-3">
                {agents.map(agent => (
                  <Card key={agent.id} className="bg-slate-900/50 p-4 border-purple-500/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold">{agent.name}</h4>
                        <p className="text-xs text-slate-500">{new Date(agent.created).toLocaleString('fr-FR')}</p>
                      </div>
                      <Switch
                        checked={agent.active}
                        onCheckedChange={() => toggleAgent(agent.id)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Déclencheurs ({agent.triggers.length}):</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.triggers.map(t => (
                            <span key={t} className="text-xs px-2 py-1 bg-purple-600/30 text-purple-300 rounded">
                              {triggerTypes.find(tt => tt.id === t)?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Actions ({agent.actions.length}):</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.actions.map(a => (
                            <span key={a} className="text-xs px-2 py-1 bg-green-600/30 text-green-300 rounded">
                              {actionTypes.find(at => at.id === a)?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}