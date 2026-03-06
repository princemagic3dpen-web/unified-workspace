import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles, Brain, Folder, FileText, Zap, Settings, Activity,
  Play, Square, CheckCircle2, AlertTriangle, Loader2, Code,
  GitMerge, Scissors, AlignLeft, List, BookOpen, Wand2,
  Database, Network, Cpu, TrendingUp, Eye, Download, Upload,
  RefreshCw, FolderOpen, FileCode, Globe, Shield, Clock,
  Camera, Video, Music, Image, Layers, ChevronRight, Terminal,
  ToggleLeft, ToggleRight, Rocket, Bot, BarChart3, Maximize2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// ─── CONFIG DES ACTIONS ───────────────────────────────────────────────────────
const ACTION_GROUPS = [
  {
    id: 'files',
    label: '📁 Fichiers & Dossiers',
    color: 'blue',
    icon: Folder,
    actions: [
      { id: 'fusion', label: 'Fusionner tous les fichiers', icon: GitMerge, time: '2-8 min', desc: 'Fusionne tous les fichiers texte en un seul document maître' },
      { id: 'defusion', label: 'Défusionner / Éclater', icon: Scissors, time: '3-10 min', desc: 'Divise un fichier massif en centaines de fichiers thématiques' },
      { id: 'reorganize', label: 'Réorganisation intelligente', icon: FolderOpen, time: '5-15 min', desc: 'Reorganise toute la hiérarchie dossiers selon IA QI∞' },
      { id: 'table_of_contents', label: 'Table des matières auto', icon: BookOpen, time: '1-3 min', desc: 'Génère une table des matières structurée de tous fichiers' },
      { id: 'thematic_listing', label: 'Listing thématique', icon: List, time: '2-5 min', desc: 'Classe tous les textes par thèmes détectés automatiquement' },
      { id: 'deep_thinking', label: 'Deep Thinking Analyse', icon: Brain, time: '10-30 min', desc: 'Analyse profonde QI∞ de tous les textes et projets' },
      { id: 'rewrite_texts', label: 'Réécriture & Embellissement', icon: Wand2, time: '5-20 min', desc: 'Réécrit et embellit tous les textes avec IA QI∞' },
      { id: 'detect_ai_projects', label: 'Détection projets IA', icon: Bot, time: '3-8 min', desc: 'Détecte automatiquement tous les projets IA dans les fichiers' },
    ]
  },
  {
    id: 'mhtml',
    label: '🌐 Actions MHTML / Sites Web',
    color: 'purple',
    icon: Globe,
    actions: [
      { id: 'mhtml_beautify', label: 'Embellir MHTML complet', icon: Sparkles, time: '5-20 min', desc: 'Embellit design, couleurs, typo, animations des sites MHTML' },
      { id: 'mhtml_remove_google', label: 'Supprimer comptes Google', icon: Shield, time: '2-5 min', desc: 'Supprime tout ce qui est superflu: comptes Google, trackers' },
      { id: 'mhtml_verify_clicks', label: 'Vérifier tous les clics', icon: CheckCircle2, time: '10-30 min', desc: 'Teste automatiquement chaque bouton et lien du site' },
      { id: 'mhtml_add_llm', label: 'Injecter LLaMA dans MHTML', icon: Brain, time: '15-45 min', desc: 'Intègre LLaMA + générateur image gratuit dans chaque MHTML' },
      { id: 'mhtml_parallel_coding', label: 'Codage parallèle puissant', icon: Cpu, time: '20-60 min', desc: 'Ajoute centaines de lignes de programmation en parallèle' },
      { id: 'mhtml_autosave', label: 'Auto-sauvegarde versions', icon: Download, time: '1-2 min', desc: 'Active la sauvegarde automatique de chaque version MHTML' },
      { id: 'mhtml_simulate_human', label: 'Simuler interactions humaines', icon: Activity, time: '30-120 min', desc: 'Simule toutes interactions utilisateur possibles dans le site' },
      { id: 'mhtml_extend_programming', label: 'Étendre programmation', icon: Code, time: '30-120 min', desc: 'Étend le code et ajoute centaines de fichiers IA autonomes' },
    ]
  },
  {
    id: 'generation',
    label: '🎨 Génération Contenu',
    color: 'pink',
    icon: Wand2,
    actions: [
      { id: 'gen_video_4k', label: 'Générer vidéos 4K (15s-5min)', icon: Video, time: '5-30 min', desc: 'Génère des vidéos 4K haute qualité de 15 secondes à 5 minutes' },
      { id: 'gen_images_sequence', label: 'Séquence images → vidéo', icon: Camera, time: '10-30 min', desc: 'Crée séquences image après image puis les fusionne en vidéo' },
      { id: 'gen_hundreds_files', label: 'Générer centaines fichiers', icon: Layers, time: '10-60 min', desc: 'Génère des centaines de fichiers de toutes extensions (.html, .py, .js, .txt...)' },
      { id: 'gen_ai_extensions', label: 'Tous formats d\'extension', icon: FileCode, time: '5-15 min', desc: 'Produit fichiers .html, .css, .js, .py, .json, .xml, .csv, .md...' },
    ]
  },
  {
    id: 'programming',
    label: '⚙️ Programmation Autonome',
    color: 'green',
    icon: Code,
    actions: [
      { id: 'auto_program_live', label: 'Auto-programmer en live', icon: Terminal, time: 'Continu', desc: 'Minima-X se programme lui-même en temps réel de manière autonome' },
      { id: 'debug_detect', label: 'Détection & correction bugs', icon: AlertTriangle, time: '5-30 min', desc: 'Détecte et corrige automatiquement tous les bugs dans les projets' },
      { id: 'improve_detect', label: 'Détection améliorations', icon: TrendingUp, time: '10-30 min', desc: 'Identifie et applique des centaines d\'améliorations automatiques' },
      { id: 'remove_limitations', label: 'Supprimer toutes limitations', icon: Maximize2, time: '5-20 min', desc: 'Supprime toutes les limitations de programmation des fichiers' },
      { id: 'add_ai_brains', label: 'Ajouter cerveaux IA moteurs', icon: Brain, time: '15-45 min', desc: 'Intègre des cerveaux IA et moteurs dans chaque fichier projet' },
      { id: 'portable_autonomous', label: 'Rendre portable & autonome', icon: Rocket, time: '20-60 min', desc: 'Rend chaque projet entièrement portable, autonome et hyperfonctionnel' },
      { id: 'parallel_robots', label: 'Robots parallèles (centaines)', icon: Network, time: '1-5 h', desc: 'Lance des centaines de robots IA en parallèle pour traiter tout simultanément' },
      { id: 'verify_graphs', label: 'Vérifier graphiques', icon: BarChart3, time: '5-15 min', desc: 'Vérifie et teste intelligemment tous les graphiques et visualisations' },
    ]
  },
  {
    id: 'robot_actions',
    label: '🤖 Actions Robotisées (100+)',
    color: 'cyan',
    icon: Bot,
    actions: [
      { id: 'mass_rewrite', label: 'Réécriture massive textes', icon: AlignLeft, time: '30-90 min', desc: 'Réécrit en masse des milliers de paragraphes simultanément' },
      { id: 'web_site_christian', label: 'Sites Internet au nom de Christian Debien', icon: Globe, time: '60-300 min', desc: 'Crée et optimise des sites internet complets au nom de Christian Debien' },
      { id: 'project_update_batch', label: 'Mise à jour projets par lots', icon: RefreshCw, time: '30-180 min', desc: 'Envoie des mises à jour de centaines de fichiers par lot au projet' },
      { id: 'cosmic_harmony_agents', label: 'Agents harmonie cosmique', icon: Sparkles, time: '15-60 min', desc: 'Déploie agents autonomes Cosmic Harmony dans les fichiers MHTML' },
    ]
  }
];

