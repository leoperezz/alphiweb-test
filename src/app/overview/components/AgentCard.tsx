/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import FileRenderer from './FileRenderer';
import { LuDatabaseZap } from 'react-icons/lu';
import { PiGraph } from 'react-icons/pi';
import { IoShareSocial } from 'react-icons/io5';

interface AgentCardProps {
  name: string;
  projectId: string;
  created: string;
  status: 'active' | 'building' | 'inactive';
  message: string;
  progress: number;
  files?: { name: string; size?: number }[];
  projectTypeModel: 'basic' | 'lightrag';
  onClick: () => void;
  onShare?: () => void;
}

export default function AgentCard({ name, projectId, created, status, message, progress, files = [], projectTypeModel, onClick, onShare }: AgentCardProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bgColor: 'bg-emerald-500/20',
          textColor: 'text-emerald-500',
          progressColor: 'bg-emerald-500/50'
        };
      case 'building':
        return {
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-500',
          progressColor: 'bg-blue-500/50'
        };
      case 'inactive':
        return {
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-500',
          progressColor: 'bg-red-500/50'
        };
      default:
        return {
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-500',
          progressColor: 'bg-gray-500/50'
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <div 
      className="p-6 border border-white/10 rounded-lg font-geist text-sm transition-all duration-300 
      hover:border-white/30 hover:shadow-lg hover:bg-white/5 max-w-sm relative cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShare?.();
        }}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 
        transition-colors text-white/50 hover:text-white"
      >
        <IoShareSocial className="text-lg" />
      </button>

      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4">{name}</h3>
        <div className="space-y-3">
          <p className="text-white/70 text-sm">Created: {created.slice(0,10)}</p>
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm">Status:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${styles.bgColor} ${styles.textColor}`}>
              {status}
            </span>
          </div>
          
          {/* Tipo de modelo */}
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm">Model:</span>
            {projectTypeModel === 'basic' ? (
              <>
                <LuDatabaseZap className="text-lg text-blue-500" />
                <span className="text-white/70 text-sm">Traditional</span>
              </>
            ) : (
              <>
                <PiGraph className="text-lg text-blue-500" />
                <span className="text-white/70 text-sm">Advanced</span>
              </>
            )}
          </div>

          {/* Barra de progreso */}
          <div className="mt-6">
            <div className="w-full bg-white/5 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${styles.progressColor}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-white/50 mt-2">{progress}%</p>
          </div>

          <div className="mt-4">
            <p className="text-white/70 text-sm">{message}</p>
          </div>
        </div>
      </div>

      {/* Sección de archivos - ahora con altura máxima y scroll */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
          <p className="text-white/70 text-sm mb-2">Files:</p>
          {files.slice(0, 3).map((file, index) => (
            <FileRenderer 
              key={index}
              fileName={file.name}
              size={file.size}
              showSize={true}
            />
          ))}
          {files.length > 3 && (
            <p className="text-xs text-white/50">
              +{files.length - 3} more files
            </p>
          )}
        </div>
      )}
    </div>
  );
}
