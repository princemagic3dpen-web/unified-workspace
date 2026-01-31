import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, AlertCircle, Sparkles, Heart, Brain, Book } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function ContentVerifiers() {
  const [content, setContent] = useState('');
  const [verifications, setVerifications] = useState([]);
  const [verifying, setVerifying] = useState(false);

  const verifierTypes = [
    { id: 'paragraphs', name: 'Paragraphage Parfait', icon: Book, color: 'blue' },
    { id: 'introduction', name: 'Introduction Parfaite', icon: Sparkles, color: 'purple' },
    { id: 'development', name: 'Développement Parfait', icon: Brain, color: 'green' },
    { id: 'conclusion', name: 'Conclusion Parfaite', icon: CheckCircle, color: 'indigo' },
    { id: 'poetic', name: 'Poétique Parfait', icon: Sparkles, color: 'pink' },
    { id: 'emotions', name: 'Émotions Positives', icon: Heart, color: 'red' },
    { id: 'sentiments', name: 'Sentiments Positifs', icon: Heart, color: 'orange' },
    { id: 'math', name: 'Moteurs Mathématiques', icon: Brain, color: 'cyan' }
  ];

  const verifyContent = async () => {
    if (!content.trim()) {
      toast.error('Saisissez du contenu à vérifier');
      return;
    }

    setVerifying(true);
    const results = [];

    for (const verifier of verifierTypes) {
      try {
        const prompt = `En tant qu'expert ${verifier.name}, analyse ce texte et donne un score de 0 à 100 avec suggestions d'amélioration:

${content}

Retourne UNIQUEMENT un JSON avec: {"score": number, "feedback": "string", "improvements": ["string"]}`;

        const response = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: 'object',
            properties: {
              score: { type: 'number' },
              feedback: { type: 'string' },
              improvements: { type: 'array', items: { type: 'string' } }
            }
          }
        });

        results.push({
          verifier: verifier.name,
          icon: verifier.icon,
          color: verifier.color,
          ...response
        });
      } catch (error) {
        results.push({
          verifier: verifier.name,
          icon: verifier.icon,
          color: verifier.color,
          score: 0,
          feedback: 'Erreur vérification',
          improvements: []
        });
      }
    }

    setVerifications(results);
    setVerifying(false);
    
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    toast.success(`✅ Vérification terminée! Score moyen: ${avgScore.toFixed(0)}/100`);
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    indigo: 'bg-indigo-600',
    pink: 'bg-pink-600',
    red: 'bg-red-600',
    orange: 'bg-orange-600',
    cyan: 'bg-cyan-600'
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900/95 via-indigo-900/95 to-slate-900/95 backdrop-blur-xl overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">✨ Vérificateurs de Contenu Parfait</h1>
            <p className="text-slate-400 text-sm">8 vérifications automatiques simultanées</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4">📝 Contenu à Vérifier</h3>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Saisissez ou collez votre texte ici pour vérification complète..."
              className="bg-slate-900/50 border-slate-700 text-white min-h-[400px]"
            />
            <Button 
              onClick={verifyContent} 
              disabled={verifying}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
            >
              {verifying ? '⏳ Vérification en cours...' : '🚀 Lancer Vérifications Complètes'}
            </Button>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4">📊 Résultats Vérifications</h3>
            <ScrollArea className="h-[500px] w-full">
              <div className="space-y-3">
                {verifications.map((verif, idx) => {
                  const Icon = verif.icon;
                  return (
                    <Card key={idx} className="bg-slate-900/50 p-4 border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded ${colorClasses[verif.color]}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white font-semibold text-sm">{verif.verifier}</span>
                        </div>
                        <span className={`text-2xl font-bold ${verif.score >= 80 ? 'text-green-400' : verif.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {verif.score}/100
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-400 mb-2">{verif.feedback}</p>
                      
                      {verif.improvements.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Améliorations:</p>
                          <ul className="text-xs text-slate-300 space-y-1">
                            {verif.improvements.map((imp, i) => (
                              <li key={i}>• {imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  );
                })}
                {verifications.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune vérification lancée</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}