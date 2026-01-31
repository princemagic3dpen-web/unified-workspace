import { base44 } from '@/api/base44Client';

/**
 * Moteur d'intelligence embarqué - Fonctionne sans clé API externe
 * Utilise l'intelligence collective de l'OS et les données internes
 */
export class IntelligenceEngine {
  constructor() {
    this.memoryCache = new Map();
    this.learningData = [];
  }

  /**
   * Analyse intelligente du contexte
   */
  async analyzeContext(message, systemData) {
    const context = {
      folders: systemData.folders || [],
      files: systemData.files || [],
      events: systemData.events || [],
      conversations: systemData.conversations || []
    };

    // Extraction des intentions
    const intent = this.extractIntent(message);
    
    // Calcul de pertinence
    const relevantData = this.findRelevantData(message, context);
    
    // Génération d'actions suggérées
    const suggestedActions = this.generateActions(intent, relevantData);

    return {
      intent,
      relevantData,
      suggestedActions,
      confidence: this.calculateConfidence(message, relevantData)
    };
  }

  /**
   * Extraction d'intention sans IA externe
   */
  extractIntent(message) {
    const keywords = {
      create: ['créer', 'créé', 'crée', 'nouveau', 'nouvelle', 'ajoute', 'fait'],
      read: ['montre', 'affiche', 'voir', 'liste', 'trouve', 'cherche'],
      update: ['modifie', 'change', 'met à jour', 'édite', 'améliore'],
      delete: ['supprime', 'efface', 'enlève', 'retire'],
      organize: ['organise', 'trie', 'classe', 'range'],
      analyze: ['analyse', 'étudie', 'examine', 'regarde']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [intent, words] of Object.entries(keywords)) {
      if (words.some(word => lowerMessage.includes(word))) {
        return intent;
      }
    }

    return 'unknown';
  }

  /**
   * Trouve les données pertinentes
   */
  findRelevantData(message, context) {
    const lowerMessage = message.toLowerCase();
    const relevant = {
      folders: [],
      files: [],
      events: []
    };

    // Recherche dans folders
    relevant.folders = context.folders.filter(folder =>
      lowerMessage.includes(folder.name.toLowerCase())
    );

    // Recherche dans files
    relevant.files = context.files.filter(file =>
      lowerMessage.includes(file.name.toLowerCase()) ||
      (file.content && file.content.toLowerCase().includes(lowerMessage))
    );

    // Recherche dans events
    relevant.events = context.events.filter(event =>
      lowerMessage.includes(event.title.toLowerCase())
    );

    return relevant;
  }

  /**
   * Génère des actions intelligentes
   */
  generateActions(intent, relevantData) {
    const actions = [];

    switch (intent) {
      case 'create':
        actions.push({
          type: 'create_folder',
          description: 'Créer un nouveau dossier organisé',
          priority: 'high'
        });
        actions.push({
          type: 'create_file',
          description: 'Créer fichiers avec contenu détaillé',
          priority: 'high'
        });
        break;

      case 'organize':
        actions.push({
          type: 'reorganize',
          description: 'Réorganiser hiérarchie intelligemment',
          priority: 'medium'
        });
        break;

      case 'analyze':
        actions.push({
          type: 'generate_report',
          description: 'Générer rapport d\'analyse détaillé',
          priority: 'high'
        });
        break;
    }

    return actions;
  }

  /**
   * Calcule la confiance
   */
  calculateConfidence(message, relevantData) {
    const hasRelevantData = 
      relevantData.folders.length > 0 ||
      relevantData.files.length > 0 ||
      relevantData.events.length > 0;

    const messageLength = message.split(' ').length;
    const lengthScore = Math.min(messageLength / 10, 1);

    return hasRelevantData 
      ? Math.min(0.7 + (lengthScore * 0.3), 1.0)
      : Math.min(0.4 + (lengthScore * 0.3), 0.7);
  }

  /**
   * Sauvegarde intelligente automatique
   */
  async saveConversationIntelligently(conversation, systemData) {
    try {
      // Extraire les thèmes principaux
      const themes = this.extractThemes(conversation.messages);
      
      // Créer dossier si nécessaire
      let folder = systemData.folders.find(f => 
        themes.some(theme => f.name.toLowerCase().includes(theme))
      );

      if (!folder && themes.length > 0) {
        folder = await base44.entities.Folder.create({
          name: `Conversations - ${themes[0]}`,
          color: '#8b5cf6',
          parent_id: null
        });
      }

      // Créer fichier de conversation
      const fileName = `Conversation_${new Date().toISOString().split('T')[0]}.txt`;
      const content = this.formatConversation(conversation);

      await base44.entities.File.create({
        name: fileName,
        folder_id: folder?.id,
        file_type: 'text',
        content: content,
        tags: themes
      });

      return { success: true, folder, fileName };
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      return { success: false, error };
    }
  }

  /**
   * Extraction des thèmes
   */
  extractThemes(messages) {
    const text = messages.map(m => m.content).join(' ').toLowerCase();
    const themes = [];

    const themeKeywords = {
      'projet': ['projet', 'développement', 'planification'],
      'entreprise': ['entreprise', 'business', 'commercial'],
      'technique': ['technique', 'code', 'programmation'],
      'organisation': ['organisation', 'gestion', 'optimisation']
    };

    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        themes.push(theme);
      }
    }

    return themes.length > 0 ? themes : ['général'];
  }

  /**
   * Formate la conversation
   */
  formatConversation(conversation) {
    let content = `# ${conversation.title}\n\n`;
    content += `Date: ${new Date().toLocaleString('fr-FR')}\n\n`;
    content += `---\n\n`;

    for (const msg of conversation.messages) {
      const role = msg.role === 'user' ? '👤 Utilisateur' : '🤖 Minima-X';
      content += `## ${role}\n`;
      content += `**${new Date(msg.timestamp).toLocaleTimeString('fr-FR')}**\n\n`;
      content += `${msg.content}\n\n`;
      content += `---\n\n`;
    }

    return content;
  }

  /**
   * Auto-génération de nouvelles pages/outils
   */
  async generateNewTool(description) {
    // Analyse de la demande
    const toolType = this.identifyToolType(description);
    
    // Génération du code (simulation)
    const toolCode = this.generateToolCode(toolType, description);
    
    return {
      toolType,
      code: toolCode,
      name: `Tool_${Date.now()}`,
      description
    };
  }

  identifyToolType(description) {
    const lower = description.toLowerCase();
    
    if (lower.includes('calcul') || lower.includes('math')) return 'calculator';
    if (lower.includes('texte') || lower.includes('édit')) return 'editor';
    if (lower.includes('image') || lower.includes('photo')) return 'image_tool';
    if (lower.includes('liste') || lower.includes('tâche')) return 'todo';
    
    return 'generic';
  }

  generateToolCode(toolType, description) {
    // Template de base pour générer du code
    return `
// Auto-généré par Intelligence Engine
// Description: ${description}
// Type: ${toolType}

export default function AutoGeneratedTool() {
  return (
    <div className="p-6">
      <h1>Outil Auto-Généré: ${toolType}</h1>
      <p>{description}</p>
    </div>
  );
}
    `.trim();
  }
}

export const intelligenceEngine = new IntelligenceEngine();