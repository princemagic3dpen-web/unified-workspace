import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = [
  '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#f97316'
];

export default function FolderCreateModal({ isOpen, onClose, onSubmit, parentId }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSubmit({
      name: name.trim(),
      color,
      parent_id: parentId || null
    });
    
    setName('');
    setColor('#3b82f6');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: color + '20' }}>
              <Folder className="w-5 h-5" style={{ color }} />
            </div>
            Nouveau dossier
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Nom du dossier</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon dossier"
              className="rounded-xl"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Couleur
            </Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <motion.button
                  key={c}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600"
              disabled={!name.trim()}
            >
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}