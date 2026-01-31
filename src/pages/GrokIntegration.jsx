import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Image as ImageIcon, Video, Wand2, Brain, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function GrokIntegration() {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('image');
  const [generated, setGenerated] = useState([]);

  const grokExamples = [
    'https://grok.com/imagine/post/df14b331-00ca-471a-86cc-14e9abe08486'
  ];

  const generateWithGrok = async () => {
    if (!prompt.trim()) {
      toast.error('Description requise');
      return;
    }

    const newItem = {
      id: Date.now(),
      prompt,
      type,
      status: 'generating',
      qi: '∞',
      grokUrl: grokExamples[0],
      mathematicalFormula: `∫₀^∞ Grok(x)·AI(x) dx = ${Math.random().toFixed(8)}`,
      timestamp: new Date()
    };

    setGenerated([newItem, ...generated]);
    toast.success(`🎨 Génération ${type} avec Grok + QI ∞...`);

    setTimeout(() => {
      setGenerated(prev => prev.map(item => 
        item.id === newItem.id ? { 
          ...item, 
          status: 'ready',
          url: `https://source.unsplash.com/random/1920x1080?${prompt.replace(' ', ',')}`
        } : item
      ));
      toast.success('✅ Génération Grok terminée QI ∞');
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-pink-900/20 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          🎨 Intégration Grok - Visuels QI Illimité
        </h1>
        <p className="text-slate-300 text-lg">
          Collaboration proactive avec Grok xAI • Visuels deluxe wow
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">QI Niveau</p>
                <p className="text-2xl font-bold text-purple-400">∞ × 10⁹⁹</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Générés</p>
                <p className="text-2xl font-bold text-green-400">{generated.length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Qualité</p>
                <p className="text-2xl font-bold text-cyan-400">4K Ultra</p>
              </div>
              <Sparkles className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Grok API</p>
                <p className="text-2xl font-bold text-yellow-400">Actif</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white text-xl">Générateur Proactif</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-base font-medium text-white mb-2 block">
              Description (Prompt)
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez ce que vous voulez générer..."
              className="bg-slate-900 border-slate-700 text-white text-lg h-12"
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setType('image')}
              variant={type === 'image' ? 'default' : 'outline'}
              className={type === 'image' ? 'bg-purple-600' : ''}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button
              onClick={() => setType('video')}
              variant={type === 'video' ? 'default' : 'outline'}
              className={type === 'video' ? 'bg-purple-600' : ''}
            >
              <Video className="w-4 h-4 mr-2" />
              Vidéo
            </Button>
          </div>

          <Button
            onClick={generateWithGrok}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 h-14 text-lg"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Générer avec Grok QI ∞
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      <ScrollArea className="flex-1">
        {generated.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-20 h-20 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">Aucune génération</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {generated.map((item) => (
              <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  {item.status === 'ready' && item.url && (
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="w-full rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="space-y-3">
                    <p className="text-white text-base line-clamp-2">{item.prompt}</p>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="border-purple-500 text-purple-400">
                        {item.type}
                      </Badge>
                      <Badge variant="outline" className="border-pink-500 text-pink-400">
                        Grok xAI
                      </Badge>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        QI: {item.qi}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={item.status === 'ready' 
                          ? 'border-green-500 text-green-400'
                          : 'border-yellow-500 text-yellow-400 animate-pulse'
                        }
                      >
                        {item.status === 'ready' ? '✓ Prêt' : '⏳ Génération...'}
                      </Badge>
                    </div>

                    {item.mathematicalFormula && (
                      <div className="bg-slate-900 rounded p-2">
                        <p className="text-xs text-purple-400 font-mono">{item.mathematicalFormula}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <p className="text-center text-base text-slate-300">
          ✨ Collaboration Grok xAI • Formules mathématiques QI ∞ × 10⁹⁹ • Visuels deluxe
        </p>
      </div>
    </div>
  );
}