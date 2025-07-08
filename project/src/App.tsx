import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { DashboardPage } from './pages/DashboardPage';
import { RequestsPage } from './pages/RequestsPage';
import { NewRequestPage } from './pages/NewRequestPage';
import { DepartmentPage } from './pages/DepartmentPage';
import { UsersManagementPage } from './pages/UsersManagementPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { useAuth } from './hooks/useAuth';

type AppState = 'home' | 'login' | 'documentation' | 'dashboard';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user, checkAuth } = useAuth();

  // Vérifier l'authentification au chargement de l'app
  useEffect(() => {
    const initAuth = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        setCurrentState('dashboard');
      }
    };
    
    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && currentState !== 'dashboard') {
      setCurrentState('dashboard');
    }
  }, [isAuthenticated, currentState]);

  const handleLogin = () => {
    setCurrentState('login');
  };

  const handleDocumentation = () => {
    setCurrentState('documentation');
  };

  const handleLoginSuccess = () => {
    console.log('handleLoginSuccess appelé');
    setCurrentState('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentState('home');
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSidebarOpen(false);
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/dashboard': 'Tableau de Bord',
      '/requests': 'Mes Demandes',
      '/new-request': 'Nouvelle Demande',
      '/department': 'Gestion Département',
      '/validation': 'Validation des Demandes',
      '/budget': 'Budget Global',
      '/approval': 'Approbation Rectorale',
      '/execution': 'Exécution Budgétaire',
      '/reports': 'Rapports et Analyses',
      '/audit': 'Interface Audit',
      '/users': 'Gestion Utilisateurs',
      '/settings': 'Paramètres Système'
    };
    return titles[currentPath] || 'ESP Budget';
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <DashboardPage />;
      case '/requests':
        return <RequestsPage />;
      case '/new-request':
        return <NewRequestPage />;
      case '/department':
        return <DepartmentPage />;
      case '/users':
        return <UsersManagementPage />;
      case '/validation':
        return <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Validation des Demandes</h2>
            <p className="text-gray-600">Module en cours de développement</p>
          </div>
        </div>;
      case '/budget':
        return <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Budget Global</h2>
            <p className="text-gray-600">Module en cours de développement</p>
          </div>
        </div>;
      case '/approval':
        return <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Approbation Rectorale</h2>
            <p className="text-gray-600">Module en cours de développement</p>
          </div>
        </div>;
      case '/execution':
        return <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exécution Budgétaire</h2>
            <p className="text-gray-600">Module en cours de développement</p>
          </div>
        </div>;
      case '/reports':
        return <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rapports et Analyses</h2>
            <p className="text-gray-600">Module en cours de développement</p>
          </div>
        </div>;
      case '/audit':
        return <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interface Audit</h2>
            <p className="text-gray-600">Module en cours de développement</p>
          </div>
        </div>;
      case '/settings':
        return <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Paramètres Système</h2>
            <p className="text-gray-600">Module en cours de développement</p>
          </div>
        </div>;
      default:
        return <DashboardPage />;
    }
  };

  // Log de debug pour comprendre l'état de l'app
  console.log('currentState', currentState, 'isAuthenticated', isAuthenticated, 'user', user, 'currentPath', currentPath);
  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {currentState === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onLogin={handleLogin} onDocumentation={handleDocumentation} />
          </motion.div>
        )}

        {currentState === 'documentation' && (
          <motion.div
            key="documentation"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <DocumentationPage onBackToHome={handleBackToHome} />
          </motion.div>
        )}

        {currentState === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <LoginPage onBack={handleBackToHome} onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}

        {currentState === 'dashboard' && isAuthenticated && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex h-screen"
          >
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              currentPath={currentPath}
              onNavigate={handleNavigate}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header
                onMenuClick={() => setSidebarOpen(true)}
                title={getPageTitle()}
              />
              <main className="flex-1 overflow-y-auto p-6">
                <motion.div
                  key={currentPath}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentPage()}
                </motion.div>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;