import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import { Video, Sparkles, Loader2, Image as ImageIcon, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState(null);
  const [sourceImages, setSourceImages] = useState([]);

  const handleGenerateFromText = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setLoading(true);
    try {
      toast.info('Génération script vidéo professionnel...');
      
      const script = await base44.integrations.Core.InvokeLLM({
        prompt: `Génère un script vidéo cinématique ULTRA DÉTAILLÉ pour: "${prompt}"
        
        Retourne JSON avec:
        {
          "title": "Titre vidéo",
          "duration": "30-60s",
          "scenes": [
            {
              "scene_number": 1,
              "duration": "5s",
              "description": "Description visuelle ultra-détaillée",
              "camera_movement": "Travelling avant fluide",
              "lighting": "Éclairage cinématique golden hour",
              "style": "Style visuel photoréaliste 4K",
              "audio": "Ambiance sonore",
              "transitions": "Transition vers scène suivante"
            }
          ],
          "music_style": "Style musical épique/dramatique/joyeux",
          "color_grading": "Étalonnage couleur cinématique",
          "resolution": "4K (3840x2160)",
          "fps": "60fps",
          "total_scenes": 5
        }`,
        response_json_schema: {
          type: "object",
          properties: {
            title: {type: "string"},
            duration: {type: "string"},
            scenes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  scene_number: {type: "number"},
                  duration: {type: "string"},
                  description: {type: "string"},
                  camera_movement: {type: "string"},
                  lighting: {type: "string"},
                  style: {type: "string"},
                  audio: {type: "string"},
                  transitions: {type: "string"}
                }
              }
            },
            music_style: {type: "string"},
            color_grading: {type: "string"},
            resolution: {type: "string"},
            fps: {type: "string"},
            total_scenes: {type: "number"}
          }
        }
      });

      setVideoScript(script);
      toast.success('Script vidéo généré!');
    } catch (error) {
      toast.error('Erreur génération');
      console.error(error);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setSourceImages(prev => [...prev, result.file_url]);
      toast.success('Image ajoutée');
    } catch (error) {
      toast.error('Erreur upload');
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur-xl p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Générateur de Vidéos IA</h1>
            <p className="text-slate-400 text-sm">Depuis texte ou images • 4K 60fps • Qualité cinématique</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Description Vidéo</h3>
            
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Vidéo cinématique d'un robot humanoïde marchant dans une ville futuriste sous la pluie, néons reflétés sur le sol, mouvement caméra fluide style Blade Runner, 60 secondes..."
              className="min-h-[150px] bg-slate-900/50 border-slate-700 text-white resize-none mb-4"
            />

            <div className="mb-4">
              <label className="text-sm text-slate-400 mb-2 block">Images sources (optionnel)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-slate-900/50 border-slate-700 text-white mb-2"
              />
              {sourceImages.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {sourceImages.map((url, i) => (
                    <img key={i} src={url} className="w-16 h-16 rounded object-cover" />
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleGenerateFromText}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération script...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer Script Vidéo
                </>
              )}
            </Button>

            <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
              <p className="text-xs text-blue-300 mb-2">🎬 Outils recommandés:</p>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• <strong>Runway Gen-2</strong>: runwayml.com</li>
                <li>• <strong>Pika Labs</strong>: pika.art</li>
                <li>• <strong>Stable Video Diffusion</strong></li>
                <li>• <strong>AnimateDiff</strong></li>
              </ul>
            </div>
          </Card>

          {/* Preview */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Script Généré</h3>
            
            {!videoScript ? (
              <div className="h-[400px] flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                <div className="text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Le script vidéo apparaîtra ici</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-auto">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">{videoScript.title}</h4>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span>⏱️ {videoScript.duration}</span>
                    <span>📹 {videoScript.resolution}</span>
                    <span>🎞️ {videoScript.fps}</span>
                    <span>🎬 {videoScript.total_scenes} scènes</span>
                  </div>
                </div>

                {videoScript.scenes?.map((scene, idx) => (
                  <div key={idx} className="bg-slate-900/30 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Scène {scene.scene_number}
                      </div>
                      <span className="text-xs text-slate-400">{scene.duration}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{scene.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div>📹 {scene.camera_movement}</div>
                      <div>💡 {scene.lighting}</div>
                      <div className="col-span-2">🎨 {scene.style}</div>
                    </div>
                  </div>
                ))}

                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                  <p className="text-xs text-blue-300 mb-1">🎵 Musique: {videoScript.music_style}</p>
                  <p className="text-xs text-blue-300">🎨 Étalonnage: {videoScript.color_grading}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}