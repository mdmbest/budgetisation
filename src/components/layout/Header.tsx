import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, Settings, UserCircle, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu button and breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} className="w-5 h-5" />
          </button>
          {/* Nouveau titre avec icône et sous-titre */}
          <div className="hidden md:flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Home size={22} className="text-slate-500" />
              <span>Tableau de bord</span>
            </div>
            <span className="text-xs text-gray-500 ml-7">Bienvenue sur votre espace de gestion</span>
          </div>
        </div>

        {/* Right side - Search and notifications */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {/* Avatar utilisateur */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border border-gray-300">
            {user?.firstName && user?.lastName ? (
              <span className="text-slate-700 font-bold text-base">
                {user.firstName[0].toUpperCase()}{user.lastName[0].toUpperCase()}
              </span>
            ) : (
              <UserCircle size={28} className="text-slate-400" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};