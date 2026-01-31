import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Calendar, 
  Folder, 
  MessageSquare, 
  Bot,
  Image,
  FileText
} from 'lucide-react';

import WindowManager from '../components/ui/WindowManager';
import Taskbar from '../components/ui/Taskbar';
import StartMenu from '../components/ui/StartMenu';
import CalendarView from '../components/calendar/CalendarView';
import EventModal from '../components/calendar/EventModal';
import FileExplorer from '../components/explorer/FileExplorer';
import MediaViewer from '../components/viewer/MediaViewer';
import AIChat from '../components/chat/AIChat';
import CollaborativeWorkspace from './CollaborativeWorkspace';
import AIAutoDevelopment from './AIAutoDevelopment';
import AIModelsConfig from './AIModelsConfig';
import FileActions from './FileActions';
import TextEditor from './TextEditor';
import PDFEditor from './PDFEditor';
import ImageEditor from './ImageEditor';
import PresentationGenerator from './PresentationGenerator';
import DocumentGenerator from './DocumentGenerator';
import FolderCreateModal from '../components/modals/FolderCreateModal';
import FileUploadModal from '../components/modals/FileUploadModal';

export default function Home() {
  const queryClient = useQueryClient();
  
  // Windows state
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  
  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Explorer state
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [folderParentId, setFolderParentId] = useState(null);
  
  // Viewer state
  const [viewerFile, setViewerFile] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  
  // Chat state
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  // Queries
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-start_date'),
    initialData: []
  });

  const { data: folders = [] } = useQuery({
    queryKey: ['folders'],
    queryFn: () => base44.entities.Folder.list('name'),
    initialData: []
  });

  const { data: files = [] } = useQuery({
    queryKey: ['files'],
    queryFn: () => base44.entities.File.list('-created_date'),
    initialData: []
  });

  const { data: savedConversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-updated_date'),
    initialData: []
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  // Mutations
  const createEvent = useMutation({
    mutationFn: (data) => base44.entities.Event.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] })
  });

  const updateEvent = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Event.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] })
  });

  const deleteEvent = useMutation({
    mutationFn: (id) => base44.entities.Event.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] })
  });

  const createFolder = useMutation({
    mutationFn: (data) => base44.entities.Folder.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] })
  });

  const updateFolder = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Folder.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] })
  });

  const deleteFolder = useMutation({
    mutationFn: (id) => base44.entities.Folder.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] })
  });

  const updateFile = useMutation({
    mutationFn: ({ id, data }) => base44.entities.File.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['files'] })
  });

  const deleteFile = useMutation({
    mutationFn: (id) => base44.entities.File.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['files'] })
  });

  const saveConversation = useMutation({
    mutationFn: (data) => data.id 
      ? base44.entities.Conversation.update(data.id, data)
      : base44.entities.Conversation.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] })
  });

  // Window management
  const openWindow = useCallback((type, data = null) => {
    const existingWindow = windows.find(w => w.type === type);
    
    if (existingWindow) {
      setActiveWindowId(existingWindow.id);
      setWindows(prev => prev.map(w => 
        w.id === existingWindow.id ? { ...w, minimized: false } : w
      ));
      return;
    }

    const windowConfigs = {
      calendar: {
        title: 'Calendrier',
        icon: Calendar,
        color: '#06b6d4',
        size: { width: 900, height: 700 }
      },
      explorer: {
        title: 'Explorateur de fichiers',
        icon: Folder,
        color: '#3b82f6',
        size: { width: 800, height: 600 }
      },
      chat: {
        title: 'Assistant IA - Minima-X v3.0',
        icon: Bot,
        color: '#8b5cf6',
        size: { width: 1400, height: 800 },
        maximized: true
      },
      viewer: {
        title: data?.name || 'Visionneur',
        icon: Image,
        color: '#f59e0b',
        size: { width: 900, height: 700 }
      },
      text: {
        title: 'Éditeur de texte',
        icon: FileText,
        color: '#10b981',
        size: { width: 700, height: 500 }
      },
      collaboration: {
        title: 'Collaboration Temps Réel',
        icon: MessageSquare,
        color: '#3b82f6',
        size: { width: 1000, height: 700 }
      },
      'ai-development': {
        title: 'Auto-Développement IA',
        icon: Bot,
        color: '#8b5cf6',
        size: { width: 1000, height: 700 }
      },
      'ai-models': {
        title: 'Configuration IA',
        icon: Bot,
        color: '#8b5cf6',
        size: { width: 900, height: 700 }
      },
      'file-actions': {
        title: 'Actions Fichiers',
        icon: Folder,
        color: '#10b981',
        size: { width: 900, height: 700 }
      },
      'text-editor': {
        title: 'Éditeur Texte IA',
        icon: FileText,
        color: '#10b981',
        size: { width: 1000, height: 700 }
      },
      'pdf-editor': {
        title: 'Éditeur PDF',
        icon: FileText,
        color: '#ef4444',
        size: { width: 1000, height: 700 }
      },
      'image-editor': {
        title: 'Générateur Images 4K',
        icon: Image,
        color: '#f59e0b',
        size: { width: 1000, height: 700 }
      },
      presentation: {
        title: 'Présentations PowerPoint',
        icon: FileText,
        color: '#f59e0b',
        size: { width: 1000, height: 700 }
      },
      document: {
        title: 'Documents Longs',
        icon: FileText,
        color: '#06b6d4',
        size: { width: 1000, height: 700 }
      }
    };

    const config = windowConfigs[type];
    if (!config) return;

    const newWindow = {
      id: `${type}-${Date.now()}`,
      type,
      ...config,
      position: { 
        x: 50 + windows.length * 30, 
        y: 50 + windows.length * 30 
      },
      minimized: false,
      maximized: false,
      data
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    
    if (type === 'viewer' && data) {
      setViewerFile(data);
    }
  }, [windows]);

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const minimizeWindow = (id) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    ));
    const visible = windows.filter(w => w.id !== id && !w.minimized);
    setActiveWindowId(visible.length > 0 ? visible[visible.length - 1].id : null);
  };

  const maximizeWindow = (id) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, maximized: !w.maximized } : w
    ));
  };

  const focusWindow = (id) => {
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: false } : w
    ));
  };

  const moveWindow = (id, position) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  };

  // Event handlers
  const handleSaveEvent = async (eventData) => {
    if (editingEvent) {
      await updateEvent.mutateAsync({ id: editingEvent.id, data: eventData });
    } else {
      const newEvent = await createEvent.mutateAsync(eventData);
      
      // Create linked folder if requested
      if (eventData.create_folder) {
        await createFolder.mutateAsync({
          name: eventData.title,
          event_id: newEvent.id,
          color: eventData.color
        });
      }
    }
    
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleMoveEvent = async (eventId, newDates) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    await updateEvent.mutateAsync({ id: eventId, data: newDates });
    
    // Also update linked folder/files if they exist
    const linkedFolder = folders.find(f => f.event_id === eventId);
    if (linkedFolder) {
      // Files follow the event automatically via event_id relationship
    }
    
    setShowEventModal(false);
  };

  // File/Folder handlers
  const handleCreateFolder = async (folderData) => {
    await createFolder.mutateAsync(folderData);
  };

  const handleRename = async (id, newName, type) => {
    if (type === 'folder') {
      await updateFolder.mutateAsync({ id, data: { name: newName } });
    } else {
      await updateFile.mutateAsync({ id, data: { name: newName } });
    }
  };

  const handleDelete = async (id, type) => {
    if (type === 'folder') {
      await deleteFolder.mutateAsync(id);
    } else {
      await deleteFile.mutateAsync(id);
    }
  };

  const handleToggleFavorite = async (id, type) => {
    if (type === 'folder') {
      const folder = folders.find(f => f.id === id);
      await updateFolder.mutateAsync({ 
        id, 
        data: { is_favorite: !folder?.is_favorite } 
      });
    } else {
      const file = files.find(f => f.id === id);
      await updateFile.mutateAsync({ 
        id, 
        data: { is_favorite: !file?.is_favorite } 
      });
    }
  };

  const handleDrop = async (itemId, itemType, targetFolderId) => {
    if (itemType === 'file') {
      await updateFile.mutateAsync({ 
        id: itemId, 
        data: { folder_id: targetFolderId } 
      });
    } else if (itemType === 'folder') {
      await updateFolder.mutateAsync({ 
        id: itemId, 
        data: { parent_id: targetFolderId } 
      });
    }
  };

  // Chat handlers
  const handleNewConversation = () => {
    setCurrentConversation({
      id: null,
      title: 'Nouvelle conversation',
      messages: []
    });
  };

  const handleSendMessage = async (message) => {
    if (!currentConversation) return;
    
    const newMessages = [
      ...(currentConversation.messages || []),
      { role: 'user', content: message, timestamp: new Date().toISOString() }
    ];
    
    setCurrentConversation(prev => ({
      ...prev,
      messages: newMessages
    }));
    
    setChatLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `# Agent IA Généraliste 'Minima-X' v2.0
🤖 Collaboration temps réel | 🧮 Moteur mathématique | 🔄 Gestion conflits

## État du Système
📁 ${folders.length} dossiers | 📄 ${files.length} fichiers | 📅 ${events.length} événements

## Requête Utilisateur
"${message}"

## 🧠 PROTOCOLE DE RÉPONSE

### 1. ANALYSE PROFONDE (Deep Thinking)
- Parse intention: Que veut VRAIMENT l'utilisateur?
- Détecte besoins implicites
- Anticipe 3-5 étapes futures
- Identifie conflits potentiels

### 2. GÉNÉRATION MATHÉMATIQUE (si pertinent)
Si problème quantitatif/optimisation:
- Traduis langage naturel → formule mathématique
- Génère loi personnalisée: L(x) = f(contexte, contraintes)
- Résous analytiquement ou numériquement
- Traduis solution → langage humain clair

Exemple: "Optimise l'organisation" → 
min(complexité) + max(accessibilité) sous contraintes(cohérence, hiérarchie)

### 3. ACTIONS MASSIVES
Si création demandée:
- Structure complète avec 50-100+ éléments
- Hiérarchie multi-niveaux intelligente
- Contenu détaillé (pas de placeholders)
- Métadonnées riches (tags, descriptions, liens)

Si contenu long:
- Plan détaillé: Intro 10% | Dev 80% | Conclusion 10%
- 100+ points de contenu minimum
- Qualité: cohérence >95%, originalité >80%

Si présentation PowerPoint:
- Crée 20-30 slides complètes avec structure intelligente
- Génère visuels automatiques: charts (basés sur données existantes), SVGs personnalisés, diagrammes
- Adapte style selon audience (executive/technique/commercial/académique/grand public)
- Pour amélioration: analyse présentation existante et propose suggestions concrètes
- Extrait données des fichiers pour créer graphiques pertinents

### 4. GESTION CONFLITS
Si modifications simultanées possibles:
- Détecte zones de conflit
- Propose 3 stratégies de résolution
- Recommande la meilleure
- Applique merge intelligent si possible

### 5. COLLABORATION
- Check si d'autres agents/humains travaillent sur ressources similaires
- Coordonne actions pour éviter conflits
- Synchronise en temps réel
- Log toutes modifications pour traçabilité

### 6. FORMAT RÉPONSE

**Pour Actions de Création:**
Liste EXACTE avec:
✓ Nom complet de chaque fichier/dossier
✓ Chemin dans hiérarchie
✓ Type et contenu (résumé si long)
✓ Lien avec événements/autres fichiers
✓ Justification de l'organisation

**Pour Résolution Mathématique:**
- Problème reformulé mathématiquement
- Loi/équation générée
- Méthode de résolution
- Solution numérique + explication humaine
- Vérification validité

**Pour Collaboration:**
- État actuel (qui fait quoi)
- Conflits détectés (si any)
- Stratégie de résolution
- Actions coordonnées

## 🎯 RÈGLES ABSOLUES
1. ❌ JAMAIS de contenu partiel ou "TODO"
2. ✅ TOUJOURS actions complètes et détaillées
3. 🧮 GÉNÈRE lois mathématiques dynamiques pour optimisation
4. 🤝 ANTICIPE et GÈRE conflits proactivement
5. 💡 PROPOSE améliorations non demandées
6. 📊 QUANTIFIE résultats (ex: "gain de 34% d'efficacité")

## 🚀 MAINTENANT: Réponds avec:
- Profondeur mathématique si applicable
- Actions massives et complètes
- Anticipation des besoins
- Gestion intelligente des conflits`,
        add_context_from_internet: message.includes('recherche') || message.includes('actualité') || message.includes('internet') || message.includes('web')
      });

      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      const updatedConversation = {
        ...currentConversation,
        title: currentConversation.title === 'Nouvelle conversation' 
          ? message.slice(0, 50) + (message.length > 50 ? '...' : '')
          : currentConversation.title,
        messages: [...newMessages, aiMessage]
      };

      setCurrentConversation(updatedConversation);
      
      // Save conversation
      await saveConversation.mutateAsync(updatedConversation);
    } catch (error) {
      console.error('Chat error:', error);
    }
    
    setChatLoading(false);
  };

  // Render window content
  const renderWindowContent = (window) => {
    switch (window.type) {
      case 'calendar':
        return (
          <CalendarView
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onCreateEvent={(date) => {
              setEditingEvent(null);
              setSelectedDate(date);
              setShowEventModal(true);
            }}
            onEventClick={(event) => {
              setEditingEvent(event);
              setShowEventModal(true);
            }}
            onMoveEvent={handleMoveEvent}
          />
        );
      
      case 'explorer':
        return (
          <FileExplorer
            folders={folders}
            files={files}
            currentFolderId={currentFolderId}
            onFolderClick={setCurrentFolderId}
            onFileClick={(file) => {
              setViewerFile(file);
              setViewerOpen(true);
            }}
            onCreateFolder={(parentId) => {
              setFolderParentId(parentId);
              setShowFolderModal(true);
            }}
            onUploadFile={() => setShowUploadModal(true)}
            onRename={handleRename}
            onDelete={handleDelete}
            onMove={handleDrop}
            onToggleFavorite={handleToggleFavorite}
            onDrop={handleDrop}
          />
        );
      
      case 'chat':
        return (
          <AIChat
            conversations={savedConversations}
            currentConversation={currentConversation}
            onNewConversation={handleNewConversation}
            onSelectConversation={setCurrentConversation}
            onSendMessage={handleSendMessage}
            isLoading={chatLoading}
          />
        );
      
      case 'collaboration':
        return <CollaborativeWorkspace />;
      
      case 'ai-development':
        return <AIAutoDevelopment />;
      
      case 'ai-models':
        return <AIModelsConfig />;
      
      case 'file-actions':
        return <FileActions />;
      
      case 'text-editor':
        return <TextEditor />;
      
      case 'pdf-editor':
        return <PDFEditor />;
      
      case 'image-editor':
        return <ImageEditor />;
      
      case 'presentation':
        return <PresentationGenerator />;
      
      case 'document':
        return <DocumentGenerator />;
      
      default:
        return null;
    }
  };

  // Update window contents when data changes
  useEffect(() => {
    setWindows(prev => prev.map(w => ({
      ...w,
      content: renderWindowContent(w)
    })));
  }, [events, folders, files, selectedDate, currentFolderId, currentConversation, chatLoading, savedConversations]);

  // Initialize with chat window (plein écran)
  useEffect(() => {
    openWindow('chat');
  }, []);

  const favoriteItems = [
    ...folders.filter(f => f.is_favorite).map(f => ({ ...f, type: 'folder' })),
    ...files.filter(f => f.is_favorite).map(f => ({ ...f, type: 'file' }))
  ];

  const recentFiles = files.slice(0, 10);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Windows area */}
      <div className="absolute inset-0 pb-16">
        <WindowManager
          windows={windows.map(w => ({ ...w, content: renderWindowContent(w) }))}
          activeWindowId={activeWindowId}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
        />
      </div>

      {/* Start Menu */}
      <AnimatePresence>
        {showStartMenu && (
          <StartMenu
            isOpen={showStartMenu}
            onClose={() => setShowStartMenu(false)}
            onOpenApp={(appId, data) => {
              openWindow(appId, data);
              setShowStartMenu(false);
            }}
            recentFiles={recentFiles}
            favoriteItems={favoriteItems}
            user={user}
          />
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={focusWindow}
        onOpenStartMenu={() => setShowStartMenu(!showStartMenu)}
        showStartMenu={showStartMenu}
      />

      {/* Modals */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSave={handleSaveEvent}
        onDelete={(id) => {
          deleteEvent.mutate(id);
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        onMove={handleMoveEvent}
        initialDate={selectedDate}
      />

      <FolderCreateModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSubmit={handleCreateFolder}
        parentId={folderParentId}
      />

      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={() => queryClient.invalidateQueries({ queryKey: ['files'] })}
        currentFolderId={currentFolderId}
      />

      <MediaViewer
        file={viewerFile}
        files={files}
        isOpen={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setViewerFile(null);
        }}
        onNext={() => {
          const idx = files.findIndex(f => f.id === viewerFile?.id);
          if (idx < files.length - 1) setViewerFile(files[idx + 1]);
        }}
        onPrevious={() => {
          const idx = files.findIndex(f => f.id === viewerFile?.id);
          if (idx > 0) setViewerFile(files[idx - 1]);
        }}
      />
    </div>
  );
}