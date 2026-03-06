import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown,
  Plus,
  Upload,
  FolderPlus,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Move,
  Star,
  StarOff,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Zap,
  X,
  Play,
  Loader2,
  Brain,
  GitMerge,
  Scissors,
  Wand2,
  BookOpen,
  List,
  Download,
  CheckCircle2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const FILE_ICONS = {
  document: FileText,
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  spreadsheet: FileSpreadsheet,
  presentation: Presentation,
  pdf: FileText,
  text: FileText,
  other: File
};

const AI_ACTIONS = [
  // --- STRUCTURE ---
  { id: 'fusion', label: '🔗 Fusionner fichiers', icon: GitMerge, desc: 'Fusionne tous les fichiers en un document maître structuré', category: 'Structure' },
  { id: 'defusion', label: '✂️ Défusionner / Éclater', icon: Scissors, desc: 'Divise les fichiers en sous-fichiers thématiques numérotés', category: 'Structure' },
  { id: 'reorganize', label: '🗂️ Réorganisation IA', icon: Brain, desc: 'Propose une hiérarchie optimale de dossiers et fichiers', category: 'Structure' },
  { id: 'rename_all', label: '✏️ Renommer intelligemment', icon: Edit, desc: 'Renomme tous les fichiers avec des noms clairs et cohérents', category: 'Structure' },
  { id: 'duplicate_detect', label: '🔍 Détecter doublons', icon: Copy, desc: 'Identifie les fichiers en double ou très similaires', category: 'Structure' },
  // --- CONTENU ---
  { id: 'rewrite', label: '✨ Réécriture & Embellissement', icon: Wand2, desc: 'Réécrit tous les textes avec style professionnel QI∞', category: 'Contenu' },
  { id: 'table_contents', label: '📋 Table des matières', icon: BookOpen, desc: 'Génère une table des matières hiérarchique complète', category: 'Contenu' },
  { id: 'thematic', label: '🏷️ Listing thématique', icon: List, desc: 'Classe les fichiers par thèmes détectés automatiquement', category: 'Contenu' },
  { id: 'summary', label: '📝 Résumé global', icon: FileText, desc: 'Produit un résumé exécutif de tous les fichiers du dossier', category: 'Contenu' },
  { id: 'keywords', label: '🔑 Extraction mots-clés', icon: Brain, desc: 'Extrait les mots-clés et concepts majeurs de chaque fichier', category: 'Contenu' },
  { id: 'translate_fr', label: '🇫🇷 Traduire en Français', icon: BookOpen, desc: 'Traduit tous les fichiers en français professionnel', category: 'Contenu' },
  { id: 'translate_en', label: '🇬🇧 Traduire en Anglais', icon: BookOpen, desc: 'Traduit tous les fichiers en anglais professionnel', category: 'Contenu' },
  // --- ANALYSE ---
  { id: 'audit', label: '🔬 Audit qualité', icon: CheckCircle2, desc: 'Analyse la qualité, cohérence et complétude de tous les fichiers', category: 'Analyse' },
  { id: 'gap_analysis', label: '📊 Analyse des manques', icon: List, desc: 'Détecte ce qui manque et propose des fichiers à créer', category: 'Analyse' },
  { id: 'cross_refs', label: '🔗 Références croisées', icon: GitMerge, desc: 'Identifie les liens et dépendances entre fichiers', category: 'Analyse' },
  { id: 'stats', label: '📈 Statistiques & métriques', icon: Brain, desc: 'Produit des statistiques détaillées sur le contenu du dossier', category: 'Analyse' },
  // --- GÉNÉRATION ---
  { id: 'generate_readme', label: '📄 Générer README', icon: FileText, desc: 'Génère un README complet pour ce dossier/projet', category: 'Génération' },
  { id: 'generate_report', label: '📑 Rapport PDF prêt', icon: Download, desc: 'Génère un rapport complet au format Markdown exportable', category: 'Génération' },
  { id: 'generate_index', label: '🗃️ Index complet', icon: List, desc: 'Crée un index détaillé de tous les fichiers et leur contenu', category: 'Génération' },
  { id: 'generate_tags', label: '🏷️ Tags automatiques', icon: Star, desc: 'Génère et assigne des tags à chaque fichier automatiquement', category: 'Génération' },
  // --- MHTML / WEB ---
  { id: 'mhtml_extract', label: '🌐 Extraire MHTML', icon: Download, desc: 'Extrait et structure le contenu de tous les fichiers MHTML', category: 'MHTML' },
  { id: 'mhtml_convert', label: '🔄 Convertir MHTML→MD', icon: FileCode, desc: 'Convertit les fichiers MHTML en Markdown propre et lisible', category: 'MHTML' },
];

