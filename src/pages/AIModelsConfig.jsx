import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Brain, Plus, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AIModelsConfig() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    provider: 'huggingface',
    model_id: '',
    api_endpoint: '',
    is_free: true,
    capabilities: [],
    max_tokens: 4096,
    priority: 1,
    is_active: false
  });

  const { data: models = [] } = useQuery({
    queryKey: ['ai-models'],
    queryFn: () => base44.entities.AIModelConfig.list('priority'),
    initialData: []
  });

  const createModel = useMutation({
    mutationFn: (data) => base44.entities.AIModelConfig.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast.success('Modèle IA ajouté');
      setIsAdding(false);
      setNewModel({
        name: '',
        provider: 'huggingface',
        model_id: '',
        api_endpoint: '',
        is_free: true,
        capabilities: [],
        max_tokens: 4096,
        priority: 1,
        is_active: false
      });
    }
  });

  const updateModel = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AIModelConfig.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast.success('Modèle mis à jour');
    }
  });

  const deleteModel = useMutation({
    mutationFn: (id) => base44.entities.AIModelConfig.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast.success('Modèle supprimé');
    }
  });

  const presetModels = [
    { name: 'LLaMA 2 70B', provider: 'huggingface', model_id: 'meta-llama/Llama-2-70b-chat-hf', capabilities: ['text', 'reasoning'] },
    { name: 'Mistral 7B', provider: 'huggingface', model_id: 'mistralai/Mistral-7B-Instruct-v0.2', capabilities: ['text', 'code'] },
    { name: 'CodeLlama 34B', provider: 'huggingface', model_id: 'codellama/CodeLlama-34b-Instruct-hf', capabilities: ['code', 'text'] },
    { name: 'Phi-2', provider: 'huggingface', model_id: 'microsoft/phi-2', capabilities: ['text', 'reasoning', 'math'] },
    { name: 'Mixtral 8x7B', provider: 'together', model_id: 'mixtral-8x7b-32768', capabilities: ['text', 'reasoning', 'code'] }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-slate-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Configuration Modèles IA</h1>
            <p className="text-sm text-slate-600">APIs gratuites - LLaMA, Transformers, HuggingFace</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Add New Model */}
        {isAdding && (
          <div className="p-4 bg-slate-50 rounded-xl border-2 border-purple-200 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Ajouter un Modèle IA
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom du modèle</Label>
                <Input
                  value={newModel.name}
                  onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                  placeholder="LLaMA 2 70B"
                />
              </div>
              
              <div>
                <Label>Provider</Label>
                <Select value={newModel.provider} onValueChange={(v) => setNewModel({...newModel, provider: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="huggingface">HuggingFace</SelectItem>
                    <SelectItem value="ollama">Ollama (Local)</SelectItem>
                    <SelectItem value="together">Together AI</SelectItem>
                    <SelectItem value="groq">Groq</SelectItem>
                    <SelectItem value="replicate">Replicate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Model ID</Label>
                <Input
                  value={newModel.model_id}
                  onChange={(e) => setNewModel({...newModel, model_id: e.target.value})}
                  placeholder="meta-llama/Llama-2-70b-chat-hf"
                />
              </div>

              <div>
                <Label>Max Tokens</Label>
                <Input
                  type="number"
                  value={newModel.max_tokens}
                  onChange={(e) => setNewModel({...newModel, max_tokens: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <Label>API Endpoint (optionnel)</Label>
                <Input
                  value={newModel.api_endpoint}
                  onChange={(e) => setNewModel({...newModel, api_endpoint: e.target.value})}
                  placeholder="https://api.exemple.com/v1"
                />
              </div>

              <div>
                <Label>Priorité (1-5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={newModel.priority}
                  onChange={(e) => setNewModel({...newModel, priority: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => createModel.mutate(newModel)} className="bg-purple-600">
                <Check className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Preset Models */}
        {!isAdding && (
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Modèles Recommandés (Gratuits)</h3>
            <div className="grid grid-cols-2 gap-3">
              {presetModels.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => createModel.mutate(preset)}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                >
                  <div className="font-medium text-slate-900">{preset.name}</div>
                  <div className="text-xs text-slate-600">{preset.provider}</div>
                  <div className="flex gap-1 mt-2">
                    {preset.capabilities.map(cap => (
                      <Badge key={cap} variant="outline" className="text-xs">{cap}</Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Models */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Modèles Configurés ({models.length})</h3>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} size="sm" className="bg-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {models.map(model => (
              <div key={model.id} className="p-4 bg-white rounded-lg border border-slate-300 hover:border-purple-400 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">{model.name}</h4>
                    <p className="text-xs text-slate-600">{model.model_id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={model.is_active}
                      onCheckedChange={(checked) => updateModel.mutate({ id: model.id, data: { is_active: checked } })}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteModel.mutate(model.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2 items-center">
                  <Badge variant={model.is_active ? "default" : "outline"}>
                    {model.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                  <Badge variant="outline">{model.provider}</Badge>
                  {model.is_free && <Badge className="bg-green-100 text-green-800">Gratuit</Badge>}
                  <Badge variant="outline">Priorité: {model.priority}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}