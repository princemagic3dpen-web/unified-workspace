import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Settings,
  Download,
  Share2,
  Mic,
  MicOff,
  FileText,
  Image as ImageIcon,
  Video,
  Presentation
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function MediaViewer({
  file,
  files = [],
  isOpen,
  onClose,
  onNext,
  onPrevious
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [voices, setVoices] = useState([]);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const speechRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        const frVoice = availableVoices.find(v => v.lang.startsWith('fr'));
        setSelectedVoice(frVoice?.name || availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) setIsFullscreen(false);
          else if (isPresentationMode) setIsPresentationMode(false);
          else onClose();
          break;
        case 'ArrowLeft':
          if (isPresentationMode && currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
          } else {
            onPrevious?.();
          }
          break;
        case 'ArrowRight':
          if (isPresentationMode) {
            setCurrentSlide(prev => prev + 1);
          } else {
            onNext?.();
          }
          break;
        case ' ':
          e.preventDefault();
          if (file?.file_type === 'video' || file?.file_type === 'audio') {
            setIsPlaying(!isPlaying);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, isPresentationMode, currentSlide, isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const startTextToSpeech = () => {
    if (!file?.content && !file?.name) return;
    
    window.speechSynthesis?.cancel();
    
    const utterance = new SpeechSynthesisUtterance(file.content || file.name);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    
    speechRef.current = utterance;
    window.speechSynthesis?.speak(utterance);
    setIsReading(true);
  };

  const stopTextToSpeech = () => {
    window.speechSynthesis?.cancel();
    setIsReading(false);
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentIndex = files.findIndex(f => f.id === file?.id);

  const renderContent = () => {
    if (!file) return null;

    switch (file.file_type) {
      case 'image':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-full"
          >
            <img
              src={file.file_url}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        );

      case 'video':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={file.file_url}
              className="max-w-full max-h-full rounded-xl shadow-2xl"
              onTimeUpdate={handleVideoTimeUpdate}
              onLoadedMetadata={handleVideoLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              muted={isMuted}
            />
            
            {/* Video controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isPlaying) videoRef.current?.pause();
                    else videoRef.current?.play();
                  }}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={([value]) => {
                      if (videoRef.current) videoRef.current.currentTime = value;
                    }}
                    className="cursor-pointer"
                  />
                </div>
                
                <span className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl mb-8">
              <Volume2 className="w-24 h-24 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{file.name}</h3>
            
            <audio
              ref={audioRef}
              src={file.file_url}
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            />
            
            <div className="w-full max-w-md mt-8 space-y-4">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                onValueChange={([value]) => {
                  if (audioRef.current) audioRef.current.currentTime = value;
                }}
              />
              
              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime -= 10;
                }}>
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button
                  size="lg"
                  onClick={() => {
                    if (isPlaying) audioRef.current?.pause();
                    else audioRef.current?.play();
                    setIsPlaying(!isPlaying);
                  }}
                  className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                
                <Button variant="ghost" size="icon" onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime += 10;
                }}>
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 'document':
      case 'text':
      case 'pdf':
        return (
          <div className="h-full flex flex-col">
            {/* Text controls */}
            <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center gap-4">
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="w-64 rounded-xl">
                  <SelectValue placeholder="Sélectionner une voix" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map(voice => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={isReading ? stopTextToSpeech : startTextToSpeech}
                className={`rounded-xl ${isReading ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-cyan-500 to-blue-600'}`}
              >
                {isReading ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Arrêter
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Lire à voix haute
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setIsPresentationMode(true)}
                className="rounded-xl"
              >
                <Presentation className="w-4 h-4 mr-2" />
                Mode présentation
              </Button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-8">
              <div className="max-w-3xl mx-auto prose prose-slate">
                {file.content ? (
                  <ReactMarkdown>{file.content}</ReactMarkdown>
                ) : file.file_url ? (
                  <iframe 
                    src={file.file_url} 
                    className="w-full h-[80vh] rounded-xl border-0"
                  />
                ) : (
                  <p className="text-slate-500">Aucun contenu à afficher</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'presentation':
        return (
          <div className="h-full flex items-center justify-center">
            {file.file_url ? (
              <iframe 
                src={file.file_url} 
                className="w-full h-full border-0 rounded-xl"
              />
            ) : (
              <div className="text-center">
                <Presentation className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Présentation: {file.name}</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <FileText className="w-24 h-24 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">{file.name}</h3>
            <p className="text-slate-500 mt-2">Type: {file.file_type || 'Inconnu'}</p>
            {file.file_url && (
              <Button
                variant="outline"
                className="mt-4 rounded-xl"
                onClick={() => window.open(file.file_url, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            )}
          </div>
        );
    }
  };

  if (!isOpen || !file) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isPresentationMode ? 'bg-black' : 'bg-black/80 backdrop-blur-sm'
        }`}
        ref={containerRef}
      >
        {/* Header */}
        {!isPresentationMode && (
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent z-10">
            <div className="flex items-center gap-4">
              <h2 className="text-white text-lg font-semibold truncate max-w-md">
                {file.name}
              </h2>
              {files.length > 1 && (
                <span className="text-white/60 text-sm">
                  {currentIndex + 1} / {files.length}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20 rounded-xl"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </Button>
              
              {file.file_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(file.file_url, '_blank')}
                  className="text-white hover:bg-white/20 rounded-xl"
                >
                  <Download className="w-5 h-5" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Navigation arrows */}
        {files.length > 1 && !isPresentationMode && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-xl w-12 h-12 z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              disabled={currentIndex === files.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-xl w-12 h-12 z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </>
        )}

        {/* Content */}
        <div className={`w-full h-full ${isPresentationMode ? '' : 'p-16'}`}>
          <div className={`w-full h-full ${isPresentationMode ? '' : 'bg-white rounded-2xl shadow-2xl overflow-hidden'}`}>
            {renderContent()}
          </div>
        </div>

        {/* Presentation mode exit hint */}
        {isPresentationMode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            Appuyez sur Échap pour quitter • ← → pour naviguer
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}