import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { base44 } from '@/api/base44Client';
import { Box, Sparkles, Loader2, Gamepad2, Code } from 'lucide-react';
import { toast } from 'sonner';

export default function GameWorldGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedWorld, setGeneratedWorld] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setLoading(true);
    try {
      const world = await base44.integrations.Core.InvokeLLM({
        prompt: `Génère un MONDE 3D / JEU VIDÉO complet et jouable pour: "${prompt}"
        
        Retourne JSON ULTRA DÉTAILLÉ avec:
        {
          "game_title": "Titre du jeu",
          "genre": "FPS/RPG/Platformer/Sandbox/etc",
          "world_description": "Description monde",
          "environment": {
            "terrain_type": "Montagnes/Plaines/Océan/Ville/etc",
            "weather_system": "Dynamique pluie/neige/soleil",
            "day_night_cycle": true,
            "atmosphere": "Description atmosphère"
          },
          "objects_3d": [
            {
              "name": "Objet (ex: Arbre, Bâtiment, NPC)",
              "type": "mesh/sprite/particle",
              "position": {"x": 0, "y": 0, "z": 0},
              "rotation": {"x": 0, "y": 0, "z": 0},
              "scale": {"x": 1, "y": 1, "z": 1},
              "material": "PBR/Standard/Toon",
              "texture": "Description texture",
              "physics": "Static/Dynamic/Kinematic",
              "collider": "Box/Sphere/Mesh"
            }
          ],
          "lighting": [
            {
              "type": "Directional/Point/Spot",
              "color": "#ffffff",
              "intensity": 1.0,
              "position": {"x": 0, "y": 10, "z": 0},
              "shadows": true
            }
          ],
          "player_controller": {
            "movement_speed": 5.0,
            "jump_force": 10.0,
            "camera_type": "FirstPerson/ThirdPerson",
            "controls": {
              "forward": "W/Z",
              "backward": "S",
              "left": "A/Q",
              "right": "D",
              "jump": "Space",
              "interact": "E"
            }
          },
          "game_mechanics": [
            "Mécanique de jeu 1",
            "Mécanique de jeu 2"
          ],
          "npcs": [
            {
              "name": "NPC Name",
              "role": "Ennemi/Allié/Neutre",
              "ai_behavior": "Patrouille/Hostile/Passif",
              "dialogue": ["Ligne 1", "Ligne 2"]
            }
          ],
          "audio": {
            "ambient_sound": "Description son ambiant",
            "music_theme": "Style musical",
            "sfx": ["Son 1", "Son 2"]
          },
          "performance": {
            "target_fps": 60,
            "lod_system": true,
            "occlusion_culling": true,
            "quality_preset": "Ultra/High/Medium/Low"
          },
          "threejs_code": "Code Three.js fonctionnel complet"
        }`,
        response_json_schema: {
          type: "object",
          properties: {
            game_title: {type: "string"},
            genre: {type: "string"},
            world_description: {type: "string"},
            environment: {type: "object"},
            objects_3d: {type: "array"},
            lighting: {type: "array"},
            player_controller: {type: "object"},
            game_mechanics: {type: "array"},
            npcs: {type: "array"},
            audio: {type: "object"},
            performance: {type: "object"},
            threejs_code: {type: "string"}
          }
        }
      });

      setGeneratedWorld(world);
      toast.success('Monde 3D généré!');
    } catch (error) {
      toast.error('Erreur génération');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/95 via-green-900/95 to-slate-900/95 backdrop-blur-xl p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Générateur Jeux Vidéo & Mondes 3D</h1>
            <p className="text-slate-400 text-sm">Depuis texte ou images • Qualité atomique • Physique réaliste</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Description du Monde/Jeu</h3>
            
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Monde 3D style Minecraft avec montagnes enneigées, forêts denses, villages médiévaux, rivières, grottes, système jour/nuit, physique réaliste, NPCs interactifs..."
              className="min-h-[200px] bg-slate-900/50 border-slate-700 text-white resize-none mb-4"
            />

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération monde 3D...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer Monde 3D / Jeu
                </>
              )}
            </Button>

            <div className="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
              <p className="text-xs text-green-300 mb-2">🎮 Technologies:</p>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• <strong>Three.js</strong> - Rendu 3D temps réel</li>
                <li>• <strong>Cannon.js</strong> - Physique réaliste</li>
                <li>• <strong>React Three Fiber</strong></li>
                <li>• <strong>Unity WebGL</strong> (export)</li>
              </ul>
            </div>
          </Card>

          {/* Preview */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Monde 3D Généré</h3>
            
            {!generatedWorld ? (
              <div className="h-[400px] flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                <div className="text-center">
                  <Box className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Le monde 3D apparaîtra ici</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-auto">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="text-xl text-white font-bold mb-2">{generatedWorld.game_title}</h4>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">{generatedWorld.genre}</span>
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      {generatedWorld.objects_3d?.length || 0} objets 3D
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{generatedWorld.world_description}</p>
                </div>

                {/* Environment */}
                <div className="bg-slate-900/30 p-4 rounded-lg">
                  <h5 className="text-white font-semibold mb-2">🌍 Environnement</h5>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p>🏔️ Terrain: {generatedWorld.environment?.terrain_type}</p>
                    <p>🌦️ Météo: {generatedWorld.environment?.weather_system}</p>
                    <p>☀️ Cycle: {generatedWorld.environment?.day_night_cycle ? 'Jour/Nuit dynamique' : 'Fixe'}</p>
                  </div>
                </div>

                {/* Player */}
                <div className="bg-slate-900/30 p-4 rounded-lg">
                  <h5 className="text-white font-semibold mb-2">🎮 Contrôles Joueur</h5>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p>Vitesse: {generatedWorld.player_controller?.movement_speed}</p>
                    <p>Caméra: {generatedWorld.player_controller?.camera_type}</p>
                    <p>Saut: {generatedWorld.player_controller?.jump_force}</p>
                  </div>
                </div>

                {/* Mechanics */}
                {generatedWorld.game_mechanics?.length > 0 && (
                  <div className="bg-slate-900/30 p-4 rounded-lg">
                    <h5 className="text-white font-semibold mb-2">⚙️ Mécaniques de Jeu</h5>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {generatedWorld.game_mechanics.map((m, i) => (
                        <li key={i}>• {m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code */}
                {generatedWorld.threejs_code && (
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-green-400" />
                      <h5 className="text-white font-semibold">Code Three.js</h5>
                    </div>
                    <pre className="text-xs text-slate-300 overflow-auto max-h-[200px] bg-slate-950 p-3 rounded">
                      {generatedWorld.threejs_code}
                    </pre>
                  </div>
                )}

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Box className="w-4 h-4 mr-2" />
                  Ouvrir dans Éditeur 3D
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}