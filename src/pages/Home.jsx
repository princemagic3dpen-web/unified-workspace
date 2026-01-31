import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, Cpu, Zap, Brain, ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139,92,246,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-3xl p-1 shadow-2xl">
              <div className="w-full h-full bg-slate-900 rounded-3xl flex items-center justify-center">
                <Brain className="w-16 h-16 text-purple-400" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
          >
            MINIMA-X v3.0
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl text-slate-300 mb-4"
          >
            Intelligence Artificielle Neuronale
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-slate-400 mb-12"
          >
            Système d'exploitation autonome propulsé par 500x LLaMA + Transformers
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="glass-effect p-6 rounded-2xl">
              <Cpu className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Traitement Parallèle</h3>
              <p className="text-sm text-slate-400">500 instances IA en parallèle pour une puissance illimitée</p>
            </div>

            <div className="glass-effect p-6 rounded-2xl">
              <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Actions Massives</h3>
              <p className="text-sm text-slate-400">1000+ actions concrètes, création automatique de contenu</p>
            </div>

            <div className="glass-effect p-6 rounded-2xl">
              <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Auto-Développement</h3>
              <p className="text-sm text-slate-400">Amélioration continue autonome avec apprentissage profond</p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <a href={createPageUrl('OSPrincipal')}>
              <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl">
                Lancer l'OS Principal
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </a>
          </motion.div>

          {/* Version Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-slate-500 mt-8"
          >
            Version 3.0 • Propulsé par Base44 • Créé pour Mr Christian Debien
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}