import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Folder, 
  MessageSquare, 
  Settings,
  Search,
  Plus,
  ChevronUp
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Taskbar({ 
  windows, 
  activeWindowId,
  onWindowClick,
  onOpenStartMenu,
  onOpenSearch,
  showStartMenu
}) {
  const getWindowIcon = (type) => {
    switch (type) {
      case 'calendar': return Calendar;
      case 'explorer': return Folder;
      case 'chat': return MessageSquare;
      case 'settings': return Settings;
      default: return Folder;
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 z-50"
    >
      <div className="h-full flex items-center px-4 gap-2">
        {/* Start button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenStartMenu}
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  transition-all duration-300
                  ${showStartMenu 
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 shadow-lg shadow-cyan-500/30' 
                    : 'bg-slate-800 hover:bg-slate-700'
                  }
                `}
              >
                <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm" />
                  <div className="w-2.5 h-2.5 bg-sky-400 rounded-sm" />
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded-sm" />
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-sm" />
                </div>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Menu Démarrer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Search */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenSearch}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Search className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Rechercher</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-700 mx-2" />

        {/* Open windows */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto">
          {windows.map(window => {
            const Icon = window.icon || getWindowIcon(window.type);
            const isActive = activeWindowId === window.id;
            
            return (
              <TooltipProvider key={window.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onWindowClick(window.id)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-xl transition-all
                        ${isActive 
                          ? 'bg-slate-700 border-b-2 border-cyan-400' 
                          : 'bg-slate-800/50 hover:bg-slate-700/50'
                        }
                        ${window.minimized ? 'opacity-60' : ''}
                      `}
                    >
                      <div 
                        className="p-1.5 rounded-lg"
                        style={{ backgroundColor: window.color || '#06b6d4' }}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-white/80 max-w-[120px] truncate">
                        {window.title}
                      </span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{window.title}</p>
                    {window.minimized && <p className="text-xs text-slate-400">Minimisé</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* System tray */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          
          <div className="text-right">
            <p className="text-xs text-white font-medium">
              {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}