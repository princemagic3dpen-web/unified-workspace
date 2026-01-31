import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function TasksPanel({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('-created_date'),
    initialData: []
  });

  const createTask = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tâche créée');
      setNewTaskTitle('');
    }
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tâche mise à jour');
    }
  });

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    // Calcul priorité mathématique
    const mathPriority = calculateMathematicalPriority(newTaskTitle);
    
    await createTask.mutateAsync({
      title: newTaskTitle,
      status: 'todo',
      priority: mathPriority > 0.7 ? 'high' : mathPriority > 0.4 ? 'medium' : 'low',
      mathematical_priority: mathPriority,
      ai_generated: false
    });
  };

  const calculateMathematicalPriority = (title) => {
    // Formule mathématique pour priorité basée sur mots clés
    const urgentWords = ['urgent', 'important', 'critique', 'rapidement', 'asap'];
    const score = urgentWords.reduce((acc, word) => 
      acc + (title.toLowerCase().includes(word) ? 0.3 : 0), 0
    );
    return Math.min(1, 0.5 + score);
  };

  const moveTask = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updates = { status: newStatus };
    if (newStatus === 'done') {
      updates.completed_date = new Date().toISOString();
    }

    updateTask.mutate({ id: taskId, data: updates });
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="p-4 border-b border-slate-300 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Gestionnaire de Tâches Intelligent</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-slate-300">
          <div className="flex gap-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Nouvelle tâche (l'IA calcule la priorité automatiquement)..."
              className="flex-1"
            />
            <Button onClick={handleAddTask} className="bg-blue-600">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
          {/* À faire */}
          <div className="flex flex-col bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-300">
              <Circle className="w-5 h-5 text-slate-600" />
              <h3 className="font-bold text-slate-900">À Faire</h3>
              <Badge variant="outline">{todoTasks.length}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {todoTasks.map(task => (
                <div
                  key={task.id}
                  className="p-3 bg-white rounded-lg border border-slate-300 hover:border-blue-500 transition-all cursor-pointer"
                  onClick={() => moveTask(task.id, 'in_progress')}
                >
                  <div className="font-medium text-sm text-slate-900 mb-1">{task.title}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      task.priority === 'urgent' ? 'destructive' :
                      task.priority === 'high' ? 'default' : 'outline'
                    } className="text-xs">
                      {task.priority}
                    </Badge>
                    {task.ai_generated && (
                      <Badge variant="outline" className="text-xs">IA</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* En cours */}
          <div className="flex flex-col bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-300">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-900">En Cours</h3>
              <Badge variant="outline">{inProgressTasks.length}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {inProgressTasks.map(task => (
                <div
                  key={task.id}
                  className="p-3 bg-white rounded-lg border-2 border-blue-500 hover:border-blue-600 transition-all cursor-pointer"
                  onClick={() => moveTask(task.id, 'done')}
                >
                  <div className="font-medium text-sm text-slate-900 mb-1">{task.title}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs bg-blue-600">
                      {task.priority}
                    </Badge>
                    {task.ai_generated && (
                      <Badge variant="outline" className="text-xs">IA</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminées */}
          <div className="flex flex-col bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-300">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-green-900">Terminées</h3>
              <Badge variant="outline">{doneTasks.length}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {doneTasks.map(task => (
                <div
                  key={task.id}
                  className="p-3 bg-white rounded-lg border border-green-500 opacity-75 hover:opacity-100 transition-all"
                >
                  <div className="font-medium text-sm text-slate-900 line-through mb-1">{task.title}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs text-green-700">
                      Terminée
                    </Badge>
                    {task.completed_date && (
                      <span className="text-xs text-slate-600">
                        {new Date(task.completed_date).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}