export default function FileExplorer({
  folders = [],
  files = [],
  currentFolderId,
  onFolderClick,
  onFileClick,
  onCreateFolder,
  onUploadFile,
  onRename,
  onDelete,
  onMove,
  onToggleFavorite,
  onDrop
}) {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [dragOverId, setDragOverId] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [runningActionId, setRunningActionId] = useState(null);
  const [actionResult, setActionResult] = useState('');
  const [progress, setProgress] = useState(0);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const startRename = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const finishRename = (id, type) => {
    if (editName.trim()) {
      onRename(id, editName.trim(), type);
    }
    setEditingId(null);
    setEditName('');
  };

  const handleDragStart = (e, item, type) => {
    e.dataTransfer.setData('itemId', item.id);
    e.dataTransfer.setData('itemType', type);
  };

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    setDragOverId(folderId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e, targetFolderId) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const itemType = e.dataTransfer.getData('itemType');
    
    if (itemId && onDrop) {
      onDrop(itemId, itemType, targetFolderId);
    }
    setDragOverId(null);
  };

  const currentFolderFiles = files.filter(f => f.folder_id === currentFolderId);
  const currentSubFolders = folders.filter(f => f.parent_id === currentFolderId);

  const FileIcon = ({ type }) => {
    const Icon = FILE_ICONS[type] || FILE_ICONS.other;
    return <Icon className="w-5 h-5" />;
  };

  const renderFolder = (folder, depth = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const subFolders = folders.filter(f => f.parent_id === folder.id);
    const folderFiles = files.filter(f => f.folder_id === folder.id);
    const isSelected = currentFolderId === folder.id;
    const isDragOver = dragOverId === folder.id;

    return (
      <div key={folder.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer
                transition-all duration-200 group
                ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-800'}
                ${isDragOver ? 'ring-2 ring-blue-400 bg-blue-100' : ''}
              `}
              style={{ paddingLeft: `${depth * 16 + 12}px` }}
              onClick={() => {
                onFolderClick(folder.id);
                if (subFolders.length > 0) toggleFolder(folder.id);
              }}
              onDragOver={(e) => handleDragOver(e, folder.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, folder.id)}
              draggable
              onDragStart={(e) => handleDragStart(e, folder, 'folder')}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                className="w-4 h-4 flex-shrink-0"
              >
                {(subFolders.length > 0 || folderFiles.length > 0) && (
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                )}
              </motion.div>
              
              <div 
                className="p-1.5 rounded-lg flex-shrink-0"
                style={{ backgroundColor: folder.color + '30' }}
              >
                <Folder className="w-4 h-4" style={{ color: isSelected ? '#ffffff' : folder.color || '#3b82f6' }} />
              </div>
              
              {editingId === folder.id ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => finishRename(folder.id, 'folder')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') finishRename(folder.id, 'folder');
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="h-6 py-0 px-1 text-sm bg-white border-slate-300 text-slate-900"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className={`text-sm font-medium truncate flex-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {folder.name}
                </span>
              )}

              {folder.is_favorite && (
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0 ${isSelected ? 'text-white hover:bg-white/20' : 'text-slate-600 hover:bg-slate-200'}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => startRename(folder.id, folder.name)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Renommer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleFavorite(folder.id, 'folder')}>
                    {folder.is_favorite ? (
                      <>
                        <StarOff className="w-4 h-4 mr-2" />
                        Retirer des favoris
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Ajouter aux favoris
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(folder.id, 'folder')}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </ContextMenuTrigger>
          
          <ContextMenuContent className="rounded-xl">
            <ContextMenuItem onClick={() => onCreateFolder(folder.id)}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Nouveau sous-dossier
            </ContextMenuItem>
            <ContextMenuItem onClick={() => startRename(folder.id, folder.name)}>
              <Edit className="w-4 h-4 mr-2" />
              Renommer
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onClick={() => onDelete(folder.id, 'folder')}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {subFolders.map(sub => renderFolder(sub, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderFile = (file) => {
    const FileIconComponent = FILE_ICONS[file.file_type] || FILE_ICONS.other;

    return (
      <ContextMenu key={file.id}>
        <ContextMenuTrigger>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer group"
            onClick={() => onFileClick(file)}
            draggable
            onDragStart={(e) => handleDragStart(e, file, 'file')}
          >
            <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-blue-600 transition-colors">
              <FileIconComponent className="w-5 h-5 text-slate-600 group-hover:text-white" />
            </div>
            
            {editingId === file.id ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => finishRename(file.id, 'file')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') finishRename(file.id, 'file');
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="flex-1 h-7 bg-white border-slate-300 text-slate-900"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                {file.size && (
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
            )}

            {file.is_favorite && (
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 flex-shrink-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => onFileClick(file)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Ouvrir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => startRename(file.id, file.name)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Renommer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFavorite(file.id, 'file')}>
                  {file.is_favorite ? (
                    <>
                      <StarOff className="w-4 h-4 mr-2" />
                      Retirer des favoris
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Ajouter aux favoris
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(file.id, 'file')}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="rounded-xl">
          <ContextMenuItem onClick={() => onFileClick(file)}>
            <FileText className="w-4 h-4 mr-2" />
            Ouvrir
          </ContextMenuItem>
          <ContextMenuItem onClick={() => startRename(file.id, file.name)}>
            <Edit className="w-4 h-4 mr-2" />
            Renommer
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            onClick={() => onDelete(file.id, 'file')}
            className="text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const runAIAction = async (action) => {
    const currentFolder = folders.find(f => f.id === currentFolderId);
    const contextFiles = currentFolderId
      ? files.filter(f => f.folder_id === currentFolderId)
      : files;
    const contextFolders = currentFolderId
      ? folders.filter(f => f.parent_id === currentFolderId)
      : folders.filter(f => !f.parent_id);

    if (contextFiles.length === 0 && contextFolders.length === 0) {
      toast.warning('Aucun fichier ou dossier dans ce contexte');
      return;
    }

    setRunningActionId(action.id);
    setActionResult('');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => { if (p >= 85) { clearInterval(interval); return 85; } return p + Math.random() * 10 + 3; });
    }, 500);

    const fileList = contextFiles.map(f => `- ${f.name} (${f.file_type || 'autre'}, ${f.size ? Math.round(f.size/1024)+'KB' : '?'})${f.content ? ': ' + f.content.slice(0, 200) : ''}`).join('\n');
    const folderList = contextFolders.map(f => `- ${f.name}`).join('\n');

    const ctx = `Dossier: "${currentFolder?.name || 'Racine'}" | Fichiers (${contextFiles.length}): ${fileList || 'aucun'} | Sous-dossiers: ${folderList || 'aucun'}`;
    const prompts = {
      fusion: `MINIMA-X QI∞ - FUSION INTELLIGENTE\n${ctx}\n\nFusionne tous ces fichiers en un document maître:\n1. Table des matières numérotée\n2. Chaque fichier = une section\n3. Introduction et conclusion\n4. Index des concepts clés\nProduis le document fusionné complet.`,
      defusion: `MINIMA-X QI∞ - DÉFUSION / ÉCLATEMENT\n${ctx}\n\nÉclate ces fichiers en sous-fichiers thématiques (001_theme.md, 002_theme.md...):\n- Détecte les thèmes\n- Liste chaque fichier créé avec son contenu résumé\nProduis le plan complet de décomposition.`,
      reorganize: `MINIMA-X QI∞ - RÉORGANISATION INTELLIGENTE\n${ctx}\n\nPropose une réorganisation optimale:\n1. Nouvelle hiérarchie de dossiers\n2. Quel fichier va où (justification)\n3. Dossiers à créer\n4. Fichiers à renommer\n5. Structure finale optimisée\nProduis le plan complet.`,
      rename_all: `MINIMA-X QI∞ - RENOMMAGE INTELLIGENT\n${ctx}\n\nPour chaque fichier, propose un nouveau nom:\n- Clair, descriptif, sans espaces (snake_case)\n- Cohérent avec le contenu\n- Préfixe numéroté si ordre logique\nFormat: ancien_nom.ext → nouveau_nom.ext (raison)\nProduis la liste complète des renommages.`,
      duplicate_detect: `MINIMA-X QI∞ - DÉTECTION DE DOUBLONS\n${ctx}\n\nAnalyse ces fichiers pour détecter:\n1. Fichiers identiques (même contenu)\n2. Fichiers très similaires (>70% commun)\n3. Fichiers redondants\nFormat: Groupe X: [fichier1, fichier2] → Recommandation (garder/fusionner/supprimer)\nProduis l'analyse complète.`,
      rewrite: `MINIMA-X QI∞ - RÉÉCRITURE & EMBELLISSEMENT\n${ctx}\n\nRéécris et embellis tous ces textes:\n- Style professionnel élégant\n- Vocabulaire riche et précis\n- Titres dynamiques et captivants\n- Mise en forme Markdown parfaite + emojis\nProduis la version embellie complète.`,
      table_contents: `MINIMA-X QI∞ - TABLE DES MATIÈRES\n${ctx}\n\nGénère une table des matières complète:\n1. Format Markdown avec ancres\n2. Hiérarchie: Dossiers → Fichiers → Sections\n3. Description de chaque fichier (2-3 lignes)\n4. Tags et catégories automatiques\n5. Numéros de référence\nProduis la table complète.`,
      thematic: `MINIMA-X QI∞ - LISTING THÉMATIQUE\n${ctx}\n\nClasse ces fichiers par thèmes:\n- Détecte 5-20 thèmes majeurs\n- Pour chaque thème: fichiers associés + description\n- Connexions entre thèmes\n- Score: R(t) = freq × depth\n- Suggestions de nouveaux fichiers\nProduis le listing thématique complet.`,
      summary: `MINIMA-X QI∞ - RÉSUMÉ GLOBAL\n${ctx}\n\nProduis un résumé exécutif complet:\n1. Vue d'ensemble du dossier (5-10 lignes)\n2. Résumé de chaque fichier (3-5 lignes)\n3. Points clés et insights majeurs\n4. Connexions entre les documents\n5. Recommandations\nProduis le résumé complet maintenant.`,
      keywords: `MINIMA-X QI∞ - EXTRACTION MOTS-CLÉS\n${ctx}\n\nExtrait pour chaque fichier:\n- Top 10 mots-clés avec score de fréquence\n- Concepts majeurs et entités nommées\n- Nuage de mots global du dossier\n- Ontologie des concepts (hiérarchie)\nFormat Markdown avec tableaux.\nProduis l'extraction complète.`,
      translate_fr: `MINIMA-X QI∞ - TRADUCTION FRANÇAIS\n${ctx}\n\nTraduis tous ces fichiers en français professionnel:\n- Garde la mise en forme Markdown\n- Adapte les expressions idiomatiques\n- Conserve les termes techniques\n- Ajoute un en-tête [TRADUIT EN FR]\nProduis la traduction complète de chaque fichier.`,
      translate_en: `MINIMA-X QI∞ - TRANSLATION TO ENGLISH\n${ctx}\n\nTranslate all these files to professional English:\n- Keep Markdown formatting\n- Adapt idiomatic expressions\n- Keep technical terms\n- Add header [TRANSLATED TO EN]\nProduce the complete translation of each file.`,
      audit: `MINIMA-X QI∞ - AUDIT QUALITÉ\n${ctx}\n\nAudit complet de qualité:\n1. Score global /100 pour chaque fichier\n2. Cohérence et complétude\n3. Erreurs et incohérences détectées\n4. Points forts et points faibles\n5. Actions correctives prioritaires\nProduis le rapport d'audit complet.`,
      gap_analysis: `MINIMA-X QI∞ - ANALYSE DES MANQUES\n${ctx}\n\nDétecte ce qui manque:\n1. Fichiers absents mais nécessaires\n2. Sections manquantes dans les fichiers existants\n3. Informations critiques absentes\n4. Dossiers à créer\n5. Plan d'action pour combler les lacunes\nProduis l'analyse des manques complète.`,
      cross_refs: `MINIMA-X QI∞ - RÉFÉRENCES CROISÉES\n${ctx}\n\nIdentifie toutes les connexions:\n1. Fichiers qui se référencent mutuellement\n2. Concepts partagés entre fichiers\n3. Dépendances logiques\n4. Carte des relations (format texte arborescent)\n5. Suggestions de liens à ajouter\nProduis la carte complète des références croisées.`,
      stats: `MINIMA-X QI∞ - STATISTIQUES & MÉTRIQUES\n${ctx}\n\nProduis des statistiques complètes:\n- Nombre total de fichiers / dossiers\n- Taille totale et répartition par type\n- Fichier le plus volumineux / le plus petit\n- Distribution par catégorie\n- Densité d'information par fichier\n- Top 5 fichiers les plus riches\nProduis le rapport statistique complet.`,
      generate_readme: `MINIMA-X QI∞ - GÉNÉRATION README\n${ctx}\n\nGénère un README.md professionnel complet:\n# Titre du projet\n## Description\n## Structure des fichiers\n## Contenu\n## Comment utiliser\n## Auteur & Date\nFormat Markdown parfait avec badges et emojis.\nProduis le README complet maintenant.`,
      generate_report: `MINIMA-X QI∞ - RAPPORT COMPLET\n${ctx}\n\nGénère un rapport formel complet:\n1. Page de garde\n2. Résumé exécutif\n3. Table des matières\n4. Analyse détaillée par fichier\n5. Synthèse et recommandations\n6. Annexes\nFormat Markdown exportable PDF. Produis le rapport complet.`,
      generate_index: `MINIMA-X QI∞ - INDEX COMPLET\n${ctx}\n\nGénère un index exhaustif:\n- Chaque fichier avec: nom, type, taille, résumé 1 ligne, mots-clés\n- Index alphabétique des concepts\n- Index par type de fichier\n- Index par thème\nFormat Markdown avec tableaux. Produis l'index complet.`,
      generate_tags: `MINIMA-X QI∞ - TAGS AUTOMATIQUES\n${ctx}\n\nGénère des tags pour chaque fichier:\n- 5-10 tags précis par fichier\n- Tags de type, thème, audience, niveau\n- Tags partagés entre fichiers (famille)\n- Taxonomie globale du dossier\nFormat: fichier.ext → [tag1, tag2, ...]\nProduis la liste complète des tags.`,
      mhtml_extract: `MINIMA-X QI∞ - EXTRACTION MHTML\n${ctx}\n\nExtrait et structure le contenu MHTML:\n1. Titre de chaque page web\n2. Contenu principal (sans pub ni nav)\n3. Liens et références importantes\n4. Images et médias référencés\n5. Métadonnées (date, auteur, source)\nProduis le contenu extrait et structuré.`,
      mhtml_convert: `MINIMA-X QI∞ - CONVERSION MHTML→MARKDOWN\n${ctx}\n\nConvertis les fichiers MHTML en Markdown propre:\n- Supprime le HTML, garde le contenu\n- Conserve la structure (titres, listes, tableaux)\n- Nettoie les artefacts web\n- Ajoute en-tête avec source et date\nProduis le Markdown propre de chaque fichier.`,
    };

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt: prompts[action.id] });
      clearInterval(interval);
      setProgress(100);
      setActionResult(response);
      toast.success(`✅ ${action.label} terminé`);
    } catch (e) {
      clearInterval(interval);
      setProgress(0);
      toast.error('Erreur lors de l\'action IA');
    }
    setRunningActionId(null);
  };

  const rootFolders = folders.filter(f => !f.parent_id);

  const currentFolder = folders.find(f => f.id === currentFolderId);
  const contextFilesCount = currentFolderId ? files.filter(f => f.folder_id === currentFolderId).length : files.length;

  return (
    <div className="h-full flex bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden">
      {/* Left Sidebar - Folder Tree */}
      <div className="w-80 flex flex-col border-r border-slate-300 bg-slate-50">
        {/* Header */}
        <div className="p-4 border-b border-slate-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dossiers</h2>
              <p className="text-xs text-slate-600">
                {folders.length} dossiers
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateFolder(currentFolderId)}
            className="w-full rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Nouveau dossier
          </Button>
        </div>

        {/* Folder tree */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {rootFolders.map(folder => renderFolder(folder))}
          </div>
          
          {folders.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="p-4 rounded-2xl bg-slate-100 mb-4">
                <Folder className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-700 mb-2">Aucun dossier</p>
              <p className="text-sm text-slate-500">
                Créez votre premier dossier
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Content - Files */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-slate-300 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {currentFolderId 
                  ? folders.find(f => f.id === currentFolderId)?.name || 'Fichiers'
                  : 'Tous les fichiers'
                }
              </h2>
              <p className="text-sm text-slate-600">
                {currentFolderFiles.length} fichier{currentFolderFiles.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => { setShowAIPanel(!showAIPanel); setActionResult(''); }}
                className={`rounded-xl text-white ${showAIPanel ? 'bg-purple-700 hover:bg-purple-800' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}`}
              >
                <Zap className="w-4 h-4 mr-2" />
                Actions IA
              </Button>
              <Button
                size="sm"
                onClick={onUploadFile}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
            </div>
          </div>
        </div>

        {/* Files grid - pleine largeur, jamais réduit */}
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full p-4">
            {currentFolderFiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentFolderFiles.map(file => renderFile(file))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="p-6 rounded-2xl bg-slate-100 mb-4">
                  <File className="w-16 h-16 text-slate-400" />
                </div>
                <p className="text-slate-800 text-lg mb-2">Aucun fichier</p>
                <p className="text-sm text-slate-600 mb-4">
                  Importez des fichiers ou demandez à l'IA d'en créer
                </p>
                <Button
                  variant="outline"
                  onClick={onUploadFile}
                  className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importer des fichiers
                </Button>
              </div>
            )}
          </ScrollArea>

          {/* Modal overlay Actions IA - flotte au-dessus sans réduire la grille */}
          <AnimatePresence>
            {showAIPanel && (
              <>
                {/* Backdrop semi-transparent */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"
                  onClick={() => setShowAIPanel(false)}
                />
                {/* Panneau centré flottant */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-4 z-20 bg-gradient-to-b from-slate-900 to-purple-950 rounded-2xl border border-purple-700/50 shadow-2xl flex flex-col overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="font-bold text-white text-base">Actions IA</span>
                      <Badge className="bg-purple-700 text-white text-xs">{contextFilesCount} fichier{contextFilesCount > 1 ? 's' : ''}</Badge>
                      <span className="text-xs text-slate-400 ml-1">— {currentFolder?.name || 'Racine'}</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => setShowAIPanel(false)} className="h-7 w-7 text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Corps scrollable avec catégories */}
                  <div className="flex-1 overflow-hidden flex">
                    <ScrollArea className="flex-1">
                      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Structure', 'Contenu', 'Analyse', 'Génération', 'MHTML'].map(category => {
                          const catActions = AI_ACTIONS.filter(a => a.category === category);
                          const catColors = {
                            Structure: 'text-blue-300 border-blue-700',
                            Contenu: 'text-emerald-300 border-emerald-700',
                            Analyse: 'text-yellow-300 border-yellow-700',
                            Génération: 'text-orange-300 border-orange-700',
                            MHTML: 'text-cyan-300 border-cyan-700',
                          };
                          return (
                            <div key={category} className="col-span-full">
                              <p className={`text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b ${catColors[category]}`}>{category}</p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {catActions.map(action => {
                                  const Icon = action.icon;
                                  const isRunning = runningActionId === action.id;
                                  return (
                                    <div key={action.id} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-purple-600 transition-colors">
                                      <div className="flex items-start gap-2 mb-2">
                                        <Icon className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold text-white leading-tight">{action.label}</p>
                                          <p className="text-xs text-slate-400 mt-0.5 leading-tight">{action.desc}</p>
                                        </div>
                                      </div>
                                      {isRunning && (
                                        <div className="mb-2">
                                          <div className="w-full bg-slate-700 rounded-full h-1">
                                            <motion.div
                                              className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400"
                                              animate={{ width: `${progress}%` }}
                                              transition={{ duration: 0.4 }}
                                            />
                                          </div>
                                          <p className="text-xs text-slate-400 mt-1">{Math.round(progress)}%...</p>
                                        </div>
                                      )}
                                      <Button
                                        size="sm"
                                        onClick={() => runAIAction(action)}
                                        disabled={!!runningActionId}
                                        className="w-full h-7 text-xs bg-purple-800 hover:bg-purple-600 text-white"
                                      >
                                        {isRunning ? (
                                          <><Loader2 className="w-3 h-3 animate-spin mr-1" />En cours...</>
                                        ) : (
                                          <><Play className="w-3 h-3 mr-1" />Lancer</>
                                        )}
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>

                    {/* Zone résultat à droite si présent */}
                    {actionResult && (
                      <div className="w-80 border-l border-slate-700 flex flex-col flex-shrink-0">
                        <div className="p-3 bg-slate-800 flex items-center justify-between flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-semibold text-green-300">Résultat IA</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" className="h-6 px-2 text-xs bg-indigo-700 hover:bg-indigo-600"
                              onClick={() => { navigator.clipboard.writeText(actionResult); toast.success('Copié!'); }}>
                              Copier
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 px-1 text-xs text-slate-400"
                              onClick={() => setActionResult('')}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <ScrollArea className="flex-1">
                          <pre className="p-3 text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{actionResult}</pre>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}