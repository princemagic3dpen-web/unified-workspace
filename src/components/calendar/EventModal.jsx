import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Palette, 
  FolderPlus,
  ArrowLeftRight,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = [
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444',
  '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6'
];

export default function EventModal({ 
  isOpen, 
  onClose, 
  event, 
  onSave, 
  onDelete,
  onMove,
  initialDate 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(),
    color: '#06b6d4',
    status: 'planned',
    recurrence: 'none',
    reminder: 30,
    create_folder: true
  });

  const [showMoveOptions, setShowMoveOptions] = useState(false);
  const [moveOffset, setMoveOffset] = useState(0);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        start_date: new Date(event.start_date),
        end_date: event.end_date ? new Date(event.end_date) : new Date(event.start_date),
        create_folder: false
      });
    } else if (initialDate) {
      const startDate = new Date(initialDate);
      startDate.setHours(9, 0, 0, 0);
      const endDate = new Date(initialDate);
      endDate.setHours(10, 0, 0, 0);
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        start_date: startDate,
        end_date: endDate,
        create_folder: true
      }));
    }
  }, [event, initialDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      start_date: formData.start_date.toISOString(),
      end_date: formData.end_date.toISOString()
    });
  };

  const handleMove = () => {
    if (moveOffset !== 0 && event) {
      const newStartDate = new Date(formData.start_date);
      newStartDate.setDate(newStartDate.getDate() + moveOffset);
      const newEndDate = new Date(formData.end_date);
      newEndDate.setDate(newEndDate.getDate() + moveOffset);
      
      onMove(event.id, {
        start_date: newStartDate.toISOString(),
        end_date: newEndDate.toISOString()
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white/95 backdrop-blur-xl border-slate-200 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div 
              className="p-2 rounded-xl"
              style={{ backgroundColor: formData.color + '20' }}
            >
              <CalendarIcon className="w-5 h-5" style={{ color: formData.color }} />
            </div>
            {event ? 'Modifier l\'événement' : 'Nouvel événement'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Titre</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nom de l'événement"
              className="rounded-xl border-slate-200 focus:border-cyan-400 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Description</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Détails de l'événement..."
              className="rounded-xl border-slate-200 focus:border-cyan-400 resize-none h-20"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <CalendarIcon className="w-4 h-4 mr-2 text-cyan-500" />
                    {format(formData.start_date, 'dd MMM yyyy', { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => date && setFormData({ ...formData, start_date: date })}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={format(formData.start_date, 'HH:mm')}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date(formData.start_date);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  setFormData({ ...formData, start_date: newDate });
                }}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <CalendarIcon className="w-4 h-4 mr-2 text-cyan-500" />
                    {format(formData.end_date, 'dd MMM yyyy', { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={(date) => date && setFormData({ ...formData, end_date: date })}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={format(formData.end_date, 'HH:mm')}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date(formData.end_date);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  setFormData({ ...formData, end_date: newDate });
                }}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Couleur</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(color => (
                <motion.button
                  key={color}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-7 h-7 rounded-lg transition-all ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Status & Recurrence */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planifié</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Récurrence</Label>
              <Select
                value={formData.recurrence}
                onValueChange={(value) => setFormData({ ...formData, recurrence: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  <SelectItem value="daily">Quotidien</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="yearly">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Create folder option for new events */}
          {!event && (
            <label className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50 border border-cyan-100 cursor-pointer hover:bg-cyan-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.create_folder}
                onChange={(e) => setFormData({ ...formData, create_folder: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-600"
              />
              <FolderPlus className="w-5 h-5 text-cyan-600" />
              <span className="text-sm font-medium text-cyan-700">
                Créer un dossier lié à cet événement
              </span>
            </label>
          )}

          {/* Move options for existing events */}
          {event && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <button
                type="button"
                onClick={() => setShowMoveOptions(!showMoveOptions)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-cyan-600"
              >
                <ArrowLeftRight className="w-4 h-4" />
                Décaler l'événement
              </button>
              
              <AnimatePresence>
                {showMoveOptions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      type="number"
                      value={moveOffset}
                      onChange={(e) => setMoveOffset(parseInt(e.target.value) || 0)}
                      className="w-20 rounded-xl"
                    />
                    <span className="text-sm text-slate-500">jours</span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleMove}
                      className="rounded-xl"
                      disabled={moveOffset === 0}
                    >
                      Décaler
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {event && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(event.id)}
                className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {event ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}