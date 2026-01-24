import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Minus, 
  Maximize2, 
  Minimize2,
  GripHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function WindowManager({ 
  windows, 
  activeWindowId, 
  onClose, 
  onMinimize, 
  onMaximize,
  onFocus,
  onMove
}) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence>
        {windows.filter(w => !w.minimized).map((window, index) => (
          <Window
            key={window.id}
            window={window}
            isActive={activeWindowId === window.id}
            zIndex={windows.findIndex(w => w.id === window.id) + 10}
            onClose={() => onClose(window.id)}
            onMinimize={() => onMinimize(window.id)}
            onMaximize={() => onMaximize(window.id)}
            onFocus={() => onFocus(window.id)}
            onMove={(position) => onMove(window.id, position)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Window({ 
  window, 
  isActive, 
  zIndex, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus,
  onMove
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const handleDragStart = (e) => {
    if (window.maximized) return;
    
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    onFocus();
  };

  const handleDrag = (e) => {
    if (!isDragging || window.maximized) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    onMove({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, dragOffset]);

  const windowStyle = window.maximized
    ? { top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }
    : { 
        top: window.position?.y || 50, 
        left: window.position?.x || 50,
        width: window.size?.width || 800,
        height: window.size?.height || 600
      };

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        ...windowStyle,
        zIndex,
        position: 'absolute'
      }}
      className={`
        flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden
        ${isActive ? 'ring-2 ring-cyan-400' : 'ring-1 ring-slate-200'}
        ${window.maximized ? 'rounded-none' : ''}
      `}
      onClick={onFocus}
    >
      {/* Title bar */}
      <div
        className={`
          flex items-center justify-between px-4 py-2 border-b border-slate-200
          ${isActive ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-slate-700'}
          cursor-move select-none
        `}
        onMouseDown={handleDragStart}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-3">
          <div 
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: window.color || '#06b6d4' }}
          >
            {window.icon && <window.icon className="w-4 h-4 text-white" />}
          </div>
          <span className="text-sm font-medium text-white truncate max-w-[300px]">
            {window.title}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="h-6 w-6 rounded-lg hover:bg-white/20 text-white/70 hover:text-white"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            className="h-6 w-6 rounded-lg hover:bg-white/20 text-white/70 hover:text-white"
          >
            {window.maximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="h-6 w-6 rounded-lg hover:bg-red-500 text-white/70 hover:text-white"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-slate-50">
        {window.content}
      </div>
    </motion.div>
  );
}