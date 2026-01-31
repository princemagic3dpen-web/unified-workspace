import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function ParametersDiagram() {
  const [zoom, setZoom] = useState(1);
  const [nodes] = useState([
    // Niveau 1 - Catégories principales
    { id: 1, label: 'Intelligence\nArtificielle', x: 400, y: 100, level: 1, color: '#8b5cf6' },
    { id: 2, label: 'Voix &\nAudio', x: 700, y: 100, level: 1, color: '#06b6d4' },
    { id: 3, label: 'Création\nAutomatique', x: 1000, y: 100, level: 1, color: '#10b981' },
    { id: 4, label: 'Système\nOS', x: 100, y: 100, level: 1, color: '#f59e0b' },
    
    // Niveau 2 - IA
    { id: 11, label: '500x LLaMA', x: 300, y: 250, level: 2, color: '#a78bfa', parent: 1 },
    { id: 12, label: '500x Transformers', x: 400, y: 250, level: 2, color: '#a78bfa', parent: 1 },
    { id: 13, label: 'Neurones', x: 500, y: 250, level: 2, color: '#a78bfa', parent: 1 },
    
    // Niveau 2 - Voix
    { id: 21, label: 'Transcription', x: 650, y: 250, level: 2, color: '#22d3ee', parent: 2 },
    { id: 22, label: 'Synthèse', x: 750, y: 250, level: 2, color: '#22d3ee', parent: 2 },
    { id: 23, label: 'Émotions', x: 850, y: 250, level: 2, color: '#22d3ee', parent: 2 },
    
    // Niveau 2 - Création
    { id: 31, label: 'Dossiers', x: 950, y: 250, level: 2, color: '#34d399', parent: 3 },
    { id: 32, label: 'Fichiers', x: 1050, y: 250, level: 2, color: '#34d399', parent: 3 },
    { id: 33, label: 'Images 4K', x: 1150, y: 250, level: 2, color: '#34d399', parent: 3 },
    
    // Niveau 2 - Système
    { id: 41, label: 'Sécurité', x: 50, y: 250, level: 2, color: '#fbbf24', parent: 4 },
    { id: 42, label: 'Internet', x: 150, y: 250, level: 2, color: '#fbbf24', parent: 4 },
    
    // Niveau 3 - Émotions détaillées
    { id: 231, label: 'Joie', x: 750, y: 400, level: 3, color: '#67e8f9', parent: 23 },
    { id: 232, label: 'Calme', x: 820, y: 400, level: 3, color: '#67e8f9', parent: 23 },
    { id: 233, label: 'Professionnel', x: 890, y: 400, level: 3, color: '#67e8f9', parent: 23 },
    { id: 234, label: 'Excitation', x: 960, y: 400, level: 3, color: '#67e8f9', parent: 23 },
  ]);

  const [connections] = useState([
    // Connections niveau 1 -> 2
    { from: 1, to: 11 }, { from: 1, to: 12 }, { from: 1, to: 13 },
    { from: 2, to: 21 }, { from: 2, to: 22 }, { from: 2, to: 23 },
    { from: 3, to: 31 }, { from: 3, to: 32 }, { from: 3, to: 33 },
    { from: 4, to: 41 }, { from: 4, to: 42 },
    
    // Connections niveau 2 -> 3
    { from: 23, to: 231 }, { from: 23, to: 232 }, { from: 23, to: 233 }, { from: 23, to: 234 },
    
    // Connections inter-catégories
    { from: 11, to: 21 }, { from: 12, to: 22 }, { from: 13, to: 23 },
    { from: 21, to: 31 }, { from: 22, to: 32 },
  ]);

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/95 via-violet-900/95 to-slate-900/95 backdrop-blur-xl">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Diagramme 2D Paramètres</h1>
              <p className="text-slate-400 text-sm">Classement automatique logique • Relations interconnectées</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
              className="border-slate-700"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
              className="border-slate-700"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(1)}
              className="border-slate-700"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-4 overflow-auto" style={{ height: 'calc(100vh - 180px)' }}>
          <svg
            width={1400 * zoom}
            height={600 * zoom}
            className="mx-auto"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            {/* Connections */}
            {connections.map((conn, idx) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;
              
              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="rgba(148, 163, 184, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.level === 1 ? 60 : node.level === 2 ? 45 : 35}
                  fill={node.color}
                  opacity="0.9"
                  stroke="white"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={node.level === 1 ? "14" : node.level === 2 ? "12" : "10"}
                  fontWeight="bold"
                >
                  {node.label.split('\n').map((line, i) => (
                    <tspan key={i} x={node.x} dy={i === 0 ? 0 : 14}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            ))}

            {/* Légende */}
            <g transform="translate(20, 500)">
              <text x="0" y="0" fill="white" fontSize="12" fontWeight="bold">Légende:</text>
              <circle cx="10" cy="20" r="8" fill="#8b5cf6" opacity="0.9" />
              <text x="25" y="24" fill="white" fontSize="10">Intelligence IA</text>
              
              <circle cx="10" cy="40" r="8" fill="#06b6d4" opacity="0.9" />
              <text x="25" y="44" fill="white" fontSize="10">Voix & Audio</text>
              
              <circle cx="10" cy="60" r="8" fill="#10b981" opacity="0.9" />
              <text x="25" y="64" fill="white" fontSize="10">Création Auto</text>
              
              <circle cx="10" cy="80" r="8" fill="#f59e0b" opacity="0.9" />
              <text x="25" y="84" fill="white" fontSize="10">Système OS</text>
            </g>
          </svg>
        </Card>

        <div className="mt-4 grid grid-cols-4 gap-3">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-3 text-center">
            <p className="text-2xl font-bold text-violet-400">{nodes.length}</p>
            <p className="text-xs text-slate-400">Paramètres totaux</p>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{connections.length}</p>
            <p className="text-xs text-slate-400">Connexions</p>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-3 text-center">
            <p className="text-2xl font-bold text-green-400">3</p>
            <p className="text-xs text-slate-400">Niveaux hiérarchie</p>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">100%</p>
            <p className="text-xs text-slate-400">Automatisé</p>
          </Card>
        </div>
      </div>
    </div>
  );
}