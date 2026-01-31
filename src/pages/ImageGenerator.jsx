import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { base44 } from '@/api/base44Client';
import { Image, Sparkles, Loader2, Download, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [referenceImages, setReferenceImages] = useState([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setLoading(true);
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Qualité 4K ultra détaillée, photoréaliste, cinématique, HDR, professionnel: ${prompt}`,
        existing_image_urls: referenceImages.length > 0 ? referenceImages : undefined
      });

      setGeneratedImages(prev => [{
        url: result.url,
        prompt: prompt,
        timestamp: new Date().toISOString()
      }, ...prev]);

      toast.success('Image 4K générée avec succès!');
    } catch (error) {
      toast.error('Erreur génération image');
      console.error(error);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setReferenceImages(prev => [...prev, result.file_url]);
      toast.success('Image référence ajoutée');
    } catch (error) {
      toast.error('Erreur upload');
    }
  };

  const removeReference = (index) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Image className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Générateur d'Images 4K</h1>
            <p className="text-slate-400 text-sm">Qualité atomique ultra-réaliste • Powered by IA</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Description de l'Image</h3>
            
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Paysage futuriste cyberpunk avec néons violets, pluie, reflets sur le sol mouillé, architecture massive, 4K photoréaliste..."
              className="min-h-[150px] bg-slate-900/50 border-slate-700 text-white resize-none mb-4"
            />

            <div className="mb-4">
              <label className="text-sm text-slate-400 mb-2 block">Images de référence (optionnel)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
              {referenceImages.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {referenceImages.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} className="w-20 h-20 rounded object-cover" />
                      <button
                        onClick={() => removeReference(i)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer Image 4K
                </>
              )}
            </Button>
          </Card>

          {/* Preview Latest */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dernière Image Générée</h3>
            
            {generatedImages.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                <div className="text-center">
                  <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Votre image apparaîtra ici</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <img 
                  src={generatedImages[0].url} 
                  className="w-full rounded-lg shadow-2xl"
                  alt="Generated" 
                />
                <div className="bg-slate-900/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Prompt:</p>
                  <p className="text-sm text-slate-300">{generatedImages[0].prompt}</p>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger 4K
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Gallery */}
        {generatedImages.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">📸 Galerie ({generatedImages.length} images)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generatedImages.slice(1).map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative"
                >
                  <img 
                    src={img.url} 
                    className="w-full h-48 object-cover rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
                    onClick={() => setGeneratedImages(prev => [img, ...prev.filter((_, i) => i !== idx + 1)])}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}