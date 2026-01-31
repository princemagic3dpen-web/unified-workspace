import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Folder,
  MessageSquare,
  Settings,
  FileText,
  Image,
  Video,
  Presentation,
  Search,
  Power,
  User,
  Star,
  Clock,
  FolderOpen,
  Bot,
  Code,
  Users,
  FlaskConical,
  LayoutGrid,
  List,
  Briefcase,
  ImagePlus,
  Box,
  Mic
} from 'lucide-react';

const PINNED_APPS = [
  { id: 'chat', name: 'Assistant IA Minima-X', icon: Bot, color: '#8b5cf6' },
  { id: 'window-creator', name: '+ Nouvelle Fenêtre', icon: Code, color: '#10b981' },
  { id: 'calendar', name: 'Calendrier', icon: Calendar, color: '#06b6d4' },
  { id: 'explorer', name: 'Explorateur Fichiers', icon: Folder, color: '#3b82f6' },
  { id: 'text-editor', name: 'Éditeur Texte IA', icon: FileText, color: '#10b981' },
  { id: 'presentation', name: 'Présentations PPT', icon: Presentation, color: '#ec4899' },
];

const ALL_APPS = [
  ...PINNED_APPS,
  { id: 'collaboration', name: 'Collaboration Temps Réel', icon: Users, color: '#3b82f6' },
  { id: 'ai-development', name: 'Auto-Développement IA', icon: Code, color: '#8b5cf6' },
  { id: 'ai-models', name: 'Configuration IA', icon: Settings, color: '#8b5cf6' },
  { id: 'ai-testing', name: 'Test IA - Romans 500p', icon: FlaskConical, color: '#10b981' },
  { id: 'window-manager', name: 'Gestionnaire Fenêtres', icon: LayoutGrid, color: '#8b5cf6' },
  { id: 'system-functions', name: 'Liste Fonctionnalités', icon: List, color: '#3b82f6' },
  { id: 'business-prep', name: 'Préparation Entreprise', icon: Briefcase, color: '#10b981' },
  { id: 'file-actions', name: 'Actions Fichiers', icon: Folder, color: '#10b981' },
  { id: 'pdf-editor', name: 'Éditeur PDF', icon: FileText, color: '#ef4444' },
  { id: 'image-generator', name: 'Générateur Images 4K', icon: ImagePlus, color: '#a855f7' },
  { id: 'video-generator', name: 'Générateur Vidéos IA', icon: Video, color: '#0ea5e9' },
  { id: 'game-world-generator', name: 'Jeux & Mondes 3D', icon: Box, color: '#10b981' },
  { id: 'proactive-agents', name: 'Agents IA Proactifs', icon: Bot, color: '#6366f1' },
  { id: 'advanced-parameters', name: 'Paramètres Avancés', icon: Settings, color: '#3b82f6' },
  { id: 'parameters-diagram', name: 'Diagramme 2D', icon: Code, color: '#8b5cf6' },
  { id: 'voice-commands', name: 'Commandes Vocales (5000)', icon: Mic, color: '#6366f1' },
  { id: 'company-management', name: 'Gestion Entreprises', icon: Briefcase, color: '#3b82f6' },
  { id: 'ai-tools-hub', name: 'Hub Outils IA (35+)', icon: Bot, color: '#8b5cf6' },
];

export default function StartMenu({ 
  isOpen, 
  onClose, 
  onOpenApp, 
  recentFiles = [],
  favoriteItems = [],
  user 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pinned');

  const filteredApps = ALL_APPS.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-20 left-4 w-[600px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden z-50"
      >
        {/* Search */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des applications, fichiers..."
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 rounded-xl focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex h-[450px]">
          {/* Left side - Apps */}
          <div className="flex-1 p-4 border-r border-slate-700/50">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={activeTab === 'pinned' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('pinned')}
                className={`rounded-lg ${activeTab === 'pinned' ? 'bg-cyan-600' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              >
                Épinglés
              </Button>
              <Button
                variant={activeTab === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('all')}
                className={`rounded-lg ${activeTab === 'all' ? 'bg-cyan-600' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              >
                Toutes les apps
              </Button>
            </div>

            {/* Apps grid */}
            <ScrollArea className="h-[350px]">
              <div className="grid grid-cols-3 gap-2">
                {(searchQuery ? filteredApps : (activeTab === 'pinned' ? PINNED_APPS : ALL_APPS)).map(app => (
                  <motion.button
                    key={app.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onOpenApp(app.id);
                      onClose();
                    }}
                    className="flex flex-col items-center p-4 rounded-xl hover:bg-slate-800 transition-colors group"
                  >
                    <div 
                      className="p-3 rounded-xl mb-2 group-hover:shadow-lg transition-shadow"
                      style={{ backgroundColor: app.color }}
                    >
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white text-center">
                      {app.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right side - Recent & Favorites */}
          <div className="w-[200px] p-4">
            {/* Recent files */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-400">Récents</span>
              </div>
              <div className="space-y-1">
                {recentFiles.slice(0, 5).map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onOpenApp('viewer', file);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-left"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-300 truncate">{file.name}</span>
                  </button>
                ))}
                {recentFiles.length === 0 && (
                  <p className="text-xs text-slate-500">Aucun fichier récent</p>
                )}
              </div>
            </div>

            {/* Favorites */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-slate-400">Favoris</span>
              </div>
              <div className="space-y-1">
                {favoriteItems.slice(0, 5).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onOpenApp('explorer', item);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-left"
                  >
                    {item.type === 'folder' ? (
                      <FolderOpen className="w-4 h-4 text-blue-500" />
                    ) : (
                      <FileText className="w-4 h-4 text-slate-500" />
                    )}
                    <span className="text-sm text-slate-300 truncate">{item.name}</span>
                  </button>
                ))}
                {favoriteItems.length === 0 && (
                  <p className="text-xs text-slate-500">Aucun favori</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 flex items-center justify-between">
          <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">{user?.full_name || 'Utilisateur'}</p>
              <p className="text-xs text-slate-400">{user?.email || ''}</p>
            </div>
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
          >
            <Power className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </>
  );
}