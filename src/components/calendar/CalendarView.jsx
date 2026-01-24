import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { format, isSameDay, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CalendarView({ 
  events = [], 
  selectedDate, 
  onSelectDate, 
  onCreateEvent,
  onEventClick,
  onMoveEvent 
}) {
  const [viewMode, setViewMode] = useState('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_date), date)
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const renderDayContent = (day) => {
    const dayEvents = getEventsForDate(day);
    const isSelected = selectedDate && isSameDay(day, selectedDate);
    const isToday = isSameDay(day, new Date());

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative w-full h-full min-h-[80px] p-1 rounded-xl cursor-pointer
          transition-all duration-300 border-2
          ${isSelected ? 'border-cyan-500 bg-cyan-50/50' : 'border-transparent hover:border-cyan-200'}
          ${isToday ? 'bg-gradient-to-br from-cyan-50 to-sky-50' : 'bg-white/60'}
        `}
        onClick={() => onSelectDate(day)}
        onContextMenu={(e) => {
          e.preventDefault();
          onCreateEvent(day);
        }}
      >
        <div className={`
          text-sm font-semibold mb-1
          ${isToday ? 'text-cyan-600' : 'text-slate-700'}
          ${isSelected ? 'text-cyan-700' : ''}
        `}>
          {format(day, 'd')}
        </div>
        
        <div className="space-y-1 overflow-hidden max-h-[60px]">
          {dayEvents.slice(0, 3).map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="text-xs px-2 py-0.5 rounded-md truncate cursor-pointer hover:opacity-80"
              style={{ backgroundColor: event.color || '#06b6d4', color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick(event);
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('eventId', event.id);
              }}
            >
              {event.title}
            </motion.div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-slate-500 pl-2">
              +{dayEvents.length - 3} autres
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-lg shadow-cyan-200">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
              </h2>
              <p className="text-sm text-slate-500">
                {events.length} événement{events.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="rounded-xl hover:bg-cyan-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentMonth(new Date())}
              className="rounded-xl"
            >
              Aujourd'hui
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="rounded-xl hover:bg-cyan-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 p-2 bg-slate-50/50">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div 
        className="flex-1 grid grid-cols-7 gap-1 p-2 overflow-auto"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const eventId = e.dataTransfer.getData('eventId');
          if (eventId && onMoveEvent) {
            // Get the target date from the drop position
            // This is simplified - in production you'd calculate the exact cell
          }
        }}
      >
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: (startOfMonth(currentMonth).getDay() + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[80px] bg-slate-50/30 rounded-xl" />
        ))}
        
        {days.map(day => (
          <div key={day.toISOString()}>
            {renderDayContent(day)}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="p-4 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <Button
          onClick={() => onCreateEvent(selectedDate || new Date())}
          className="w-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white rounded-xl shadow-lg shadow-cyan-200/50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Événement
        </Button>
      </div>
    </div>
  );
}