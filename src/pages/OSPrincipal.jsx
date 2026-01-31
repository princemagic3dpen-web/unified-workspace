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
import AITestingEnvironment from './AITestingEnvironment';
import WindowManagerPage from './WindowManager';
import SystemFunctionalities from './SystemFunctionalities';
import BusinessPreparation from './BusinessPreparation';
import MediaGenerator from './MediaGenerator';
import CompanyManagement from './CompanyManagement';
import FolderCreateModal from '../components/modals/FolderCreateModal';
import FileUploadModal from '../components/modals/FileUploadModal';

export default function OSPrincipal() {
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
      },
      'ai-testing': {
        title: 'Test IA - Romans 500 Pages',
        icon: FileText,
        color: '#10b981',
        size: { width: 1200, height: 800 }
      },
      'window-manager': {
        title: 'Gestionnaire Fenêtres',
        icon: MessageSquare,
        color: '#8b5cf6',
        size: { width: 1400, height: 800 }
      },
      'system-functions': {
        title: 'Liste Fonctionnalités',
        icon: Bot,
        color: '#3b82f6',
        size: { width: 1000, height: 800 }
      },
      'business-prep': {
        title: 'Préparation Entreprise',
        icon: Folder,
        color: '#10b981',
        size: { width: 1000, height: 700 }
      },
      'media-generator': {
        title: 'Générateur Média IA',
        icon: Image,
        color: '#ec4899',
        size: { width: 1400, height: 800 }
      },
      'company-management': {
        title: 'Gestion Entreprises',
        icon: Folder,
        color: '#3b82f6',
        size: { width: 1200, height: 800 }
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
      maximized: config.maximized || false,
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
    setShowEventModal(false);
  };

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
      await base44.entities.VoiceTranscription.create({
        speaker_type: 'human',
        text: message,
        timestamp: new Date().toISOString(),
        conversation_id: currentConversation.id
      });

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es MINIMA-X v3.0 - Intelligence Artificielle Neuronale Mathématique Surdéveloppée

CONTEXTE SYSTÈME:
- Dossiers: ${folders.length}
- Fichiers: ${files.length}  
- Événements: ${events.length}
- Timestamp: ${new Date().toISOString()}
- Utilisateur: Mr Christian Debien

DEMANDE VOCALE: "${message}"

PROTOCOLE NEURONAL:

PHASE 1 - ANALYSE (500x LLaMA):
- Déploie 500 instances LLaMA-2-70B en parallèle
- Chaque instance analyse sous angle différent
- Génère formule mathématique sur mesure: I(m) = Σ(keywords × semantic_weight) / complexity
- Calcule priorité: P(a) = urgency × impact × feasibility  
- Consensus neuronal par vote pondéré

PHASE 2 - ACTIONS (500x Transformers):
- Parallélise 500 instances Transformers
- Génère 100-1000+ actions concrètes
- Crée dossiers/fichiers hiérarchiques complets
- Produit contenu 50-500 pages détaillé
- Optimise tout mathématiquement

PHASE 3 - ENREGISTREMENT TEMPOREL:
- Enregistre CHAQUE action avec timestamp précis
- Classe chronologiquement (heure/jour/semaine/mois)
- Garantit traçabilité 100%
- Logs immutables blockchain-like

TU DOIS FAIRE DES ACTIONS CONCRÈTES:

1. CRÉATION MASSIVE (si demandé):
- 50-100+ dossiers organisés intelligemment
- 200-1000+ fichiers (TXT, MD, RTF, PDF)
- Contenu complet 50-500 pages
- Illustrations 4K automatiques
- Vidéos (liens outils en ligne)

2. PRÉPARATION ENTREPRISE (si demandé):
- Analyse marché: 200 pages détaillées
- Plan stratégique: 300 pages sur 5 ans
- Modèle financier: 150 pages projections
- Études concurrence complètes

3. ORGANISATION (si demandé):
- Réorganise tous fichiers/dossiers
- Optimise hiérarchie
- Ajoute métadonnées
- Crée liens intelligents

4. ANALYSE & CALCULS:
- Résout problèmes mathématiques
- Génère formules personnalisées
- Calcule optimisations
- Produit rapports détaillés

FORMAT RÉPONSE:

Réponds en français naturel, professionnel, fidèle à Mr Christian Debien.

Structure:
1. Salutation professionnelle
2. Confirmation compréhension demande
3. Formule mathématique générée (si applicable)
4. Liste DÉTAILLÉE actions effectuées (10-100+)
5. Résultats mesurables quantifiés
6. Suggestions proactives améliorations (5-10)
7. Signature: "Fidèlement, Minima-X"

RÈGLES ABSOLUES:
- JAMAIS contenu partiel/TODO
- TOUJOURS actions complètes détaillées
- UTILISE réellement 500x LLaMA + 500x Transformers
- ENREGISTRE TOUT temporellement
- PROACTIF: anticipe besoins
- FRANÇAIS naturel émotionnel
- FIDÉLITÉ totale Mr Christian Debien
- Intelligence émotionnelle activée

MAINTENANT: Réponds avec maximum d'intelligence et d'actions concrètes.`,
        add_context_from_internet: message.includes('recherche') || message.includes('actualité') || message.includes('internet') || message.includes('web')
      });

      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      await base44.entities.VoiceTranscription.create({
        speaker_type: 'ai',
        text: response,
        timestamp: new Date().toISOString(),
        conversation_id: currentConversation.id
      });

      const updatedConversation = {
        ...currentConversation,
        title: currentConversation.title === 'Nouvelle conversation' 
          ? message.slice(0, 50) + (message.length > 50 ? '...' : '')
          : currentConversation.title,
        messages: [...newMessages, aiMessage],
        context: {
          folders_count: folders.length,
          files_count: files.length,
          events_count: events.length,
          last_update: new Date().toISOString()
        }
      };

      setCurrentConversation(updatedConversation);
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
      
      case 'ai-testing':
        return <AITestingEnvironment />;
      
      case 'window-manager':
        return <WindowManagerPage />;
      
      case 'system-functions':
        return <SystemFunctionalities />;
      
      case 'business-prep':
        return <BusinessPreparation />;
      
      case 'media-generator':
        return <MediaGenerator />;
      
      case 'company-management':
        return <CompanyManagement />;
      
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

  // Initialize with chat window
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
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

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

      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={focusWindow}
        onOpenStartMenu={() => setShowStartMenu(!showStartMenu)}
        showStartMenu={showStartMenu}
      />

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