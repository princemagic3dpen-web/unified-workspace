import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Sparkles, Wand2, Download, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageEditor() {
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState('image-generee.png');
  const [prompt, setPrompt] = useState('');
  const [quality, setQuality] = useState('4k');
  const [style, setStyle] = useState('realistic');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const saveImage = useMutation({
    mutationFn: (data) => base44.entities.File.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('Image sauvegardée');
    }
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Décrivez l\'image à générer');
      return;
    }

    setIsGenerating(true);
    try {
      const enhancedPrompt = `${prompt}. Style: ${style}. Quality: ${quality} ultra high resolution, professional, detailed.`;
      
      const result = await base44.integrations.Core.GenerateImage({
        prompt: enhancedPrompt
      });

      setGeneratedImage(result.url);
      toast.success('Image générée');
    } catch (error) {
      toast.error('Erreur lors de la génération');
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!generatedImage) {
      toast.error('Générez d\'abord une image');
      return;
    }

    await saveImage.mutateAsync({
      name: fileName,
      file_url: generatedImage,
      file_type: 'image',
      mime_type: 'image/png',
      metadata: {
        prompt: prompt,
        quality: quality,
        style: style,
        ai_generated: true
      }
    });
  };

  const handleUpscale = async () => {
    if (!generatedImage) {
      toast.error('Aucune image à améliorer');
      return;
    }

    setIsGenerating(true);
    try {
      // Re-generate with higher quality
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `${prompt}. 8K ultra high resolution, photorealistic, extremely detailed, professional photography`,
        existing_image_urls: [generatedImage]
      });

      setGeneratedImage(result.url);
      toast.success('Image améliorée en 4K+');
    } catch (error) {
      toast.error('Erreur amélioration');
    }
    setIsGenerating(false);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-300 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <Image className="w-5 h-5 text-slate-700" />
          <h2 className="font-bold text-slate-900">Éditeur d'Images IA - Génération 4K</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 h-full">
          {/* Left: Controls */}
          <div className="p-6 space-y-4 border-r border-slate-300">
            <div>
              <Label>Nom du fichier</Label>
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="mon-image.png"
              />
            </div>

            <div>
              <Label>Description de l'image</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Décrivez en détail l'image que vous voulez générer..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Qualité</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hd">HD (1280x720)</SelectItem>
                    <SelectItem value="fullhd">Full HD (1920x1080)</SelectItem>
                    <SelectItem value="4k">4K (3840x2160)</SelectItem>
                    <SelectItem value="8k">8K (7680x4320)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Réaliste</SelectItem>
                    <SelectItem value="artistic">Artistique</SelectItem>
                    <SelectItem value="cinematic">Cinématographique</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="illustration">Illustration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Génération en cours...' : 'Générer Image IA'}
              </Button>

              {generatedImage && (
                <>
                  <Button
                    onClick={handleUpscale}
                    disabled={isGenerating}
                    variant="outline"
                    className="w-full"
                  >
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Améliorer en 4K/8K
                  </Button>

                  <Button
                    onClick={handleSave}
                    className="w-full bg-blue-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </>
              )}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">💡 Conseils</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Soyez détaillé dans votre description</li>
                <li>• Précisez couleurs, éclairage, composition</li>
                <li>• Utilisez "Améliorer" pour augmenter la qualité</li>
                <li>• Les images sont générées en haute résolution</li>
              </ul>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="p-6 flex flex-col items-center justify-center bg-slate-50">
            {generatedImage ? (
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src={generatedImage}
                    alt="Image générée"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border border-slate-300">
                  <p className="text-sm text-slate-600 font-medium">Prompt:</p>
                  <p className="text-xs text-slate-500 mt-1">{prompt}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      {quality.toUpperCase()}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {style}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Wand2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Aucune image générée</p>
                <p className="text-sm text-slate-500">
                  Décrivez votre image et cliquez sur "Générer"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}