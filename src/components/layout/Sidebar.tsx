import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Bell,
  LogOut,
  DollarSign,
  CheckSquare,
  UserCheck,
  Plus,
  FolderOpen,
  TrendingUp,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  roles: UserRole[];
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    icon: <Home size={20} />,
    label: 'Tableau de bord',
    path: '/dashboard',
    roles: ['agent', 'chef_departement', 'direction', 'recteur', 'auditeur', 'admin']
  },
  {
    icon: <FileText size={20} />,
    label: 'Mes demandes',
    path: '/requests',
    roles: ['agent']
  },
  {
    icon: <Plus size={20} />,
    label: 'Nouvelle demande',
    path: '/new-request',
    roles: ['agent']
  },
  {
    icon: <FolderOpen size={20} />,
    label: 'Gestion Département',
    path: '/department',
    roles: ['chef_departement']
  },
  {
    icon: <CheckSquare size={20} />,
    label: 'Validation Demandes',
    path: '/validation',
    roles: ['chef_departement', 'direction']
  },
  {
    icon: <DollarSign size={20} />,
    label: 'Budget Global',
    path: '/budget',
    roles: ['direction', 'recteur']
  },
  {
    icon: <UserCheck size={20} />,
    label: 'Approbation Rectorale',
    path: '/approval',
    roles: ['recteur']
  },
  {
    icon: <TrendingUp size={20} />,
    label: 'Exécution Budgétaire',
    path: '/execution',
    roles: ['direction', 'recteur']
  },
  {
    icon: <BarChart3 size={20} />,
    label: 'Rapports et Analyses',
    path: '/reports',
    roles: ['direction', 'recteur']
  },
  {
    icon: <Users size={20} />,
    label: 'Gestion Utilisateurs',
    path: '/users',
    roles: ['admin']
  },
  {
    icon: <Settings size={20} />,
    label: 'Paramètres Système',
    path: '/settings',
    roles: ['admin']
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPath,
  onNavigate
}) => {
  const { user, logout } = useAuth();

  const availableMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleBackToHome = () => {
    logout();
    window.location.reload();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 
        transform transition-all duration-500 ease-out
        lg:transform-none lg:shadow-xl lg:border-r border-slate-200/50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        before:absolute before:inset-0 before:bg-gradient-to-b before:from-slate-50/80 before:via-white/90 before:to-slate-50/80 before:pointer-events-none
      `}>
        <div className="flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-slate-200/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
            </div>
            
            <div className="flex items-center justify-between relative">
              <motion.button
                onClick={handleBackToHome}
                className="flex items-center text-left group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Logo size="md" variant="full" className="text-white drop-shadow-lg" />
              </motion.button>
              
              {/* Close button for mobile */}
              <motion.button
                onClick={onClose}
                className="lg:hidden p-2 rounded-xl text-white/90 hover:bg-white/15 transition-all duration-300 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>
            </div>
          </div>

          {/* User info */}
          {user && (
            <div className="p-6 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 via-white to-slate-50/80 relative">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-xl ring-3 ring-slate-100">
                    <span className="text-white font-bold text-base tracking-wide">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate tracking-tight">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-600 capitalize font-medium tracking-wide">
                    {user.role.replace('_', ' ')}
                  </p>
                  {user.department && (
                    <p className="text-xs text-slate-700 font-semibold mt-1 bg-slate-100 px-2 py-1 rounded-lg inline-block">
                      Dép. {user.department}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {availableMenuItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 font-medium tracking-wide ${
                  currentPath === item.path
                    ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-lg shadow-slate-900/25 ring-1 ring-slate-600'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 hover:shadow-md hover:shadow-slate-900/10'
                }`}
              >
                <div className={`transition-all duration-300 ${
                  currentPath === item.path 
                    ? 'text-white drop-shadow-sm' 
                    : 'text-slate-500 group-hover:text-slate-700'
                }`}>
                  {item.icon}
                </div>
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && (
                  <span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs px-2 py-1 rounded-lg font-bold shadow-md">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200/60 space-y-2 bg-gradient-to-br from-slate-50/80 via-white to-slate-50/80">
            <motion.button 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-white hover:text-slate-900 transition-all duration-300 font-medium tracking-wide hover:shadow-md hover:shadow-slate-900/10"
              whileHover={{ x: 3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
            >
              <Bell size={18} className="text-slate-500" />
              <span className="text-sm">Notifications</span>
              <span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs px-2 py-1 rounded-lg ml-auto font-bold shadow-md">
                3
              </span>
            </motion.button>
            
            <motion.button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all duration-300 font-medium tracking-wide hover:shadow-md hover:shadow-rose-900/10"
              whileHover={{ x: 3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
            >
              <LogOut size={18} />
              <span className="text-sm">Déconnexion</span>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};