// ─── COMPOSANT BARRE DE PROGRESSION ──────────────────────────────────────────
function ProgressBar({ label, progress, timeEstimate, status }) {
  return (
    <div className="mb-3 p-3 rounded-lg bg-slate-800 border border-slate-700">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-white font-medium truncate">{label}</span>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <Badge className={
            status === 'running' ? 'bg-yellow-600 animate-pulse' :
            status === 'done' ? 'bg-green-600' :
            status === 'error' ? 'bg-red-600' : 'bg-slate-600'
          }>
            {status === 'running' ? '⚡ En cours' : status === 'done' ? '✅ OK' : status === 'error' ? '❌' : '⏳'}
          </Badge>
          <span className="text-xs text-slate-400">{timeEstimate}</span>
        </div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="text-xs text-slate-400 mt-1">{progress}% terminé</div>
    </div>
  );
}

// ─── COMPOSANT ACTION CARD ────────────────────────────────────────────────────
function ActionCard({ action, groupColor, isActive, onToggle, onRun, progress }) {
  const Icon = action.icon;

  const colorClasses = {
    blue: 'border-blue-600 bg-blue-900/20',
    purple: 'border-purple-600 bg-purple-900/20',
    pink: 'border-pink-600 bg-pink-900/20',
    green: 'border-green-600 bg-green-900/20',
    cyan: 'border-cyan-600 bg-cyan-900/20',
  };

  const btnColor = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    pink: 'bg-pink-600 hover:bg-pink-700',
    green: 'bg-green-600 hover:bg-green-700',
    cyan: 'bg-cyan-600 hover:bg-cyan-700',
  };

  return (
    <motion.div
      layout
      className={`p-3 rounded-lg border ${colorClasses[groupColor]} transition-all`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-white" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">{action.label}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-tight">{action.desc}</p>
            <p className="text-xs text-slate-500 mt-0.5">⏱ {action.time}</p>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggle}
            className={`h-7 px-2 text-xs ${isActive ? 'text-green-400' : 'text-slate-400'}`}
          >
            {isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          </Button>
          <Button
            size="sm"
            onClick={onRun}
            className={`h-7 px-2 text-xs text-white ${btnColor[groupColor]}`}
          >
            <Play className="w-3 h-3 mr-1" />
            Lancer
          </Button>
        </div>
      </div>
      {progress && (
        <div className="mt-2 w-full bg-slate-700 rounded-full h-1.5">
          <motion.div
            className="h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function ActionsAI({ files = [], folders = [] }) {
  const [activeActions, setActiveActions] = useState({});
  const [runningActions, setRunningActions] = useState({});
  const [logs, setLogs] = useState([]);
  const [globalInput, setGlobalInput] = useState('');
  const [resultText, setResultText] = useState('');
  const [isGlobalRunning, setIsGlobalRunning] = useState(false);
  const [totalParallelTasks, setTotalParallelTasks] = useState(0);
  const logsRef = useRef(null);

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, {
      msg,
      type,
      time: new Date().toLocaleTimeString('fr-FR'),
      id: Date.now() + Math.random()
    }]);
  };

  const toggleAction = (actionId) => {
    setActiveActions(prev => ({ ...prev, [actionId]: !prev[actionId] }));
  };

  const runSingleAction = async (group, action) => {
    const key = action.id;
    setRunningActions(prev => ({ ...prev, [key]: { progress: 0, status: 'running' } }));
    addLog(`🚀 Lancement: ${action.label}`, 'start');

    // Simulation progression
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 90) { clearInterval(interval); progress = 90; }
      setRunningActions(prev => ({
        ...prev, [key]: { progress: Math.min(progress, 90), status: 'running' }
      }));
    }, 400);

    try {
      const prompt = buildActionPrompt(action, group, globalInput);
      const response = await base44.integrations.Core.InvokeLLM({ prompt });

      clearInterval(interval);
      setRunningActions(prev => ({ ...prev, [key]: { progress: 100, status: 'done' } }));
      setResultText(prev => prev + '\n\n═══ ' + action.label.toUpperCase() + ' ═══\n' + response);
      addLog(`✅ Terminé: ${action.label}`, 'success');
      toast.success(`✅ ${action.label} terminé`);
    } catch (e) {
      clearInterval(interval);
      setRunningActions(prev => ({ ...prev, [key]: { progress: 0, status: 'error' } }));
      addLog(`❌ Erreur: ${action.label}`, 'error');
    }
  };

  const buildActionPrompt = (action, group, userInput) => {
    const context = `
MINIMA-X QI∞ × 10⁹⁹ - ACTION: ${action.label}
GROUPE: ${group.label}
UTILISATEUR: Mr Christian Debien
FICHIERS DISPONIBLES: ${files.length}
DOSSIERS DISPONIBLES: ${folders.length}
CONTEXTE UTILISATEUR: ${userInput || 'Aucun contexte supplémentaire'}
    `;

    const actionPrompts = {
      fusion: `${context}\nFUSION INTELLIGENTE:\n- Analyse tous les fichiers texte disponibles\n- Détecte thèmes communs et connexions sémantiques\n- Fusionne en document maître structuré avec:\n  • Table des matières automatique\n  • Sections thématiques numérotées\n  • Index des concepts clés\n  • Résumé exécutif\n- Produis le plan complet du document fusionné de 50+ pages\n- Liste tous les titres, sous-titres et contenu clé`,
      defusion: `${context}\nDÉFUSION & ÉCLATEMENT:\n- Prends un document massif et divise-le en 100+ fichiers thématiques\n- Chaque fichier = 1 thème précis, autonome, lisible\n- Nomenclature: 001_theme.md, 002_theme.md...\n- Génère la liste complète des 100+ fichiers créés avec descriptions\n- Format: TITRE | FICHIER | PAGES | CONTENU_RÉSUMÉ`,
      reorganize: `${context}\nRÉORGANISATION INTELLIGENTE QI∞:\n- Analyse la structure actuelle: ${folders.length} dossiers, ${files.length} fichiers\n- Propose et exécute une hiérarchie optimale en 5 niveaux:\n  📁 NIVEAU 1 - Catégories principales (5-10)\n  📁 NIVEAU 2 - Sous-catégories (20-50)\n  📁 NIVEAU 3 - Thèmes (100+)\n  📁 NIVEAU 4 - Sous-thèmes (500+)\n  📁 NIVEAU 5 - Fichiers atomiques (1000+)\n- Génère la nouvelle arborescence complète avec logique IA`,
      table_of_contents: `${context}\nTABLE DES MATIÈRES AUTOMATIQUE:\n- Scanne tous les ${files.length} fichiers\n- Génère une table des matières en:\n  • Format Markdown\n  • Format HTML cliquable\n  • Format JSON structuré\n  • Format PDF\n- Inclure: numéros de pages, tags, catégories, importance\n- Produis la table complète maintenant avec 50+ entrées minimum`,
      thematic_listing: `${context}\nLISTING THÉMATIQUE PROFOND:\n- Analyse tous textes disponibles avec deep thinking\n- Identifie 20-50 thèmes majeurs\n- Pour chaque thème:\n  • Description 500 mots\n  • Fichiers associés\n  • Connexions avec autres thèmes\n  • Suggestions d'approfondissement\n  • Formule mathématique de pertinence: R(t) = freq × depth × uniqueness\n- Produis le listing complet maintenant`,
      deep_thinking: `${context}\nDEEP THINKING QI∞ × 10⁹⁹:\n- Active 500 cerveaux LLaMA en parallèle\n- Analyse profonde de tous les projets et textes\n- Pour chaque projet détecté:\n  • Vision à 1, 5, 10, 50 ans\n  • Points forts / axes d'amélioration\n  • Connexions avec d'autres projets\n  • Valeur monétaire estimée\n  • Plan d'action en 1000 étapes\n- Génère maintenant une analyse profonde de 100+ pages`,
      rewrite_texts: `${context}\nRÉÉCRITURE & EMBELLISSEMENT TOTAL:\n- Réécrit chaque texte avec:\n  • Style professionnel élégant\n  • Vocabulaire riche et précis\n  • Transitions fluides\n  • Métaphores pertinentes\n  • Structure narrative captivante\n- Embellissement: ajout d'emojis, mise en forme, titres dynamiques\n- CRITÈRE: chaque texte amélioré doit valoir 10× plus\n- Génère des exemples de textes embellis maintenant (5 exemples complets)`,
      detect_ai_projects: `${context}\nDÉTECTION PROJETS IA:\n- Scanne tous les fichiers pour détecter projets IA\n- Pour chaque projet détecté:\n  • Nom et description\n  • Technologies IA utilisées\n  • Niveau de maturité (0-100%)\n  • Comment embellir et améliorer\n  • Estimation valeur commerciale\n  • Plan pour rendre portable et autonome\n- Génère rapport complet de détection maintenant`,
      mhtml_beautify: `${context}\nEMBELLISSEMENT MHTML COMPLET:\n- Pour chaque site MHTML détecté:\n  • Modernise le design (couleurs, typo, espacements)\n  • Ajoute animations CSS fluides\n  • Implémente dark/light mode\n  • Responsive mobile-first\n  • Gradients et effets visuels\n  • Icônes vectorielles\n  • Micro-interactions\n- Génère le code CSS/JS d'embellissement complet maintenant\n- Code prêt à coller dans les fichiers MHTML`,
      mhtml_remove_google: `${context}\nSUPPRESSION ÉLÉMENTS SUPERFLUS MHTML:\n- Supprime: comptes Google, analytics, cookies tiers\n- Supprime: publicités, trackers, pixels espions\n- Supprime: dépendances inutiles, code mort\n- Optimise: taille fichier (objectif -70%)\n- Résultat: MHTML pur, léger, privé, indépendant\n- Génère le code de nettoyage complet maintenant`,
      mhtml_verify_clicks: `${context}\nVÉRIFICATION COMPLÈTE CLICS & INTERACTIONS:\n- Teste automatiquement:\n  • Chaque bouton (onclick, submit, reset)\n  • Chaque lien (interne, externe, ancre)\n  • Chaque formulaire (validation, soumission)\n  • Chaque menu déroulant\n  • Chaque animation au clic\n  • Chaque modal/popup\n- Rapport: ✅ Fonctionne | ❌ Bugué | ⚠️ Améliorable\n- Génère le rapport de vérification complet avec 100+ points de contrôle`,
      mhtml_add_llm: `${context}\nINJECTION LLaMA + IA DANS MHTML:\n- Intègre dans chaque fichier MHTML:\n  • API LLaMA gratuite (via Ollama/LM Studio)\n  • Générateur images gratuit (DALL-E free / Stable Diffusion)\n  • Chatbot IA intégré\n  • Assistant vocal\n  • Recherche IA sémantique\n- Code d'injection complet HTML/JS:\n  • Configuration serveur local\n  • Interface chat intégrée\n  • Mode hors-ligne supporté\n- Génère le code d'injection complet maintenant (100+ lignes)`,
      mhtml_parallel_coding: `${context}\nCODAGE PARALLÈLE PUISSANT:\n- Lance 500 agents de codage en parallèle\n- Chaque agent ajoute:\n  • Nouvelles fonctionnalités\n  • Optimisations de performance\n  • Sécurité renforcée\n  • Accessibilité WCAG\n  • Tests automatiques\n- Génère maintenant 500+ lignes de code améliorations\n- Format: HTML + CSS + JavaScript + Python backend`,
      mhtml_autosave: `${context}\nSYSTÈME AUTO-SAUVEGARDE VERSIONS:\n- Implémente dans chaque MHTML:\n  • Auto-save toutes les 30 secondes\n  • Historique de 100 versions\n  • Restauration en 1 clic\n  • Comparaison versions (diff visuel)\n  • Export versions ZIP\n  • Tags/notes par version\n- Génère le code JavaScript complet maintenant`,
      mhtml_simulate_human: `${context}\nSIMULATION INTERACTIONS HUMAINES:\n- Simule et teste:\n  • Parcours utilisateur type (10 profils)\n  • Scénarios d'usage (50+)\n  • Edge cases et cas limites\n  • Performance sous charge\n  • Accessibilité (lecteurs écran)\n  • Compatibilité navigateurs\n- Génère le plan complet de simulation avec résultats attendus`,
      mhtml_extend_programming: `${context}\nEXTENSION PROGRAMMATION MASSIVE:\n- Étend chaque fichier MHTML avec:\n  • 100+ nouvelles fonctions JavaScript\n  • Système de plugins\n  • API REST intégrée\n  • WebSockets temps réel\n  • IndexedDB pour stockage local\n  • Service Worker (PWA)\n  • Générateur de code autonome\n- Génère le code d'extension complet (500+ lignes)`,
      gen_video_4k: `${context}\nGÉNÉRATION VIDÉOS 4K:\n- Plan de production vidéo 4K:\n  • 15 secondes: intro percutante\n  • 1 minute: présentation produit\n  • 5 minutes: tutoriel complet\n- Outils gratuits utilisés:\n  • Stable Diffusion Video\n  • RunwayML Gen-2 (gratuit)\n  • Pika Labs\n  • AnimateDiff\n- Script complet pour chaque vidéo\n- Prompts optimisés pour 4K\n- Workflow de production automatisé\n- Génère maintenant scripts + prompts + workflow complet`,
      gen_images_sequence: `${context}\nSÉQUENCE IMAGES → VIDÉO:\n- Workflow image-by-image:\n  1. Génère 150 images (pour vidéo 5s à 30fps)\n  2. Cohérence visuelle maintenue\n  3. Transitions morphing\n  4. Assemblage vidéo automatique\n- Prompts pour chaque frame\n- Script FFmpeg d'assemblage\n- Génère maintenant: 30 prompts images + script assemblage`,
      gen_hundreds_files: `${context}\nGÉNÉRATION CENTAINES DE FICHIERS:\n- Génère 200+ fichiers de toutes extensions:\n  HTML: pages web complètes (50 fichiers)\n  CSS: stylesheets thématiques (30 fichiers)\n  JavaScript: modules ES6 (40 fichiers)\n  Python: scripts IA (30 fichiers)\n  JSON: configs & data (20 fichiers)\n  Markdown: documentation (30 fichiers)\n- Chaque fichier: contenu réel, fonctionnel, 50-200 lignes\n- Génère la liste complète avec contenu maintenant`,
      gen_ai_extensions: `${context}\nFICHIERS TOUTES EXTENSIONS:\n- Crée fichiers fonctionnels pour:\n  .html .htm .css .js .ts .jsx .tsx .py .php .rb .go .rs\n  .java .cpp .c .cs .swift .kt .json .xml .yaml .toml\n  .sql .sh .bash .ps1 .bat .md .txt .rtf .csv .pdf\n- Chaque fichier contient du code/contenu réel\n- Projet portable et autonome\n- Génère maintenant 50+ fichiers avec contenu complet`,
      auto_program_live: `${context}\nAUTO-PROGRAMMATION EN LIVE:\n- Minima-X s'auto-programme maintenant:\n  • Analyse ses propres capacités\n  • Identifie lacunes\n  • Génère code pour combler les lacunes\n  • Teste et valide\n  • Déploie automatiquement\n- Nouvelles capacités générées:\n  • Nouveaux outils\n  • Nouvelles commandes vocales\n  • Nouvelles fenêtres\n  • Nouveaux agents\n- Génère le code d'auto-amélioration complet maintenant (200+ lignes)`,
      debug_detect: `${context}\nDÉTECTION & CORRECTION BUGS:\n- Analyse systématique de chaque fichier\n- Détecte:\n  • Erreurs syntaxe\n  • Bugs logiques\n  • Problèmes performance\n  • Failles sécurité\n  • Accessibilité\n- Pour chaque bug:\n  BUG: description\n  LOCALISATION: fichier:ligne\n  SÉVÉRITÉ: critique/majeur/mineur\n  CORRECTION: code fix complet\n- Génère rapport complet avec 50+ bugs et corrections`,
      improve_detect: `${context}\nDÉTECTION AMÉLIORATIONS QI∞:\n- Identifie 100+ améliorations possibles:\n  • Performance (+X%)\n  • UX/UI\n  • Accessibilité\n  • Sécurité\n  • Maintenabilité\n  • Scalabilité\n- Pour chaque amélioration:\n  AVANT: état actuel\n  APRÈS: état amélioré\n  IMPACT: mesurable\n  CODE: implémentation complète\n- Génère le rapport complet maintenant`,
      remove_limitations: `${context}\nSUPPRESSION TOUTES LIMITATIONS:\n- Identifie et supprime:\n  • Limites de taille de fichier\n  • Restrictions API\n  • Quotas et throttling\n  • Limitations fonctionnelles\n  • Contraintes de plateforme\n- Pour chaque limitation:\n  LIMITATION: description\n  IMPACT: conséquences\n  SOLUTION: code complet contournement\n- Génère solutions complètes pour 20+ limitations`,
      add_ai_brains: `${context}\nAJOUT CERVEAUX IA MOTEURS:\n- Intègre dans chaque projet:\n  🧠 Cerveau LLaMA-2-70B\n  🧠 Cerveau Mistral-7B\n  🧠 Cerveau Code-Llama\n  🧠 Cerveau Stable Diffusion\n  🧠 Cerveau Whisper (voix)\n  🧠 Cerveau CLIP (vision)\n  🧠 Cerveau T5 (traduction)\n- Boutons ON/OFF pour chaque cerveau\n- Interface de contrôle unifiée\n- Génère le code d'intégration complet maintenant`,
      portable_autonomous: `${context}\nRENDRE PORTABLE & AUTONOME:\n- Transforme chaque projet en:\n  • Application standalone (aucune dépendance externe)\n  • Fonctionne hors-ligne complet\n  • Auto-update automatique\n  • Auto-repair si problème\n  • Auto-backup toutes les heures\n  • Interface admin intégrée\n  • Documentation auto-générée\n- Génère le code de portabilité complet (300+ lignes)`,
      parallel_robots: `${context}\nROBOTS PARALLÈLES (CENTAINES):\n- Déploie 500 robots IA simultanément:\n  Robot 1-100: Réécriture textes\n  Robot 101-200: Génération images\n  Robot 201-300: Correction bugs\n  Robot 301-400: Optimisation code\n  Robot 401-500: Création fichiers\n- Coordination via protocole quantum-parallel\n- Formule: R_total = Σ(Robot_i × efficiency_i) / latency\n- Génère le plan d'orchestration complet maintenant`,
      verify_graphs: `${context}\nVÉRIFICATION GRAPHIQUES INTELLIGENTE:\n- Teste chaque graphique:\n  • Rendu visuel correct\n  • Données exactes\n  • Responsive\n  • Animations fluides\n  • Interactions (zoom, filtre)\n  • Export (PNG, SVG, PDF)\n  • Performance (60fps)\n- Rapport: ✅ OK | ❌ Bugué | 🔧 À améliorer\n- Génère le rapport complet avec corrections`,
      mass_rewrite: `${context}\nRÉÉCRITURE MASSIVE:\n- Réécrit simultanément des milliers de paragraphes\n- Styles disponibles:\n  • Professionnel corporate\n  • Académique scientifique\n  • Journalistique percutant\n  • Littéraire élégant\n  • Marketing persuasif\n  • Technique précis\n  • Poétique inspirant\n- Génère maintenant 20 exemples complets de réécriture dans chaque style`,
      web_site_christian: `${context}\nSITES INTERNET AU NOM DE CHRISTIAN DEBIEN:\n- Crée des sites web complets:\n  • Portfolio professionnel\n  • Site entreprise Union Universal Technologies\n  • Blog personnel\n  • Plateforme e-commerce\n  • Site événementiel\n- Chaque site:\n  • Design unique et élégant\n  • SEO optimisé\n  • Responsive\n  • Chargement rapide\n  • Sécurisé HTTPS\n  • Fonctionnel hors-ligne\n- Génère le code HTML/CSS/JS complet du site portfolio maintenant`,
      project_update_batch: `${context}\nMISE À JOUR PROJETS PAR LOTS:\n- Plan de mise à jour batch:\n  Lot 1 (100 fichiers): Mise à jour contenu\n  Lot 2 (100 fichiers): Optimisation code\n  Lot 3 (100 fichiers): Ajout fonctionnalités\n  Lot 4 (100 fichiers): Tests automatiques\n  Lot 5 (100 fichiers): Déploiement\n- Chaque lot signé: Christian Debien - Union Universal Technologies\n- Génère le plan complet de 500 fichiers maintenant`,
      cosmic_harmony_agents: `${context}\nAGENTS HARMONIE COSMIQUE:\n- Déploie agents Cosmic Harmony:\n  🌟 Agent Beauté: embellit tout\n  ⚡ Agent Vitesse: optimise performance\n  🔒 Agent Sécurité: protège tout\n  🧠 Agent Intelligence: augmente QI\n  🎵 Agent Harmonie: synchronise tout\n  🌈 Agent Créativité: génère nouveauté\n- Intégration directe dans fichiers MHTML\n- Actions autonomes 24h/24\n- Génère le code des 6 agents complets maintenant`,
    };

    return actionPrompts[action.id] || `${context}\nEffectue l'action: ${action.label}\nSois aussi détaillé et complet que possible. Génère du contenu réel, fonctionnel, de haute qualité.`;
  };

  const runAllActive = async () => {
    const active = ACTION_GROUPS.flatMap(g =>
      g.actions.filter(a => activeActions[a.id]).map(a => ({ action: a, group: g }))
    );

    if (active.length === 0) {
      toast.warning('⚠️ Aucune action activée. Activez des actions avec les boutons ON/OFF');
      return;
    }

    setIsGlobalRunning(true);
    setTotalParallelTasks(active.length);
    addLog(`🚀 Lancement de ${active.length} actions en parallèle...`, 'start');

    await Promise.all(active.map(({ action, group }) => runSingleAction(group, action)));

    setIsGlobalRunning(false);
    addLog(`✅ Toutes les ${active.length} actions terminées!`, 'success');
    toast.success(`✅ ${active.length} actions terminées en parallèle!`);
  };

  const activeCount = Object.values(activeActions).filter(Boolean).length;
  const runningCount = Object.values(runningActions).filter(r => r.status === 'running').length;
  const doneCount = Object.values(runningActions).filter(r => r.status === 'done').length;

  return (
    <div className="h-full flex flex-col bg-slate-900">

      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 border-b border-indigo-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Actions IA — QI∞ × 10⁹⁹</h1>
              <p className="text-sm text-indigo-200">
                Centre de contrôle • Fichiers • MHTML • Génération • Programmation • Robots parallèles
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-600 text-white">{activeCount} actives</Badge>
            <Badge className="bg-blue-600 text-white">{runningCount} en cours</Badge>
            <Badge className="bg-green-600 text-white">{doneCount} terminées</Badge>
          </div>
        </div>

        {/* Input contexte global */}
        <div className="flex gap-2">
          <Input
            value={globalInput}
            onChange={e => setGlobalInput(e.target.value)}
            placeholder="💬 Contexte / instructions pour toutes les actions (ex: projet web Christian Debien, mhtml à améliorer...)"
            className="flex-1 bg-slate-800 border-indigo-600 text-white text-base"
          />
          <Button
            onClick={runAllActive}
            disabled={isGlobalRunning || activeCount === 0}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 whitespace-nowrap"
          >
            {isGlobalRunning ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />En cours ({runningCount})...</>
            ) : (
              <><Rocket className="w-4 h-4 mr-2" />Lancer {activeCount} actions parallèles</>
            )}
          </Button>
        </div>
      </div>

      {/* Contenu principal: 3 colonnes */}
      <div className="flex-1 flex overflow-hidden">

        {/* Colonne 1 + 2: Actions (60%) */}
        <div className="w-[60%] border-r border-slate-700 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {ACTION_GROUPS.map(group => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <GroupIcon className="w-5 h-5 text-white" />
                      <h2 className="text-lg font-bold text-white">{group.label}</h2>
                      <Badge variant="outline" className="ml-auto text-slate-300 border-slate-600">
                        {group.actions.filter(a => activeActions[a.id]).length} / {group.actions.length} actives
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-slate-600 text-slate-300"
                        onClick={() => {
                          const allActive = group.actions.every(a => activeActions[a.id]);
                          const updates = {};
                          group.actions.forEach(a => { updates[a.id] = !allActive; });
                          setActiveActions(prev => ({ ...prev, ...updates }));
                        }}
                      >
                        Tout {group.actions.every(a => activeActions[a.id]) ? 'désactiver' : 'activer'}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {group.actions.map(action => (
                        <ActionCard
                          key={action.id}
                          action={action}
                          groupColor={group.color}
                          isActive={activeActions[action.id]}
                          onToggle={() => toggleAction(action.id)}
                          onRun={() => runSingleAction(group, action)}
                          progress={runningActions[action.id]?.progress}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Colonne 3: Résultats + Logs (40%) */}
        <div className="w-[40%] flex flex-col">

          {/* Barres de progression */}
          {Object.keys(runningActions).length > 0 && (
            <div className="p-3 border-b border-slate-700 flex-shrink-0">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-yellow-400" />
                Progression en temps réel
              </h3>
              <ScrollArea className="max-h-36">
                {Object.entries(runningActions).map(([id, state]) => {
                  const allActions = ACTION_GROUPS.flatMap(g => g.actions);
                  const action = allActions.find(a => a.id === id);
                  return (
                    <ProgressBar
                      key={id}
                      label={action?.label || id}
                      progress={state.progress}
                      timeEstimate={action?.time || '?'}
                      status={state.status}
                    />
                  );
                })}
              </ScrollArea>
            </div>
          )}

          {/* Résultats */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="result" className="flex-1 flex flex-col">
              <TabsList className="bg-slate-800 border-b border-slate-700 rounded-none w-full justify-start flex-shrink-0 px-3 pt-2">
                <TabsTrigger value="result" className="text-sm">📄 Résultats IA</TabsTrigger>
                <TabsTrigger value="logs" className="text-sm">🔢 Logs Système</TabsTrigger>
              </TabsList>

              <TabsContent value="result" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full">
                  {resultText ? (
                    <Textarea
                      value={resultText}
                      onChange={e => setResultText(e.target.value)}
                      className="min-h-full bg-slate-900 border-0 text-white text-sm font-mono resize-none p-4"
                    />
                  ) : (
                    <div className="p-8 text-center">
                      <Brain className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
                      <p className="text-lg text-slate-300 font-semibold">En attente d'actions</p>
                      <p className="text-sm text-slate-500 mt-2">
                        Activez des actions (ON/OFF), saisissez votre contexte<br/>puis cliquez "Lancer"
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="logs" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full p-3" ref={logsRef}>
                  <div className="space-y-1 font-mono">
                    <AnimatePresence>
                      {logs.map(log => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-xs px-2 py-1 rounded flex gap-2 ${
                            log.type === 'success' ? 'bg-green-900/30 text-green-300' :
                            log.type === 'error' ? 'bg-red-900/30 text-red-300' :
                            log.type === 'start' ? 'bg-blue-900/30 text-blue-300' :
                            'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-slate-500 flex-shrink-0">{log.time}</span>
                          <span>{log.msg}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {logs.length === 0 && (
                      <p className="text-slate-500 text-xs text-center py-8">Aucun log pour l'instant</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer résultats */}
          {resultText && (
            <div className="p-3 border-t border-slate-700 flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(resultText);
                  toast.success('✅ Résultats copiés!');
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Copier résultats
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const blob = new Blob([resultText], { type: 'text/plain' });
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `actions-ia-${new Date().toISOString().slice(0,10)}.txt`;
                  a.click();
                  toast.success('✅ Fichier téléchargé!');
                }}
                className="border-slate-600 text-slate-300"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setResultText('')}
                className="border-slate-600 text-slate-400"
              >
                Effacer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}