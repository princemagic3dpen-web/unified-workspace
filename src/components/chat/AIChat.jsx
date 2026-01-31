import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Mic,
  MicOff,
  Music,
  ListTodo,
  Sparkles,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import VoiceTranscription from './VoiceTranscription';
import TasksPanel from './TasksPanel';
import { useVoiceEngine, VOICE_EMOTIONS } from '../ai/VoiceEngine';
import { intelligenceEngine } from '../ai/IntelligenceEngine';

export default function AIChat({ 
  conversations = [],
  currentConversation,
  onNewConversation,
  onSelectConversation,
  onSendMessage,
  isLoading,
  context 
}) {
  const [message, setMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [humanTranscriptions, setHumanTranscriptions] = useState([]);
  const [aiTranscriptions, setAiTranscriptions] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef(null);
  const scrollRef2 = useRef(null);
  const inputRef = useRef(null);
  
  // Moteurs IA
  const { speak, stopSpeaking, isAvailable: voiceAvailable } = useVoiceEngine();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (scrollRef2.current) {
      scrollRef2.current.scrollTop = scrollRef2.current.scrollHeight;
    }
  }, [currentConversation?.messages, humanTranscriptions, aiTranscriptions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message);
    setMessage('');
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVoiceTranscription = async (transcription) => {
    if (transcription.speaker_type === 'human') {
      setHumanTranscriptions(prev => [transcription, ...prev]);
      
      // Envoyer automatiquement le message
      if (transcription.text.trim()) {
        await onSendMessage(transcription.text);
        
        // Enregistrer dans la base de données
        await base44.entities.VoiceTranscription.create(transcription);
      }
    }
  };

  // Ajouter les réponses IA aux transcriptions + PARLER VOCALEMENT
  useEffect(() => {
    if (currentConversation?.messages) {
      const aiMessages = currentConversation.messages
        .filter(m => m.role === 'assistant')
        .map(m => ({
          speaker_type: 'ai',
          text: m.content,
          timestamp: m.timestamp || new Date().toISOString(),
          conversation_id: currentConversation.id
        }));
      
      setAiTranscriptions(aiMessages);
      
      // PARLER la dernière réponse automatiquement
      if (aiMessages.length > 0 && voiceAvailable) {
        const lastMessage = aiMessages[aiMessages.length - 1];
        speakAIResponse(lastMessage.text);
      }
    }
  }, [currentConversation]);

  // Fonction pour faire parler l'IA
  const speakAIResponse = async (text) => {
    if (!voiceAvailable || isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      // Voix professionnelle français
      await speak(text, {
        ...VOICE_EMOTIONS.professional,
        rate: 1.1,
        pitch: 1.0,
        volume: 1.0
      });
      
      // Sauvegarder vocalement
      await base44.entities.VoiceTranscription.create({
        speaker_type: 'ai',
        text: text,
        timestamp: new Date().toISOString(),
        conversation_id: currentConversation?.id
      });
    } catch (error) {
      console.error('Erreur synthèse vocale:', error);
    }
    setIsSpeaking(false);
  };

  // Sauvegarde intelligente automatique
  const handleSaveIntelligently = async () => {
    if (!currentConversation) return;
    
    try {
      const result = await intelligenceEngine.saveConversationIntelligently(
        currentConversation,
        { folders: [], files: [], events: [] }
      );
      
      if (result.success) {
        console.log('✅ Conversation sauvegardée:', result.fileName);
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  };

  // Auto-save après chaque message
  useEffect(() => {
    if (currentConversation?.messages?.length > 0) {
      handleSaveIntelligently();
    }
  }, [currentConversation?.messages?.length]);

  return (
    <>
      <TasksPanel isOpen={showTasks} onClose={() => setShowTasks(false)} />
      
      <div className="h-full flex bg-white overflow-hidden">
        {/* Sidebar - History */}
        <AnimatePresence>
          {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-slate-300 bg-slate-50 overflow-hidden"
          >
            <div className="p-3 border-b border-slate-300 bg-white">
              <h3 className="font-bold text-slate-900 mb-2">Menu</h3>
              <Button
                onClick={onNewConversation}
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 mb-2"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Nouvelle conversation
              </Button>
              <Button
                onClick={() => setShowTasks(true)}
                variant="outline"
                className="w-full justify-start"
              >
                <ListTodo className="w-4 h-4 mr-2" />
                Gestionnaire Tâches
              </Button>
            </div>
            
            <div className="p-2">
              <div className="text-xs font-bold text-slate-600 mb-2 px-2">📜 Historique</div>
              
              <ScrollArea className="h-[calc(100%-140px)]">
                <div className="space-y-1">
                  {conversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => onSelectConversation(conv)}
                      className={`w-full p-2 rounded-lg text-left transition-colors text-sm ${
                        currentConversation?.id === conv.id
                          ? 'bg-blue-100 border border-blue-300'
                          : 'hover:bg-slate-100 bg-white border border-slate-200'
                      }`}
                    >
                      <p className="font-medium text-slate-900 truncate text-xs">
                        {conv.title || 'Sans titre'}
                      </p>
                      <p className="text-xs text-slate-600">
                        {conv.messages?.length || 0} msg
                      </p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area - 2 COLONNES PLEIN ÉCRAN */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-slate-300 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Minima-X - Assistant IA v3.0</h2>
              <p className="text-xs text-slate-700">
                💬 Mr Christian Debien | 🎤 Transcription temps réel | 🧮 Moteur mathématique LLaMA+Transformer
              </p>
            </div>
          </div>
          
          <VoiceTranscription onTranscription={handleVoiceTranscription} />
        </div>

        {/* 2 COLONNES DE TRANSCRIPTION */}
        <div className="flex-1 flex overflow-hidden">
          {/* COLONNE GAUCHE: Transcriptions Humaines */}
          <div className="w-1/2 border-r border-slate-300 flex flex-col bg-blue-50">
            <div className="p-3 bg-blue-100 border-b border-blue-300 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-blue-900">🎤 Transcription Vocale Humaine</h3>
              <span className="ml-auto text-xs text-blue-700">{humanTranscriptions.length} messages</span>
            </div>
            
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-3">
                {humanTranscriptions.map((trans, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white rounded-lg border-2 border-blue-200 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-blue-900">
                        Locuteur {trans.speaker_id || 'Humain'}
                      </span>
                      <span className="text-xs text-slate-600 ml-auto">
                        {new Date(trans.timestamp).toLocaleTimeString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-900 leading-relaxed">{trans.text}</p>
                    {trans.is_song && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-purple-700">
                        <Music className="w-3 h-3" />
                        Chanson détectée - Partition générée
                      </div>
                    )}
                    {trans.voice_signature && (
                      <div className="mt-1 text-xs text-slate-500">
                        🔢 Hash vocal: {trans.voice_signature.pattern_hash}
                      </div>
                    )}
                  </motion.div>
                ))}
                {humanTranscriptions.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Mic className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                    <p className="text-sm">🎤 Parlez pour commencer la transcription</p>
                    <p className="text-xs mt-1">Reconnaissance vocale activée automatiquement</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* COLONNE DROITE: Réponses IA */}
          <div className="w-1/2 flex flex-col bg-purple-50">
            <div className="p-3 bg-purple-100 border-b border-purple-300 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-700" />
              <h3 className="font-bold text-purple-900">🤖 Réponses Intelligence Artificielle</h3>
              {isSpeaking && (
                <div className="flex items-center gap-1 text-xs text-purple-700">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>Parle...</span>
                </div>
              )}
              <span className="ml-auto text-xs text-purple-700">{aiTranscriptions.length} réponses</span>
            </div>
            
            <ScrollArea className="flex-1 p-4" ref={scrollRef2}>
              <div className="space-y-3">
                {aiTranscriptions.map((trans, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-white rounded-lg border-2 border-purple-200 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-purple-900">Minima-X (LLaMA + Transformer)</span>
                      <span className="text-xs text-slate-600 ml-auto">
                        {new Date(trans.timestamp).toLocaleTimeString('fr-FR')}
                      </span>
                    </div>
                    <div className="prose prose-sm prose-slate max-w-none">
                      <ReactMarkdown>{trans.text}</ReactMarkdown>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(trans.text, `ai-${idx}`)}
                      className="mt-2 h-6 px-2 text-purple-600 hover:text-purple-800"
                    >
                      {copiedId === `ai-${idx}` ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : (
                        <Copy className="w-3 h-3 mr-1" />
                      )}
                      <span className="text-xs">{copiedId === `ai-${idx}` ? 'Copié' : 'Copier'}</span>
                    </Button>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-white rounded-lg border-2 border-purple-300"
                  >
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                      <span className="text-sm text-purple-900 font-medium">
                        🧠 Analyse avec 500x LLaMA + Transformers...
                      </span>
                    </div>
                  </motion.div>
                )}
                
                {aiTranscriptions.length === 0 && !isLoading && (
                  <div className="text-center py-12 text-slate-500">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                    <p className="text-sm">🤖 Minima-X attend vos questions</p>
                    <p className="text-xs mt-1">Réponses via formules mathématiques avancées</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-300 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="💬 Écrivez ou parlez à Minima-X (Mr Christian Debien - Fidèle & Professionnel)..."
              className="flex-1 rounded-lg border-slate-300 focus:border-blue-500"
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-slate-500 mt-2 text-center">
            🎤 Reconnaissance vocale active | 🧮 500x LLaMA & Transformers | 🤝 Collaboration temps réel
          </p>
        </div>
      </div>
    </div>
    </>
  );
}