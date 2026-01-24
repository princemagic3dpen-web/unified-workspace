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
  Paperclip,
  Image as ImageIcon,
  FileText,
  Sparkles,
  History,
  Plus,
  ChevronLeft,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';

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
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

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

  const quickActions = [
    { icon: FileText, label: 'Créer 50 fichiers', prompt: 'Crée une structure complète de projet avec 50+ fichiers organisés en dossiers pour ' },
    { icon: Sparkles, label: 'Document 100 pages', prompt: 'Génère un document complet de 100 pages avec introduction, développement détaillé et conclusion sur ' },
    { icon: ImageIcon, label: 'Présentation + Visuels', prompt: 'Crée une présentation PowerPoint professionnelle avec visuels automatiques (charts basés sur données, SVGs, diagrammes) adaptée pour audience executive sur ' },
  ];

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
      {/* Sidebar - History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-slate-200 bg-slate-50/50 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700">Historique</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHistory(false)}
                  className="h-8 w-8 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-2">
              <Button
                onClick={onNewConversation}
                className="w-full justify-start rounded-xl bg-cyan-50 text-cyan-700 hover:bg-cyan-100 mb-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle conversation
              </Button>
              
              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="space-y-1">
                  {conversations.map(conv => (
                    <motion.button
                      key={conv.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectConversation(conv)}
                      className={`w-full p-3 rounded-xl text-left transition-colors ${
                        currentConversation?.id === conv.id
                          ? 'bg-white shadow-sm border border-cyan-200'
                          : 'hover:bg-white/50'
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {conv.title || 'Sans titre'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {conv.messages?.length || 0} messages
                      </p>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!showHistory && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHistory(true)}
                  className="rounded-xl hover:bg-cyan-50"
                >
                  <History className="w-5 h-5 text-slate-600" />
                </Button>
              )}
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Assistant IA</h2>
                <p className="text-sm text-slate-500">
                  Gestion intelligente de fichiers
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onNewConversation}
              className="rounded-xl"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nouveau
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {(!currentConversation?.messages || currentConversation.messages.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-100 to-purple-100 mb-6">
                <Sparkles className="w-12 h-12 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Agent IA Minima-X Prêt
              </h3>
              <p className="text-slate-500 mb-6 max-w-md">
                Je peux créer des centaines de fichiers, générer des documents de 50-500 pages, 
                développer des présentations PowerPoint complètes, organiser automatiquement vos dossiers,
                et exécuter des centaines d'actions par message. Deep thinking activé.
              </p>
              
              {/* Quick actions */}
              <div className="flex flex-wrap justify-center gap-2">
                {quickActions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    onClick={() => setMessage(action.prompt)}
                    className="rounded-xl"
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentConversation.messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`p-2 rounded-xl flex-shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-cyan-100' 
                      : 'bg-gradient-to-br from-violet-500 to-purple-600'
                  }`}>
                    {msg.role === 'user' 
                      ? <User className="w-4 h-4 text-cyan-700" />
                      : <Bot className="w-4 h-4 text-white" />
                    }
                  </div>
                  
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white border border-slate-200 shadow-sm'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : (
                        <div className="prose prose-sm prose-slate max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(msg.content, idx)}
                          className="h-7 px-2 rounded-lg text-slate-400 hover:text-slate-600"
                        >
                          {copiedId === idx ? (
                            <Check className="w-3 h-3 mr-1" />
                          ) : (
                            <Copy className="w-3 h-3 mr-1" />
                          )}
                          <span className="text-xs">
                            {copiedId === idx ? 'Copié' : 'Copier'}
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                      <span className="text-sm text-slate-500">Réflexion en cours...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl flex-shrink-0"
            >
              <Paperclip className="w-5 h-5 text-slate-400" />
            </Button>
            
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Demandez-moi n'importe quoi..."
              className="flex-1 rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-400"
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}