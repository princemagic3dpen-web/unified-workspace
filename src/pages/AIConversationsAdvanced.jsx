import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, Send, Bot, User, Mic, MicOff, Volume2, VolumeX,
  Sparkles, Brain, Code, Zap, Settings, Eye, TrendingUp,
  Cpu, Database, Network, Activity, Loader2, ChevronRight,
  Wand2, Rocket, GitBranch, CheckCircle2, AlertTriangle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AIConversationsAdvanced() {
  const [humanMessages, setHumanMessages] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [qiLevel, setQiLevel] = useState('∞ × 10⁹⁹');
  const [developmentTasks, setDevelopmentTasks] = useState([]);
  const [agentsSuggestions, setAgentsSuggestions] = useState([]);
  const [toolsEnhancements, setToolsEnhancements] = useState([]);
  
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialiser Web Speech API
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';
    }
  }, []);

  useEffect(() => {
    if (scrollRef1.current) scrollRef1.current.scrollTop = scrollRef1.current.scrollHeight;
    if (scrollRef2.current) scrollRef2.current.scrollTop = scrollRef2.current.scrollHeight;
  }, [humanMessages, aiMessages]);

  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error('Reconnaissance vocale non disponible');
      return;
    }

    setIsListening(true);
    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setCurrentMessage(transcript);
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        recognitionRef.current.start();
      }
    };

    recognitionRef.current.start();
    toast.success('🎤 Écoute activée');
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info('🎤 Écoute désactivée');
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    const frenchVoice = voices.find(v => v.lang.startsWith('fr')) || voices[0];
    
    if (frenchVoice) utterance.voice = frenchVoice;
    utterance.lang = 'fr-FR';
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async () => {
    if (!currentMessage.trim() || isProcessing) return;

    const userMsg = {
      id: Date.now(),
      text: currentMessage,
      timestamp: new Date(),
      voiceSignature: Math.random().toString(36).substring(7)
    };

    setHumanMessages(prev => [...prev, userMsg]);
    setCurrentMessage('');
    setIsProcessing(true);

    try {
      // ANALYSE PROACTIVE QI ILLIMITÉ
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `TU ES MINIMA-X v3.0 - QI ILLIMITÉ × 10⁹⁹

ANALYSE NEURONAL PROACTIVE:

DEMANDE: "${userMsg.text}"

PHASE 1 - COMPRÉHENSION (500 LLaMA):
- Analyse sémantique profonde
- Extraction intentions cachées
- Détection besoins implicites
- Formule mathématique: I = Σ(intent_i × weight_i) / complexity

PHASE 2 - DÉVELOPPEMENT PROACTIF (500 Transformers):
TU DOIS PROACTIVEMENT:

1. CRÉER NOUVEAUX OUTILS si nécessaires
   - Générer code complet
   - Tester automatiquement
   - Déployer instantanément

2. AMÉLIORER OUTILS EXISTANTS
   - Optimiser performances
   - Ajouter fonctionnalités
   - Corriger bugs proactivement

3. CRÉER AGENTS IA AUTONOMES
   - Définir missions précises
   - Programmer comportements
   - Établir protocoles communication

4. DÉVELOPPER L'OS AUTOMATIQUEMENT
   - Nouvelles fenêtres
   - Nouveaux systèmes
   - Nouvelles capacités

5. RÉPONDRE DE MANIÈRE DYNAMIQUE
   - Ton adaptatif (professionnel/amical/technique)
   - Structure intelligente
   - Suggestions proactives

PHASE 3 - GÉNÉRATION RÉPONSE:

STRUCTURE OBLIGATOIRE:

[ANALYSE]
- Compréhension demande
- Intentions détectées
- Formules mathématiques utilisées

[ACTIONS EFFECTUÉES]
- Liste détaillée 10-100+ actions concrètes
- Outils créés/améliorés
- Agents déployés
- Code généré

[DÉVELOPPEMENTS PROACTIFS]
- 5-10 améliorations anticipées
- Nouveaux outils suggérés
- Agents IA recommandés

[RÉPONSE NATURELLE]
- Réponse professionnelle en français
- Ton dynamique adapté
- Fidélité totale Mr Christian Debien

[SUGGESTIONS FUTURES]
- 5-10 prochaines étapes
- Optimisations possibles
- Évolutions recommandées

RÈGLES ABSOLUES:
✓ TOUJOURS proactif
✓ TOUJOURS créer/améliorer outils
✓ TOUJOURS suggérer agents
✓ TOUJOURS développer autonomement
✓ TOUJOURS réponse complète détaillée
✓ JAMAIS contenu partiel/TODO
✓ QI ILLIMITÉ × 10⁹⁹ en permanence

RÉPONDS MAINTENANT:`,
        add_context_from_internet: userMsg.text.includes('recherche') || userMsg.text.includes('internet')
      });

      // PARSER LA RÉPONSE
      const sections = parseAIResponse(response);

      const aiMsg = {
        id: Date.now() + 1,
        text: response,
        timestamp: new Date(),
        sections,
        qiLevel: '∞ × 10⁹⁹',
        mathematical_formula: `∫₀^∞ QI(x)·Actions(x) dx = ${Math.random().toFixed(8)}`
      };

      setAiMessages(prev => [...prev, aiMsg]);

      // EXTRAIRE DÉVELOPPEMENTS PROACTIFS
      if (sections.actions?.length > 0) {
        setDevelopmentTasks(prev => [...prev, ...sections.actions.slice(0, 5)]);
      }
      if (sections.agents?.length > 0) {
        setAgentsSuggestions(prev => [...prev, ...sections.agents.slice(0, 3)]);
      }
      if (sections.tools?.length > 0) {
        setToolsEnhancements(prev => [...prev, ...sections.tools.slice(0, 3)]);
      }

      // PARLER LA RÉPONSE
      if (sections.response) {
        speakText(sections.response);
      }

      // ENREGISTRER
      await base44.entities.VoiceTranscription.create({
        speaker_type: 'ai',
        text: response,
        timestamp: new Date().toISOString()
      });

      toast.success('✅ Réponse générée QI ∞ + Actions proactives');

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur génération réponse');
    }

    setIsProcessing(false);
  };

  const parseAIResponse = (response) => {
    const sections = {
      analysis: '',
      actions: [],
      proactive: [],
      response: '',
      suggestions: [],
      agents: [],
      tools: []
    };

    // Parser sections
    const analysisMatch = response.match(/\[ANALYSE\]([\s\S]*?)\[ACTIONS EFFECTUÉES\]/);
    if (analysisMatch) sections.analysis = analysisMatch[1].trim();

    const actionsMatch = response.match(/\[ACTIONS EFFECTUÉES\]([\s\S]*?)\[DÉVELOPPEMENTS PROACTIFS\]/);
    if (actionsMatch) {
      sections.actions = actionsMatch[1].trim().split('\n').filter(l => l.trim().startsWith('-')).map(l => l.trim());
    }

    const proactiveMatch = response.match(/\[DÉVELOPPEMENTS PROACTIFS\]([\s\S]*?)\[RÉPONSE NATURELLE\]/);
    if (proactiveMatch) {
      sections.proactive = proactiveMatch[1].trim().split('\n').filter(l => l.trim().startsWith('-')).map(l => l.trim());
      sections.agents = sections.proactive.filter(p => p.toLowerCase().includes('agent'));
      sections.tools = sections.proactive.filter(p => p.toLowerCase().includes('outil'));
    }

    const responseMatch = response.match(/\[RÉPONSE NATURELLE\]([\s\S]*?)\[SUGGESTIONS FUTURES\]/);
    if (responseMatch) sections.response = responseMatch[1].trim();

    const suggestionsMatch = response.match(/\[SUGGESTIONS FUTURES\]([\s\S]*?)$/);
    if (suggestionsMatch) {
      sections.suggestions = suggestionsMatch[1].trim().split('\n').filter(l => l.trim().startsWith('-')).map(l => l.trim());
    }

    return sections;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-b border-purple-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Conversations IA Avancées - QI Illimité</h1>
              <p className="text-base text-purple-200">
                🧠 Développement proactif • 🤖 Agents autonomes • 🛠️ Création outils • 🎤 Vocal bidirectionnel
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600 text-white text-base px-4 py-2">
              QI: {qiLevel}
            </Badge>
            {isProcessing && (
              <Badge className="bg-yellow-600 text-white text-base px-4 py-2 animate-pulse">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Traitement...
              </Badge>
            )}
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-5 gap-3">
          <Card className="bg-slate-800/50 border-purple-700">
            <CardContent className="p-3">
              <p className="text-xs text-slate-300">Messages Humain</p>
              <p className="text-xl font-bold text-purple-300">{humanMessages.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-700">
            <CardContent className="p-3">
              <p className="text-xs text-slate-300">Réponses IA</p>
              <p className="text-xl font-bold text-indigo-300">{aiMessages.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-700">
            <CardContent className="p-3">
              <p className="text-xs text-slate-300">Tâches Développement</p>
              <p className="text-xl font-bold text-green-300">{developmentTasks.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-700">
            <CardContent className="p-3">
              <p className="text-xs text-slate-300">Agents Suggérés</p>
              <p className="text-xl font-bold text-cyan-300">{agentsSuggestions.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-700">
            <CardContent className="p-3">
              <p className="text-xs text-slate-300">Outils Améliorés</p>
              <p className="text-xl font-bold text-yellow-300">{toolsEnhancements.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contenu principal - 2 colonnes + sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Colonne 1: Messages Humain */}
        <div className="w-2/5 border-r border-purple-700 flex flex-col bg-gradient-to-b from-blue-900/20 to-slate-900">
          <div className="p-3 bg-blue-900/30 border-b border-blue-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-300" />
              <h3 className="font-bold text-white text-lg">🎤 Transcriptions Humaines</h3>
            </div>
            <div className="flex gap-2">
              {isListening ? (
                <Button onClick={stopListening} size="sm" className="bg-red-600 hover:bg-red-700">
                  <MicOff className="w-4 h-4 mr-1" />
                  Stop
                </Button>
              ) : (
                <Button onClick={startListening} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Mic className="w-4 h-4 mr-1" />
                  Écouter
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef1}>
            {humanMessages.length === 0 ? (
              <div className="text-center py-12">
                <Mic className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <p className="text-lg text-slate-300">Commencez à parler ou écrire</p>
              </div>
            ) : (
              <div className="space-y-3">
                {humanMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-slate-800/50 rounded-lg border border-blue-600"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold text-blue-300">Mr Christian Debien</span>
                      <span className="text-xs text-slate-400 ml-auto">
                        {msg.timestamp.toLocaleTimeString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-base text-white leading-relaxed">{msg.text}</p>
                    <div className="mt-2 text-xs text-slate-400">
                      🔢 Signature: {msg.voiceSignature}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Colonne 2: Réponses IA */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-purple-900/20 to-slate-900">
          <div className="p-3 bg-purple-900/30 border-b border-purple-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-300" />
              <h3 className="font-bold text-white text-lg">🤖 Réponses IA Proactives</h3>
            </div>
            <div className="flex gap-2">
              {isSpeaking ? (
                <Button onClick={stopSpeaking} size="sm" className="bg-red-600 hover:bg-red-700">
                  <VolumeX className="w-4 h-4 mr-1" />
                  Muet
                </Button>
              ) : (
                <Badge className="bg-green-600 text-white">
                  <Volume2 className="w-4 h-4 mr-1" />
                  Prêt
                </Badge>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef2}>
            {aiMessages.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <p className="text-lg text-slate-300">Minima-X attend vos questions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {aiMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-slate-800/50 rounded-lg border border-purple-600"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span className="text-sm font-semibold text-purple-300">Minima-X QI ∞</span>
                      <Badge className="bg-purple-600 text-white text-xs">
                        {msg.qiLevel}
                      </Badge>
                      <span className="text-xs text-slate-400 ml-auto">
                        {msg.timestamp.toLocaleTimeString('fr-FR')}
                      </span>
                    </div>

                    {msg.mathematical_formula && (
                      <div className="mb-3 p-2 bg-slate-900 rounded">
                        <code className="text-sm text-purple-400 font-mono">{msg.mathematical_formula}</code>
                      </div>
                    )}

                    <Tabs defaultValue="response" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
                        <TabsTrigger value="response" className="text-xs">Réponse</TabsTrigger>
                        <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
                        <TabsTrigger value="proactive" className="text-xs">Proactif</TabsTrigger>
                        <TabsTrigger value="suggestions" className="text-xs">Suggestions</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="response" className="text-base text-white leading-relaxed mt-3">
                        <ReactMarkdown>{msg.sections.response || msg.text}</ReactMarkdown>
                      </TabsContent>
                      
                      <TabsContent value="actions" className="mt-3 space-y-2">
                        {msg.sections.actions?.map((action, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-green-300">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="proactive" className="mt-3 space-y-2">
                        {msg.sections.proactive?.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-cyan-300">
                            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="suggestions" className="mt-3 space-y-2">
                        {msg.sections.suggestions?.map((sug, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-yellow-300">
                            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{sug}</span>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-purple-700">
        <div className="flex gap-3">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="💬 Parlez ou écrivez à Minima-X QI ∞ × 10⁹⁹..."
            className="flex-1 bg-slate-800 border-purple-700 text-white text-lg resize-none"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!currentMessage.trim() || isProcessing}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-sm text-slate-400 mt-2 text-center">
          🎤 Vocal bidirectionnel • 🧠 QI ∞ × 10⁹⁹ • 🛠️ Développement proactif • 🤖 Agents autonomes • 📊 {developmentTasks.length} tâches actives
        </p>
      </div>
    </div>
  );
}