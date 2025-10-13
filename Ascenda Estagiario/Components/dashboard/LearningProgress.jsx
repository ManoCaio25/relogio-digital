import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils"; 
import { BookOpen, ChevronRight, Play, FileText, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function LearningProgress({ learningPaths, content, isLoading }) {
  const mockPath = {
    nome_trilha: "Frontend Development Mastery",
    descricao: "Complete path from basics to advanced frontend development",
    progress_percent: 73
  };

  const mockContent = [
    {
      id: "1",
      titulo: "React Hooks Deep Dive",
      tipo_conteudo: "Video", 
      status_conclusao: "Em Progresso",
      duracao_estimada_minutos: 45,
      ordem_na_trilha: 4
    },
    {
      id: "2", 
      titulo: "State Management with Redux",
      tipo_conteudo: "Video",
      status_conclusao: "Nao Iniciado",
      duracao_estimada_minutos: 60,
      ordem_na_trilha: 5
    },
    {
      id: "3",
      titulo: "Performance Optimization Guide", 
      tipo_conteudo: "PDF",
      status_conclusao: "Concluido", 
      duracao_estimada_minutos: 30,
      ordem_na_trilha: 3
    }
  ];

  const currentPath = learningPaths[0] || mockPath;
  const pathContent = content.length > 0 ? content.slice(0, 3) : mockContent;

  const getContentIcon = (type) => {
    switch (type) {
      case 'Video': return <Play className="w-4 h-4" />;
      case 'PDF': return <FileText className="w-4 h-4" />;
      case 'Link Externo': return <ExternalLink className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluido': return 'text-green-400';
      case 'Em Progresso': return 'text-blue-400';
      case 'Nao Iniciado': return 'text-slate-400';
      default: return 'text-slate-400';
    }
  };

  if (isLoading) {
    return (
      <div className="cosmic-card rounded-xl p-6 cosmic-glow">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
          <div className="space-y-3 mt-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                <Skeleton className="h-4 w-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cosmic-card rounded-xl p-6 cosmic-glow"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Learning Progress</h2>
        </div>
        <Link to={createPageUrl("LearningPath")}>
          <Button variant="outline" size="sm" className="border-blue-600 text-blue-300 hover:bg-blue-600/20">
            View Path
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-white mb-2">{currentPath.nome_trilha}</h3>
          <p className="text-sm text-slate-400 mb-3">{currentPath.descricao}</p>
          <div className="flex items-center gap-3">
            <Progress value={currentPath.progress_percent || 73} className="flex-1 h-2" />
            <span className="text-sm font-medium text-white">{currentPath.progress_percent || 73}%</span>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Next Lessons</h4>
          <div className="space-y-3">
            {pathContent.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className={`p-1 rounded ${getStatusColor(item.status_conclusao)}`}>
                  {item.status_conclusao === 'Concluido' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    getContentIcon(item.tipo_conteudo)
                  )}
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-white">{item.titulo}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${getStatusColor(item.status_conclusao)}`}>
                      {item.status_conclusao?.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.duracao_estimada_minutos} min
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}