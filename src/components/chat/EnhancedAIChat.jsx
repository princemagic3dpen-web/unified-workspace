import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Mic,
  Brain,
  Sparkles,
  Loader2,
  Plus,
  Zap,
  Calendar,
  FileText,
  LayoutGrid,
  Settings
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function EnhancedAIChat({ 
  conversations = [],
  currentConversation,
  onNewConversation,
  onSelectConversation,
  onSendMessage,
  isLoading
}) {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  
  // Contrôles qualité
  const [aiEnabled, setAiEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [contextualMode, setContextualMode] = useState(true);
  const [proactiveMode, setProactiveMode] = useState(true);
  
  // Tâches multitasking
  const [activeTasks, setActiveTasks] = useState([]);
  const [pages, setPages] = useState([]);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading || !aiEnabled) return;
    onSendMessage(message);
    setMessage('');
  };

  const handleSummarize = () => {
    if (!currentConversation?.messages?.length) return;
    const summary = currentConversation.messages.map(m => `${m.role}: ${m.content}`).join('\n');
    onSendMessage(`Résume cette conversation en 5 points clés:\n\n${summary}`);
  };

  const handleCreateTask = (taskName) => {
    const newTask = {
      id: Date.now(),
      name: taskName,
      status: 'in_progress',
      createdAt: new Date()
    };
    setActiveTasks(prev => [...prev, newTask]);
  };

  const handleCreatePage = (pageName) => {
    const newPage = {
      id: Date.now(),
      name: pageName,
      type: 'custom',
      createdAt: new Date()
    };
    setPages(prev => [...prev, newPage]);
  };

  const contextualSuggestions = [
    { icon: '📁', text: 'Analyser mes fichiers récents', category: 'files' },
    { icon: '📅', text: 'Préparer mon prochain événement', category: 'calendar' },
    { icon: '🎯', text: 'Créer une tâche prioritaire', category: 'task' },
    { icon: '📊', text: 'Générer un rapport détaillé', category: 'report' },
    { icon: '🤖', text: 'Créer un workflow automatisé', category: 'automation' },
    { icon: '💼', text: 'Plan stratégique entreprise', category: 'business' },
  ];

  const ToggleSwitch = ({ label, value, onChange, color }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{label}:</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? `bg-${color}-500` : 'bg-slate-600'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Barre de contrôle supérieure */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <ToggleSwitch label="IA" value={aiEnabled} onChange={setAiEnabled} color="green" />
          <ToggleSwitch label="Voix" value={voiceEnabled} onChange={setVoiceEnabled} color="cyan" />
          <ToggleSwitch label="Contextuel" value={contextualMode} onChange={setContextualMode} color="purple" />
          <ToggleSwitch label="Proactif" value={proactiveMode} onChange={setProactiveMode} color="indigo" />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-green-500 text-green-400 animate-pulse">
            ✓ Toujours Actif
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSummarize}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Brain className="w-4 h-4 mr-1" />
            Résumer
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex border-b border-slate-700 bg-slate-800/30">
          <TabsList className="bg-transparent border-0 flex gap-1 px-4">
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400 rounded-lg px-4 py-2"
            >
              💬 Chat
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400 rounded-lg px-4 py-2 relative"
            >
              ⚡ Tâches ({activeTasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400 rounded-lg px-4 py-2"
            >
              💡 Suggestions
            </TabsTrigger>
            <TabsTrigger
              value="creator"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400 rounded-lg px-4 py-2"
            >
              ➕ Créateur
            </TabsTrigger>
            <TabsTrigger
              value="pages"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400 rounded-lg px-4 py-2"
            >
              📄 Pages ({pages.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar conversations */}
          <div className="w-80 border-r border-slate-700 flex flex-col bg-slate-800/50">
            <div className="p-4 border-b border-slate-700">
              <Button 
                onClick={onNewConversation}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Conversation
              </Button>
            </div>

            <ScrollArea className="flex-1 p-2">
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => onSelectConversation(conv)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      currentConversation?.id === conv.id
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <p className="font-medium truncate text-sm">
                      {conv.title || 'Sans titre'}
                    </p>
                    <p className="text-xs opacity-70">
                      {conv.messages?.length || 0} messages
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Contenu principal des onglets */}
          <div className="flex-1 flex flex-col">
            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              <ScrollArea className="flex-1 p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                  {/* Suggestions contextuelles */}
                  {contextualMode && (!currentConversation?.messages?.length || currentConversation.messages.length === 0) && (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {contextualSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setMessage(suggestion.text)}
                          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500 transition-all text-left group"
                        >
                          <div className="text-3xl mb-2">{suggestion.icon}</div>
                          <div className="text-sm text-slate-300 group-hover:text-cyan-400 transition-colors">
                            {suggestion.text}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Messages */}
                  {currentConversation?.messages?.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-[70%] rounded-2xl px-6 py-4 ${
                        msg.role === 'user'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 text-slate-100 border border-slate-700'
                      }`}>
                        <ReactMarkdown className="prose prose-sm prose-invert max-w-none">
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                      <div className="bg-slate-800 rounded-2xl px-6 py-4 border border-slate-700">
                        <span className="text-slate-300">🧠 Analyse avec 500x LLaMA + Transformers...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-slate-700 bg-slate-800/30">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={aiEnabled ? "Parlez à Minima-X..." : "IA désactivée"}
                      className="pr-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                      disabled={isLoading || !aiEnabled}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
                      disabled={!voiceEnabled}
                    >
                      <Mic className={`w-5 h-5 ${!voiceEnabled ? 'opacity-30' : ''}`} />
                    </Button>
                  </div>
                  <Button 
                    type="submit"
                    disabled={isLoading || !message.trim() || !aiEnabled}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-xl px-8"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="flex-1 p-6 m-0 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">⚡ Tâches Actives en Multitasking</h2>
                {activeTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <Zap className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400">Aucune tâche active</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTasks.map((task) => (
                      <Card key={task.id} className="bg-slate-800 border-slate-700">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-white">{task.name}</span>
                          </div>
                          <Badge variant="outline" className="border-green-500 text-green-400">
                            En cours...
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="flex-1 p-6 m-0 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">💡 Suggestions Intelligentes</h2>
                <div className="grid grid-cols-2 gap-4">
                  {contextualSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab('chat');
                        setMessage(item.text);
                      }}
                      className="p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500 transition-all text-left group"
                    >
                      <div className="text-5xl mb-3">{item.icon}</div>
                      <p className="text-white font-semibold mb-2 group-hover:text-cyan-400">
                        {item.text}
                      </p>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        {item.category}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="creator" className="flex-1 p-6 m-0 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">➕ Créateur de Pages & Fenêtres</h2>
                <Card className="bg-slate-800 border-slate-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Nouvelle Page/Fenêtre</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Nom de la page..."
                      className="bg-slate-900 border-slate-700 text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          handleCreatePage(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Nom de la page..."]');
                        if (input.value.trim()) {
                          handleCreatePage(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer et Ajouter en Onglet
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-3">
                  {['Dashboard', 'Analytics', 'Reports', 'Settings', 'Tools', 'Workflows'].map((name) => (
                    <button
                      key={name}
                      className="p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-purple-500 transition-all"
                      onClick={() => handleCreatePage(name)}
                    >
                      <LayoutGrid className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <div className="text-sm text-slate-300">{name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pages" className="flex-1 p-6 m-0 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">📄 Pages Créées</h2>
                {pages.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400">Aucune page créée</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {pages.map((page) => (
                      <Card key={page.id} className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6">
                          <FileText className="w-12 h-12 mb-3 text-cyan-400" />
                          <h3 className="text-white font-semibold mb-2">{page.name}</h3>
                          <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                            {page.type}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}