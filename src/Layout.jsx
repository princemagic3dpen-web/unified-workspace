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