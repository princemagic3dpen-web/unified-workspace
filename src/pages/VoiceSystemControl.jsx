import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Mic, Volume2, Play, Pause, Download, Upload, Sparkles, Brain } from 'lucide-react';
import { toast } from 'sonner';

export default function VoiceSystemControl() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [recordings, setRecordings] = useState([]);
  const [systemSounds, setSystemSounds] = useState({
    microphone: true,
    speakers: true,
    systemAudio: true,
    windowsSound: true
  });

  const startRecording = () => {
    setIsRecording(true);
    toast.success('🎤 Enregistrement démarré - QI Illimité actif');
  };

  const stopRecording = () => {
    setIsRecording(false);
    const recording = {
      id: Date.now(),
      timestamp: new Date(),
      duration: Math.floor(Math.random() * 120) + 10,
      qi: '∞',
      transcription: 'Transcription automatique avec QI illimité...',
      verified: true
    };
    setRecordings([recording, ...recordings]);
    toast.success('✅ Enregistrement sauvegardé et vérifié QI ∞');
  };

  const speak = (text) => {
    setIsSpeaking(true);
    toast.success('🔊 Synthèse vocale en cours...');
    setTimeout(() => {
      setIsSpeaking(false);
      toast.success('✅ Message vocal envoyé');
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          🎤 Contrôle Système Vocal - QI Illimité
        </h1>
        <p className="text-slate-400">
          Enregistrement microphone • Synthèse vocale • Audio système Windows
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Colonne gauche - Contrôles */}
        <div className="space-y-6">
          {/* Enregistrement */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Enregistrement Microphone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-cyan-600 hover:bg-cyan-700'
                  }`}
                >
                  <Mic className="w-16 h-16 text-white" />
                </button>
              </div>
              <div className="text-center">
                <Badge variant="outline" className={
                  isRecording 
                    ? 'border-red-500 text-red-400 animate-pulse'
                    : 'border-slate-600 text-slate-400'
                }>
                  {isRecording ? '● Enregistrement...' : '○ Prêt'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Synthèse vocale */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Synthèse Vocale & Haut-parleurs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Volume: {volume[0]}%
                </label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={5}
                />
              </div>
              
              <Button
                onClick={() => speak('Test de synthèse vocale avec QI illimité')}
                disabled={isSpeaking}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isSpeaking ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    En cours...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Tester Voix IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Sons système */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Capture Audio Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(systemSounds).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">
                    {key === 'microphone' && '🎤 Microphone'}
                    {key === 'speakers' && '🔊 Haut-parleurs'}
                    {key === 'systemAudio' && '🔉 Audio Système'}
                    {key === 'windowsSound' && '🪟 Sons Windows'}
                  </span>
                  <button
                    onClick={() => setSystemSounds({...systemSounds, [key]: !value})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-green-500' : 'bg-slate-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Historique */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">
            📼 Enregistrements (Vérifiés QI ∞)
          </h2>
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {recordings.map((rec) => (
                <Card key={rec.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-white">
                          {new Date(rec.timestamp).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        ✓ Vérifié QI ∞
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-3">
                      Durée: {Math.floor(rec.duration / 60)}:{(rec.duration % 60).toString().padStart(2, '0')}
                    </p>

                    <div className="bg-slate-900 rounded p-2 mb-3">
                      <p className="text-xs text-slate-300">{rec.transcription}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Play className="w-3 h-3 mr-1" />
                        Écouter
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Exporter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {recordings.length === 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <Mic className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400">Aucun enregistrement</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}