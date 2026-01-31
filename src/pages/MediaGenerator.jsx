import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { base44 } from '@/api/base44Client';
import { Image, Video, Box, Sparkles, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function MediaGenerator() {
  const [activeTab, setActiveTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState(null);
  const [referenceImages, setReferenceImages] = useState([]);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setLoading(true);
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Qualité 4K ultra détaillée, réaliste, professionnel, cinématique: ${prompt}`,
        existing_image_urls: referenceImages.length > 0 ? referenceImages : undefined
      });

      setGeneratedMedia(result.url);
      toast.success('Image 4K générée avec succès!');
    } catch (error) {
      toast.error('Erreur génération image');
      console.error(error);
    }
    setLoading(false);
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setLoading(true);
    try {
      toast.info('Génération vidéo via Runway ML/Pika Labs...');
      
      // Utilisation LLM pour générer script vidéo + instructions
      const videoScript = await base44.integrations.Core.InvokeLLM({
        prompt: `Génère un script vidéo professionnel détaillé pour: "${prompt}"
        
        Format JSON:
        {
          "scenes": [
            {
              "duration": "3s",
              "description": "...",
              "camera_movement": "...",
              "lighting": "...",
              "style": "..."
            }
          ],
          "music_mood": "...",
          "transitions": "...",
          "total_duration": "30s"
        }`,
        response_json_schema: {
          type: "object",
          properties: {
            scenes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  duration: {type: "string"},
                  description: {type: "string"},
                  camera_movement: {type: "string"},
                  lighting: {type: "string"},
                  style: {type: "string"}
                }
              }
            },
            music_mood: {type: "string"},
            transitions: {type: "string"},
            total_duration: {type: "string"}
          }
        }
      });

      setGeneratedMedia({
        type: 'video',
        script: videoScript,
        instructions: `Pour générer cette vidéo:
1. Utilisez Runway ML Gen-2: https://runwayml.com
2. Ou Pika Labs: https://pika.art
3. Ou Stable Video Diffusion

Script: ${JSON.stringify(videoScript, null, 2)}`
      });

      toast.success('Script vidéo généré! Utilisez les outils suggérés.');
    } catch (error) {
      toast.error('Erreur génération vidéo');
      console.error(error);
    }
    setLoading(false);
  };

  const handleGenerate3D = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setLoading(true);
    try {
      const world3D = await base44.integrations.Core.InvokeLLM({
        prompt: `Génère un monde 3D/jeu vidéo complet pour: "${prompt}"
        
        Retourne JSON avec:
        - Architecture 3D (objets, positions, matériaux)
        - Système physique (gravité, collisions)
        - Lumières et caméras
        - Interactions joueur
        - Code Three.js fonctionnel
        - Qualité atomique photo-réaliste`,
        response_json_schema: {
          type: "object",
          properties: {
            scene_description: {type: "string"},
            objects_3d: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {type: "string"},
                  position: {type: "object"},
                  rotation: {type: "object"},
                  scale: {type: "object"},
                  material: {type: "string"},
                  texture: {type: "string"}
                }
              }
            },
            lighting: {type: "array"},
            physics: {type: "object"},
            player_controls: {type: "object"},
            threejs_code: {type: "string"}
          }
        }
      });

      setGeneratedMedia({
        type: '3d',
        world: world3D
      });

      toast.success('Monde 3D généré!');
    } catch (error) {
      toast.error('Erreur génération 3D');
      console.error(error);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setReferenceImages(prev => [...prev, result.file_url]);
      toast.success('Image référence ajoutée');
    } catch (error) {
      toast.error('Erreur upload');
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl p-6">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Générateur Média IA</h1>
            <p className="text-slate-400 text-sm">Images 4K, Vidéos, Mondes 3D & Jeux - Qualité Atomique</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
            <TabsTrigger value="image" className="data-[state=active]:bg-purple-600">
              <Image className="w-4 h-4 mr-2" />
              Images 4K
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-purple-600">
              <Video className="w-4 h-4 mr-2" />
              Vidéos
            </TabsTrigger>
            <TabsTrigger value="3d" className="data-[state=active]:bg-purple-600">
              <Box className="w-4 h-4 mr-2" />
              Mondes 3D & Jeux
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-6 flex gap-6">
            {/* Left: Input */}
            <Card className="flex-1 bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
              
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeTab === 'image' ? "Ex: Paysage futuriste cyberpunk avec néons, pluie, 4K ultra détaillé..." :
                  activeTab === 'video' ? "Ex: Vidéo cinématique d'un robot dans une ville futuriste, mouvement caméra fluide..." :
                  "Ex: Monde 3D style Minecraft avec physique réaliste, montagnes, rivières, arbres..."
                }
                className="min-h-[200px] bg-slate-900/50 border-slate-700 text-white resize-none"
              />

              {activeTab === 'image' && (
                <div className="mt-4">
                  <label className="text-sm text-slate-400 mb-2 block">Images de référence (optionnel)</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                  {referenceImages.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {referenceImages.map((url, i) => (
                        <img key={i} src={url} className="w-16 h-16 rounded object-cover" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={
                  activeTab === 'image' ? handleGenerateImage :
                  activeTab === 'video' ? handleGenerateVideo :
                  handleGenerate3D
                }
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer {activeTab === 'image' ? 'Image 4K' : activeTab === 'video' ? 'Vidéo' : 'Monde 3D'}
                  </>
                )}
              </Button>
            </Card>

            {/* Right: Preview */}
            <Card className="flex-1 bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Résultat</h3>
              
              {!generatedMedia ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Votre média apparaîtra ici</p>
                  </div>
                </div>
              ) : generatedMedia.type === 'video' ? (
                <div className="space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Script Vidéo Généré</h4>
                    <pre className="text-slate-300 text-xs overflow-auto max-h-[400px]">
                      {JSON.stringify(generatedMedia.script, null, 2)}
                    </pre>
                  </div>
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                    <p className="text-sm text-slate-300 whitespace-pre-line">
                      {generatedMedia.instructions}
                    </p>
                  </div>
                </div>
              ) : generatedMedia.type === '3d' ? (
                <div className="space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Monde 3D Généré</h4>
                    <pre className="text-slate-300 text-xs overflow-auto max-h-[400px]">
                      {JSON.stringify(generatedMedia.world, null, 2)}
                    </pre>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Box className="w-4 h-4 mr-2" />
                    Ouvrir dans Éditeur 3D
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <img src={generatedMedia} className="w-full rounded-lg shadow-2xl" alt="Generated" />
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger Image 4K
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  );
}