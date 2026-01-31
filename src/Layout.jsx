import React from 'react';
import { Toaster } from 'sonner';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900">
      <style>{`
        :root {
            --background: 222.2 84% 4.9%;
            --foreground: 210 40% 98%;
            --primary: 186 100% 42%;
            --primary-foreground: 210 40% 98%;
            --secondary: 217.2 32.6% 17.5%;
            --secondary-foreground: 210 40% 98%;
            --muted: 217.2 32.6% 17.5%;
            --muted-foreground: 215 20.2% 65.1%;
            --accent: 217.2 32.6% 17.5%;
            --accent-foreground: 210 40% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 210 40% 98%;
            --border: 217.2 32.6% 17.5%;
            --input: 217.2 32.6% 17.5%;
            --ring: 186 100% 42%;
          }

          /* OPTIMISATION LISIBILITÉ TEXTES - QI ILLIMITÉ */
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }

          body, input, textarea, select, button {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            letter-spacing: 0.01em;
          }

          /* Amélioration contraste textes */
          .text-white { color: #ffffff !important; }
          .text-slate-300 { color: #e2e8f0 !important; }
          .text-slate-400 { color: #cbd5e1 !important; }
          .text-slate-200 { color: #f1f5f9 !important; }

          /* Tailles textes optimisées */
          .text-xs { font-size: 13px !important; }
          .text-sm { font-size: 15px !important; }
          .text-base { font-size: 17px !important; }
          .text-lg { font-size: 19px !important; }
          .text-xl { font-size: 21px !important; }
          .text-2xl { font-size: 25px !important; }
          .text-3xl { font-size: 32px !important; }

          /* Fluidité animations - 60 FPS garanti */
          * {
            will-change: transform, opacity;
            transform: translateZ(0);
            backface-visibility: hidden;
          }

          /* Optimisation GPU */
          .glass-effect, .glass-hover, [class*="bg-gradient"] {
            transform: translate3d(0, 0, 0);
            -webkit-transform: translate3d(0, 0, 0);
          }

          /* Responsive mobile/desktop */
          @media (max-width: 768px) {
            body { font-size: 14px; }
            .text-xs { font-size: 12px !important; }
            .text-sm { font-size: 14px !important; }
            .text-base { font-size: 16px !important; }
          }

          /* Algorithmes mathématiques QI ∞ - Parallélisation */
          @keyframes qi-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.02); }
          }

          [data-qi-enhanced] {
            animation: qi-pulse 3s ease-in-out infinite;
          }
        
        * {
            scrollbar-width: thin;
            scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
          }

          *::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          *::-webkit-scrollbar-track {
            background: transparent;
          }

          *::-webkit-scrollbar-thumb {
            background-color: rgba(148, 163, 184, 0.3);
            border-radius: 3px;
          }

          *::-webkit-scrollbar-thumb:hover {
            background-color: rgba(148, 163, 184, 0.5);
          }

          /* Effets semi-transparence globaux */
          .glass-effect {
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(148, 163, 184, 0.1);
          }

          .glass-hover:hover {
            background: rgba(30, 41, 59, 0.8);
            backdrop-filter: blur(24px);
            border-color: rgba(148, 163, 184, 0.2);
            transition: all 0.3s ease;
          }

          /* Animation fluide universelle */
          * {
            transition: opacity 0.2s ease, transform 0.2s ease;
          }
      `}</style>
      {children}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#f1f5f9'
          }
        }}
      />
    </div>
  );
}