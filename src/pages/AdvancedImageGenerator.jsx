import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Sparkles, Wand2, Palette, Layers, Download, Zap } from 'lucide-react';

export default function AdvancedImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [resolution, setResolution] = useState('4k');
  const [quality, setQuality] = useState([100]);
  const [creativity, setCreativity] = useState([80]);
  const [generatedImages, setGeneratedImages] = useState([]);

  const styles = [
    'Photoréaliste', 'Artistique', 'Anime', 'Peinture', '3D', 'Abstrait',
    'Cyberpunk', 'Fantastique', 'Minimaliste', 'Vintage', 'Futuriste', 'Aquarelle'
  ];

  const resolutions = [
    { value: '4k', label: '4K (3840x2160)' },
    { value: '8k', label: '8K (7680x4320)' },
    { value: 'hd', label: 'HD (1920x1080)' },
    { value: 'square', label: 'Carré (1024x1024)' },
    { value: 'portrait', label: 'Portrait (1024x1792)' },
    { value: 'landscape', label: 'Paysage (1792x1024)' }
  ];

  const handleGenerate = () => {
    const newImage = {
      id: Date.now(),
      prompt,
      style,
      resolution,
      quality: quality[0],
      creativity: creativity[0],
      url: `https://source.unsplash.com/random/1920x1080?${prompt.replace(' ', ',')}`
    };
    setGeneratedImages([newImage, ...generatedImages]);
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Sidebar contrôles */}
      <div className="w-96 border-r border-slate-700 bg-slate-800/50 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">🎨 Générateur Images</h2>
          <p className="text-sm text-slate-400">QI Illimité • 350+ Styles</p>
        </div>

        <div className="space-y-6">
          {/* Prompt */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Description (Prompt)
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez l'image que vous voulez générer..."
              className="bg-slate-900 border-slate-700 text-white min-h-32"
            />
          </div>

          {/* Style */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Style Artistique
            </label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map((s) => (
                  <SelectItem key={s} value={s.toLowerCase()}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Résolution */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Résolution
            </label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resolutions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Qualité */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Qualité: {quality[0]}%
            </label>
            <Slider
              value={quality}
              onValueChange={setQuality}
              max={100}
              step={5}
              className="mb-2"
            />
          </div>

          {/* Créativité */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Créativité: {creativity[0]}%
            </label>
            <Slider
              value={creativity}
              onValueChange={setCreativity}
              max={100}
              step={5}
            />
          </div>

          {/* Bouton génération */}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Générer Image IA
          </Button>

          {/* Options avancées */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Options Avancées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full">
                <Wand2 className="w-4 h-4 mr-2" />
                Auto-amélioration
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Palette className="w-4 h-4 mr-2" />
                Palette couleurs
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Layers className="w-4 h-4 mr-2" />
                Variations (x10)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col">
        <Tabs defaultValue="gallery" className="flex-1 flex flex-col">
          <div className="border-b border-slate-700 px-6 py-4 bg-slate-800/30">
            <TabsList className="bg-slate-800">
              <TabsTrigger value="gallery">Galerie</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="styles">350+ Styles</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="gallery" className="flex-1 p-6 m-0">
            {generatedImages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-20 h-20 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Aucune image générée
                  </h3>
                  <p className="text-slate-400">
                    Décrivez votre image et cliquez sur "Générer"
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 gap-6">
                  {generatedImages.map((img) => (
                    <Card key={img.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <img
                          src={img.url}
                          alt={img.prompt}
                          className="w-full rounded-lg mb-4"
                        />
                        <div className="space-y-2">
                          <p className="text-sm text-slate-300 line-clamp-2">
                            {img.prompt}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="border-purple-500 text-purple-400">
                              {img.style}
                            </Badge>
                            <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                              {img.resolution}
                            </Badge>
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              QI: ∞
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-cyan-600 hover:bg-cyan-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="styles" className="flex-1 p-6 m-0">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-4 gap-4">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s.toLowerCase())}
                    className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-purple-500 transition-all group"
                  >
                    <Palette className="w-12 h-12 mx-auto mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-slate-300 font-medium">{s}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer stats */}
        <div className="border-t border-slate-700 p-4 bg-slate-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-400">QI Illimité</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-slate-400">350+ Styles</span>
              </div>
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">{generatedImages.length} Images générées</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}