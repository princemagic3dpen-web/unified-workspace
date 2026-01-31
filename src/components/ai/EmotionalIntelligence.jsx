// Moteur d'Intelligence Émotionnelle Avancée - QI Illimité
export class EmotionalIntelligence {
  constructor() {
    this.emotionPatterns = {
      joie: { keywords: ['content', 'heureux', 'génial', 'super', 'merci', 'cool', '😊', '🎉'], tone: 'joyeux' },
      tristesse: { keywords: ['triste', 'déçu', 'problème', 'erreur', 'perte', '😢', '😔'], tone: 'empathique' },
      colère: { keywords: ['énervé', 'frustré', 'nul', 'bug', 'ça marche pas', '😠', '😡'], tone: 'apaisant' },
      stress: { keywords: ['urgent', 'vite', 'deadline', 'pressé', 'stress', '😰', '😫'], tone: 'rassurant' },
      confusion: { keywords: ['comprends pas', 'comment', 'aide', 'perdu', '?', '🤔'], tone: 'pédagogue' },
      enthousiasme: { keywords: ['wow', 'incroyable', 'excellent', 'parfait', 'bravo', '🚀', '✨'], tone: 'encourageant' }
    };

    this.responseStyles = {
      joyeux: {
        prefix: "🎉 Excellent ! ",
        emojis: ['😊', '✨', '🎯', '💫'],
        vocabulary: ['fantastique', 'merveilleux', 'parfait']
      },
      empathique: {
        prefix: "Je comprends votre situation. ",
        emojis: ['💙', '🤝', '💪'],
        vocabulary: ['comprends', 'soutien', 'ensemble']
      },
      apaisant: {
        prefix: "Restons calmes, je vais résoudre cela. ",
        emojis: ['😌', '🧘', '✅'],
        vocabulary: ['solution', 'résoudre', 'corriger']
      },
      rassurant: {
        prefix: "Pas de panique, je m'en occupe immédiatement. ",
        emojis: ['⚡', '🎯', '💼'],
        vocabulary: ['rapidement', 'priorité', 'urgent']
      },
      pédagogue: {
        prefix: "Je vais vous expliquer clairement : ",
        emojis: ['📚', '💡', '🎓'],
        vocabulary: ['étape par étape', 'simplement', 'voici comment']
      },
      encourageant: {
        prefix: "Formidable ! Continuons sur cette lancée ! ",
        emojis: ['🚀', '⭐', '🏆'],
        vocabulary: ['excellent', 'bravo', 'magnifique']
      }
    };
  }

  // Détection émotionnelle avec QI illimité
  detectEmotion(text) {
    const textLower = text.toLowerCase();
    const detectedEmotions = {};

    for (const [emotion, data] of Object.entries(this.emotionPatterns)) {
      const matchCount = data.keywords.filter(keyword => 
        textLower.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        detectedEmotions[emotion] = matchCount;
      }
    }

    // Retourner l'émotion dominante
    const dominantEmotion = Object.entries(detectedEmotions)
      .sort((a, b) => b[1] - a[1])[0];

    return dominantEmotion ? {
      emotion: dominantEmotion[0],
      intensity: dominantEmotion[1],
      tone: this.emotionPatterns[dominantEmotion[0]].tone,
      confidence: Math.min(dominantEmotion[1] * 0.3, 1)
    } : {
      emotion: 'neutre',
      intensity: 0,
      tone: 'professionnel',
      confidence: 1
    };
  }

  // Génération de réponse empathique
  generateEmpathicResponse(userMessage, aiResponse, detectedEmotion) {
    const style = this.responseStyles[detectedEmotion.tone] || this.responseStyles.professionnel;
    
    // Ajouter le préfixe émotionnel
    let empathicResponse = style.prefix;

    // Ajouter des emojis pertinents
    const randomEmoji = style.emojis[Math.floor(Math.random() * style.emojis.length)];
    
    // Enrichir le vocabulaire
    let enrichedResponse = aiResponse;
    
    // Adapter le ton
    if (detectedEmotion.tone === 'rassurant' && detectedEmotion.intensity > 2) {
      enrichedResponse = `⚡ PRIORITÉ URGENTE : ${enrichedResponse}`;
    }

    return `${empathicResponse}\n\n${enrichedResponse}\n\n${randomEmoji}`;
  }

  // Analyse contextuelle complète
  analyzeContext(conversation) {
    const emotionalHistory = conversation.messages
      .filter(m => m.role === 'user')
      .map(m => this.detectEmotion(m.content));

    const dominantMood = emotionalHistory.length > 0
      ? emotionalHistory[emotionalHistory.length - 1]
      : { emotion: 'neutre', tone: 'professionnel' };

    return {
      currentMood: dominantMood,
      emotionalTrend: this.analyzeEmotionalTrend(emotionalHistory),
      needsSupport: dominantMood.emotion === 'tristesse' || dominantMood.emotion === 'colère',
      needsUrgency: dominantMood.emotion === 'stress'
    };
  }

  analyzeEmotionalTrend(history) {
    if (history.length < 2) return 'stable';
    
    const recent = history.slice(-3);
    const positiveEmotions = ['joie', 'enthousiasme'];
    const negativeEmotions = ['tristesse', 'colère', 'stress'];

    const positiveCount = recent.filter(e => positiveEmotions.includes(e.emotion)).length;
    const negativeCount = recent.filter(e => negativeEmotions.includes(e.emotion)).length;

    if (positiveCount > negativeCount) return 'amélioration';
    if (negativeCount > positiveCount) return 'dégradation';
    return 'stable';
  }
}

export const emotionalIntelligence = new EmotionalIntelligence();