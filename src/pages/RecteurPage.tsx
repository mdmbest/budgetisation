import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  DollarSign,
  Filter,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  RefreshCw,
  Building,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBudgetRequests } from '../hooks/useBudgetRequests';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';

export const RecteurPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, fetchRequests, updateRequestStatus } = useBudgetRequests();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isValidating, setIsValidating] = useState<string | null>(null);

  // Charger les demandes au montage du composant
  useEffect(() => {
    fetchRequests();
  }, []);

  // Obtenir les demandes pour le recteur (approuvées par la direction)
  const recteurRequests = requests;

  // Grouper les demandes par département
  const requestsByDepartment = recteurRequests.reduce((acc, request) => {
    const dept = request.department;
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(request);
    return acc;
  }, {} as Record<string, typeof recteurRequests>);

  // Filtrer les demandes selon le département sélectionné
  const getFilteredRequests = () => {
    if (selectedDepartment === 'all') {
      return recteurRequests.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.agentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const deptRequests = requestsByDepartment[selectedDepartment] || [];
    return deptRequests.filter(r => 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.agentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredRequests = getFilteredRequests();

  const getStatusColor = (status: string) => {
    if (status.includes('approved')) return 'success';
    if (status.includes('rejected')) return 'danger';
    if (status.includes('review')) return 'warning';
    if (status.includes('submitted')) return 'warning';
    return 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'direction_approved': 'Approuvée Direction',
      'recteur_approved': 'Approuvée Recteur',
      'recteur_rejected': 'Rejetée Recteur'
    };
    return statusMap[status] || status;
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir approuver cette demande ?')) {
      return;
    }

    setIsValidating(requestId);
    try {
      await updateRequestStatus(requestId, 'recteur_approved', 'Approuvée par le recteur');
      alert('Demande approuvée avec succès !');
      fetchRequests(); // Rafraîchir la liste après l'approbation
    } catch (error: any) {
      alert(`Erreur lors de l'approbation: ${error.message}`);
    } finally {
      setIsValidating(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const reason = prompt('Raison du rejet (optionnel):');
    if (reason === null) return; // Utilisateur a annulé

    setIsValidating(requestId);
    try {
      const comment = reason ? `Rejeté par le recteur: ${reason}` : 'Rejeté par le recteur';
      await updateRequestStatus(requestId, 'recteur_rejected', comment);
      alert('Demande rejetée avec succès !');
      fetchRequests(); // Rafraîchir la liste après le rejet
    } catch (error: any) {
      alert(`Erreur lors du rejet: ${error.message}`);
    } finally {
      setIsValidating(null);
    }
  };

  const handleRefresh = () => {
    fetchRequests();
  };

  // Calculer les statistiques par département
  const getDepartmentStats = () => {
    const stats: Record<string, { count: number; totalAmount: number }> = {};
    
    Object.entries(requestsByDepartment).forEach(([dept, requests]) => {
      stats[dept] = {
        count: requests.length,
        totalAmount: requests.reduce((sum, r) => sum + r.amount, 0)
      };
    });
    
    return stats;
  };

  const departmentStats = getDepartmentStats();

  const stats = [
    {
      title: 'Demandes à Approuver',
      value: recteurRequests.length.toString(),
      icon: <FileText className="text-slate-600" size={20} />,
      color: 'slate'
    },
    {
      title: 'Départements Concernés',
      value: Object.keys(requestsByDepartment).length.toString(),
      icon: <Building className="text-slate-600" size={20} />,
      color: 'slate'
    },
    {
      title: 'Montant Total',
      value: formatCurrency(recteurRequests.reduce((sum, r) => sum + r.amount, 0)),
      icon: <DollarSign className="text-slate-600" size={20} />,
      color: 'slate'
    },
    {
      title: 'Moyenne par Demande',
      value: recteurRequests.length > 0 
        ? formatCurrency(recteurRequests.reduce((sum, r) => sum + r.amount, 0) / recteurRequests.length)
        : '0 €',
      icon: <TrendingUp className="text-slate-600" size={20} />,
      color: 'slate'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header personnalisé recteur */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <Shield className="text-purple-700" size={32} />
          <div>
            <h1 className="text-2xl font-extrabold text-purple-900">Espace Recteur</h1>
            <p className="text-base text-purple-700 font-medium">Approuvez les budgets consolidés et signez les validations finales</p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <nav className="text-sm text-purple-800 font-semibold">
          Recteur
        </nav>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card hover className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-gray-50">
                  {stat.icon}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-500" />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filtres */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher une demande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building size={18} className="text-gray-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="all">Tous les départements</option>
              {Object.keys(requestsByDepartment).map(dept => (
                <option key={dept} value={dept}>
                  {dept} ({requestsByDepartment[dept].length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Statistiques par département */}
      {Object.keys(requestsByDepartment).length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Vue d'ensemble par département
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(departmentStats).map(([dept, stats]) => (
              <div key={dept} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{dept}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Demandes:</span>
                    <span className="font-medium">{stats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Montant total:</span>
                    <span className="font-medium">{formatCurrency(stats.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moyenne:</span>
                    <span className="font-medium">
                      {stats.count > 0 ? formatCurrency(stats.totalAmount / stats.count) : '0 €'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Toutes les demandes disponibles pour le recteur */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Toutes les demandes disponibles ({requests.length})
          </h2>
        </div>
        
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">
                Aucune demande disponible pour le recteur
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.title}
                      </h3>
                      <Badge variant={getStatusColor(request.status)} size="sm">
                        {getStatusText(request.status)}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {request.department}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      {request.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Demandeur:</span>
                        <p className="text-gray-600">{request.agentName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Département:</span>
                        <p className="text-gray-600">{request.department}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Montant:</span>
                        <p className="text-gray-600">{formatCurrency(request.amount)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Urgence:</span>
                        <Badge 
                          variant={request.urgency === 'high' || request.urgency === 'critical' ? 'danger' : 'warning'} 
                          size="sm"
                        >
                          {request.urgency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="ghost" size="sm" icon={<Eye size={16} />}>
                      Voir détails
                    </Button>
                    <Button variant="ghost" size="sm" icon={<MessageSquare size={16} />}>
                      Commenter
                    </Button>
                    {request.status === 'direction_approved' && (
                      <>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          icon={<ThumbsUp size={16} />}
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={isValidating === request.id}
                        >
                          {isValidating === request.id ? 'Validation...' : 'Approuver'}
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          icon={<ThumbsDown size={16} />}
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={isValidating === request.id}
                        >
                          {isValidating === request.id ? 'Validation...' : 'Rejeter'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Liste des demandes à approuver */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Demandes à Approuver ({filteredRequests.length})
          </h2>
        </div>
        
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">
                Aucune demande en attente d'approbation rectorale
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.title}
                      </h3>
                      <Badge variant={getStatusColor(request.status)} size="sm">
                        {getStatusText(request.status)}
                      </Badge>
                                             <Badge variant="default" size="sm">
                         {request.department}
                       </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      {request.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Demandeur:</span>
                        <p className="text-gray-600">{request.agentName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Département:</span>
                        <p className="text-gray-600">{request.department}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Montant:</span>
                        <p className="text-gray-600">{formatCurrency(request.amount)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Urgence:</span>
                        <Badge 
                          variant={request.urgency === 'high' || request.urgency === 'critical' ? 'danger' : 'warning'} 
                          size="sm"
                        >
                          {request.urgency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="ghost" size="sm" icon={<Eye size={16} />}>
                      Voir détails
                    </Button>
                    <Button variant="ghost" size="sm" icon={<MessageSquare size={16} />}>
                      Commenter
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      icon={<ThumbsUp size={16} />}
                      onClick={() => handleApproveRequest(request.id)}
                      disabled={isValidating === request.id}
                    >
                      {isValidating === request.id ? 'Validation...' : 'Approuver'}
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      icon={<ThumbsDown size={16} />}
                      onClick={() => handleRejectRequest(request.id)}
                      disabled={isValidating === request.id}
                    >
                      {isValidating === request.id ? 'Validation...' : 'Rejeter'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}; 