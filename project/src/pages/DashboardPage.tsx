import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Shield,
  Settings,
  Building,
  UserCheck,
  Home
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBudgetRequests } from '../hooks/useBudgetRequests';
import { useUsers } from '../hooks/useUsers';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, fetchRequests } = useBudgetRequests();
  const { users } = useUsers();

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fonction utilitaire pour les stats selon le rôle
  const getStatsForRole = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          {
            title: 'Total Utilisateurs',
            value: users.length.toString(),
            icon: <Users className="text-slate-600" size={24} />,
            change: `${users.filter(u => u.isActive).length} actifs`,
            color: 'slate',
            trend: '+5%'
          },
          {
            title: 'Demandes Système',
            value: requests.length.toString(),
            icon: <FileText className="text-green-600" size={24} />,
            change: '+12 ce mois',
            color: 'green',
            trend: '+12%'
          },
          {
            title: 'Départements',
            value: '8',
            icon: <Building className="text-purple-600" size={24} />,
            change: 'Tous actifs',
            color: 'purple',
            trend: '100%'
          },
          {
            title: 'Budget Total',
            value: formatCurrency(requests.reduce((sum, r) => sum + r.amount, 0)),
            icon: <DollarSign className="text-orange-600" size={24} />,
            change: 'Consolidé',
            color: 'orange',
            trend: '+8%'
          }
        ];

      case 'agent':
        return [
          {
            title: 'Mes Demandes',
            value: requests.filter(r => r.agentId === user.id).length.toString(),
            icon: <FileText className="text-slate-600" size={24} />,
            change: '+2 ce mois',
            color: 'slate',
            trend: '+25%'
          },
          {
            title: 'En Attente',
            value: requests.filter(r => r.status.includes('review')).length.toString(),
            icon: <Clock className="text-yellow-600" size={24} />,
            change: 'En cours',
            color: 'yellow',
            trend: '0%'
          },
          {
            title: 'Approuvées',
            value: requests.filter(r => r.status.includes('approved')).length.toString(),
            icon: <CheckCircle className="text-green-600" size={24} />,
            change: '+1 récemment',
            color: 'green',
            trend: '+50%'
          },
          {
            title: 'Montant Total',
            value: formatCurrency(requests.filter(r => r.agentId === user.id).reduce((sum, r) => sum + r.amount, 0)),
            icon: <DollarSign className="text-purple-600" size={24} />,
            change: 'Budget demandé',
            color: 'purple',
            trend: '+15%'
          }
        ];

      case 'chef_departement':
        return [
          {
            title: 'Demandes Département',
            value: requests.filter(r => r.department === user.department).length.toString(),
            icon: <FileText className="text-slate-600" size={24} />,
            change: '+5 ce mois',
            color: 'slate',
            trend: '+20%'
          },
          {
            title: 'À Valider',
            value: requests.filter(r => r.status === 'chef_review').length.toString(),
            icon: <Clock className="text-yellow-600" size={24} />,
            change: 'Action requise',
            color: 'yellow',
            trend: '0%'
          },
          {
            title: 'Agents Actifs',
            value: users.filter(u => u.department === user.department && u.role === 'agent').length.toString(),
            icon: <Users className="text-green-600" size={24} />,
            change: 'Dans le département',
            color: 'green',
            trend: '100%'
          },
          {
            title: 'Budget Département',
            value: formatCurrency(requests.filter(r => r.department === user.department).reduce((sum, r) => sum + r.amount, 0)),
            icon: <DollarSign className="text-purple-600" size={24} />,
            change: 'Total demandé',
            color: 'purple',
            trend: '+18%'
          }
        ];

      case 'direction':
        return [
          {
            title: 'Total Demandes',
            value: requests.length.toString(),
            icon: <FileText className="text-slate-600" size={24} />,
            change: '+15 ce mois',
            color: 'slate',
            trend: '+15%'
          },
          {
            title: 'En Validation',
            value: requests.filter(r => r.status === 'direction_review').length.toString(),
            icon: <Clock className="text-yellow-600" size={24} />,
            change: 'À traiter',
            color: 'yellow',
            trend: '0%'
          },
          {
            title: 'Départements',
            value: '8',
            icon: <Users className="text-green-600" size={24} />,
            change: 'Actifs',
            color: 'green',
            trend: '100%'
          },
          {
            title: 'Budget Global',
            value: formatCurrency(requests.reduce((sum, r) => sum + r.amount, 0)),
            icon: <DollarSign className="text-purple-600" size={24} />,
            change: 'Consolidé',
            color: 'purple',
            trend: '+12%'
          }
        ];

      case 'recteur':
        return [
          {
            title: 'Demandes Finales',
            value: requests.filter(r => r.status === 'recteur_review').length.toString(),
            icon: <FileText className="text-slate-600" size={24} />,
            change: 'À approuver',
            color: 'slate',
            trend: '0%'
          },
          {
            title: 'Approuvées',
            value: requests.filter(r => r.status === 'recteur_approved').length.toString(),
            icon: <CheckCircle className="text-green-600" size={24} />,
            change: 'Signées',
            color: 'green',
            trend: '+10%'
          },
          {
            title: 'Taux d\'Approbation',
            value: '85%',
            icon: <TrendingUp className="text-purple-600" size={24} />,
            change: 'Ce trimestre',
            color: 'purple',
            trend: '+5%'
          },
          {
            title: 'Budget Total ESP',
            value: formatCurrency(requests.reduce((sum, r) => sum + r.amount, 0)),
            icon: <DollarSign className="text-orange-600" size={24} />,
            change: 'Exercice 2024',
            color: 'orange',
            trend: '+8%'
          }
        ];

      default:
        return [];
    }
  };

  if ((user?.role as string) === 'admin') {
    return (
      <div className="space-y-6">
        {/* Breadcrumb et header admin */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-700" size={32} />
            <div>
              <h1 className="text-2xl font-extrabold text-blue-900">Espace Administrateur</h1>
              <p className="text-base text-blue-700 font-medium">Gérez les utilisateurs, les rôles, les départements et la sécurité de la plateforme</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <nav className="text-sm text-blue-800 font-semibold">
            Administration
          </nav>
        </div>
        {/* Stats et widgets admin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Utilisateurs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {users.filter(u => u.isActive).length} actifs
                </p>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                <Users className="text-slate-600" size={24} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-500" />
          </Card>
          <Card hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Départements
                </p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-500 mt-1">Tous actifs</p>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                <Building className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
          </Card>
          <Card hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Rôles Utilisateurs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.from(new Set(users.map(u => u.role))).length}
                </p>
                <p className="text-sm text-gray-500 mt-1">Types de rôles actifs</p>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                <Shield className="text-green-600" size={24} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Dernières connexions
                </p>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  {users.slice(0, 5).map(u => (
                    <li key={u.id}>
                      {u.firstName} {u.lastName} — {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Jamais connecté'}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500" />
          </Card>
          <Card hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Sécurité
                </p>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>Authentification JWT</li>
                  <li>Gestion des rôles et permissions</li>
                  <li>Logs d'activité</li>
                  <li>Protection des accès sensibles</li>
                </ul>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                <Shield className="text-red-600" size={24} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500" />
          </Card>
        </div>
      </div>
    );
  }

  // Préparer header selon le rôle
  let headerIcon = null;
  let headerTitle = '';
  let headerSubtitle = '';
  let headerBreadcrumb = '';
  switch (user?.role) {
    case 'agent':
      headerIcon = <UserCheck className="text-blue-700" size={32} />;
      headerTitle = 'Espace Agent';
      headerSubtitle = 'Suivez et gérez vos demandes budgétaires personnelles';
      headerBreadcrumb = 'Agent';
      break;
    case 'direction':
      headerIcon = <BarChart3 className="text-green-700" size={32} />;
      headerTitle = 'Espace Direction';
      headerSubtitle = 'Analysez, arbitrez et validez les budgets de tous les départements';
      headerBreadcrumb = 'Direction';
      break;
    case 'recteur':
      headerIcon = <Shield className="text-purple-700" size={32} />;
      headerTitle = 'Espace Recteur';
      headerSubtitle = 'Approuvez les budgets consolidés et signez les validations finales';
      headerBreadcrumb = 'Recteur';
      break;
    default:
      headerIcon = <Home className="text-blue-700" size={32} />;
      headerTitle = 'Tableau de bord';
      headerSubtitle = 'Bienvenue sur la plateforme de gestion budgétaire';
      headerBreadcrumb = 'Accueil';
  }

  const stats = getStatsForRole();

  const getStatusColor = (status: string) => {
    if (status.includes('approved')) return 'success';
    if (status.includes('rejected')) return 'danger';
    if (status.includes('review')) return 'warning';
    return 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'draft': 'Brouillon',
      'submitted': 'Soumise',
      'chef_review': 'Validation Chef',
      'chef_approved': 'Approuvée Chef',
      'chef_rejected': 'Rejetée Chef',
      'direction_review': 'Validation Direction',
      'direction_approved': 'Approuvée Direction',
      'direction_rejected': 'Rejetée Direction',
      'recteur_review': 'Validation Recteur',
      'recteur_approved': 'Approuvée Recteur',
      'recteur_rejected': 'Rejetée Recteur',
      'executed': 'Exécutée'
    };
    return statusMap[status] || status;
  };

  const relevantRequests = user?.role === 'agent' 
    ? requests.filter(r => r.agentId === user.id)
    : user?.role === 'chef_departement'
    ? requests.filter(r => r.department === user.department)
    : requests;

  const getNotificationsForRole = () => {
    if (!user) return [];

    const notifications = [];

    switch (user.role) {
      case 'admin':
        notifications.push(
          {
            type: 'info',
            title: 'Sauvegarde système',
            message: 'Sauvegarde automatique effectuée avec succès',
            icon: <Settings className="text-slate-600" size={16} />
          },
          {
            type: 'warning',
            title: 'Mise à jour requise',
            message: 'Nouvelle version disponible pour la plateforme',
            icon: <AlertTriangle className="text-yellow-600" size={16} />
          }
        );
        break;

      case 'chef_departement':
        const pendingForChef = requests.filter(r => r.department === user.department && r.status === 'submitted').length;
        if (pendingForChef > 0) {
          notifications.push({
            type: 'warning',
            title: 'Demandes en attente',
            message: `${pendingForChef} demande(s) à valider`,
            icon: <AlertTriangle className="text-yellow-600" size={16} />
          });
        }
        break;

      case 'direction':
        const pendingForDirection = requests.filter(r => r.status === 'chef_approved').length;
        if (pendingForDirection > 0) {
          notifications.push({
            type: 'warning',
            title: 'Validation requise',
            message: `${pendingForDirection} demande(s) approuvées par les chefs`,
            icon: <AlertTriangle className="text-yellow-600" size={16} />
          });
        }
        break;

      case 'recteur':
        const pendingForRecteur = requests.filter(r => r.status === 'direction_approved').length;
        if (pendingForRecteur > 0) {
          notifications.push({
            type: 'warning',
            title: 'Approbation finale',
            message: `${pendingForRecteur} demande(s) à approuver`,
            icon: <AlertTriangle className="text-yellow-600" size={16} />
          });
        }
        break;
    }

    // Add common notifications
    notifications.push(
      {
        type: 'success',
        title: 'Système opérationnel',
        message: 'Tous les services fonctionnent normalement',
        icon: <CheckCircle className="text-green-600" size={16} />
      }
    );

    return notifications;
  };

  const notifications = getNotificationsForRole();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          {headerIcon}
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900">{headerTitle}</h1>
            <p className="text-base text-blue-700 font-medium">{headerSubtitle}</p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <nav className="text-sm text-blue-800 font-semibold">
          {headerBreadcrumb}
        </nav>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card hover className="relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-gray-50">
                  {stat.icon}
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' :
                  stat.trend.startsWith('-') ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {stat.trend}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-lg font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.change}
                </p>
              </div>
              
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-slate-500`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.role === 'admin' ? 'Demandes Récentes' : 
               user?.role === 'agent' ? 'Mes Demandes Récentes' :
               user?.role === 'chef_departement' ? 'Demandes du Département' :
               'Demandes à Traiter'}
            </h2>
            <Badge variant="info" size="sm">
              {relevantRequests.length} total
            </Badge>
          </div>
          
          <div className="space-y-3">
            {relevantRequests.slice(0, 5).map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {request.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {request.agentName} • {formatCurrency(request.amount)}
                  </p>
                </div>
                <Badge variant={getStatusColor(request.status)} size="sm">
                  {getStatusText(request.status)}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            <Badge variant="warning" size="sm">
              {notifications.length} nouvelles
            </Badge>
          </div>
          
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {notification.icon}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};