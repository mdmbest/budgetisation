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
  BarChart3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBudgetRequests } from '../hooks/useBudgetRequests';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';

export const ValidationPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, getRequestsForRole, fetchRequests, updateRequestStatus } = useBudgetRequests();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isValidating, setIsValidating] = useState<string | null>(null);

  // Charger les demandes au montage du composant
  useEffect(() => {
    fetchRequests();
  }, []);
  
  // Remplacer la logique de getPendingRequests pour simplement :
  const pendingRequests = requests;

  const filteredRequests = pendingRequests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    if (status.includes('approved')) return 'success';
    if (status.includes('rejected')) return 'danger';
    if (status.includes('review')) return 'warning';
    return 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'submitted': 'Soumise',
      'chef_review': 'Validation Chef',
      'chef_approved': 'Approuvée Chef',
      'chef_rejected': 'Rejetée Chef',
      'direction_review': 'Validation Direction',
      'direction_approved': 'Approuvée Direction',
      'direction_rejected': 'Rejetée Direction',
      'recteur_review': 'Validation Recteur',
      'recteur_approved': 'Approuvée Recteur',
      'recteur_rejected': 'Rejetée Recteur'
    };
    return statusMap[status] || status;
  };

  const getRoleSpecificTitle = () => {
    switch (user?.role) {
      case 'chef_departement':
        return 'Validation Départementale';
      case 'direction':
        return 'Validation Directionnelle';
      case 'recteur':
        return 'Approbation Rectorale';
      default:
        return 'Validation des Demandes';
    }
  };

  const getRoleSpecificDescription = () => {
    switch (user?.role) {
      case 'chef_departement':
        return 'Validez les demandes de budget de votre département';
      case 'direction':
        return 'Approuvez les demandes validées par les chefs de département';
      case 'recteur':
        return 'Donnez votre approbation finale aux demandes de budget';
      default:
        return 'Gérez la validation des demandes de budget';
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir approuver cette demande ?')) {
      return;
    }

    setIsValidating(requestId);
    try {
      let newStatus: string;
      switch (user?.role) {
        case 'chef_departement':
          newStatus = 'chef_approved';
          break;
        case 'direction':
          newStatus = 'direction_approved';
          break;
        case 'recteur':
          newStatus = 'recteur_approved';
          break;
        default:
          throw new Error('Rôle non autorisé');
      }

      await updateRequestStatus(requestId, newStatus as any, 'Demande approuvée');
      alert('Demande approuvée avec succès !');
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
      let newStatus: string;
      switch (user?.role) {
        case 'chef_departement':
          newStatus = 'chef_rejected';
          break;
        case 'direction':
          newStatus = 'direction_rejected';
          break;
        case 'recteur':
          newStatus = 'recteur_rejected';
          break;
        default:
          throw new Error('Rôle non autorisé');
      }

      const comment = reason ? `Rejeté: ${reason}` : 'Demande rejetée';
      await updateRequestStatus(requestId, newStatus as any, comment);
      alert('Demande rejetée avec succès !');
    } catch (error: any) {
      alert(`Erreur lors du rejet: ${error.message}`);
    } finally {
      setIsValidating(null);
    }
  };

  const handleRefresh = () => {
    fetchRequests();
  };

  const stats = [
    {
      title: 'En Attente',
      value: pendingRequests.length.toString(),
      icon: <Clock className="text-yellow-600" size={20} />,
      color: 'yellow'
    },
    {
      title: 'Approuvées',
      value: requests.filter(r => r.status.includes('approved')).length.toString(),
      icon: <CheckCircle className="text-slate-600" size={20} />,
      color: 'slate'
    },
    {
      title: 'Rejetées',
      value: requests.filter(r => r.status.includes('rejected')).length.toString(),
      icon: <XCircle className="text-red-600" size={20} />,
      color: 'red'
    },
    {
      title: 'Montant Total',
      value: formatCurrency(pendingRequests.reduce((sum, r) => sum + r.amount, 0)),
      icon: <DollarSign className="text-blue-600" size={20} />,
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-xl p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <FileText className="text-blue-300" size={28} />
              {getRoleSpecificTitle()}
            </h1>
            <p className="text-blue-100 text-sm">
              {getRoleSpecificDescription()}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            icon={<RefreshCw size={16} />} 
            onClick={handleRefresh}
            className="text-blue-100 border-blue-300 hover:bg-blue-800"
          >
            Actualiser
          </Button>
        </motion.div>
      </div>

      {/* Header personnalisé direction */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-green-700" size={32} />
          <div>
            <h1 className="text-2xl font-extrabold text-green-900">Espace Direction</h1>
            <p className="text-base text-green-700 font-medium">Analysez, arbitrez et validez les budgets de tous les départements</p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <nav className="text-sm text-green-800 font-semibold">
          Direction
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

      {/* Filters */}
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="submitted">Soumises</option>
              <option value="chef_approved">Approuvées Chef</option>
              <option value="direction_approved">Approuvées Direction</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Debug Info */}
      {user?.role === 'chef_departement' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-sm text-yellow-800">
            <h3 className="font-semibold mb-2">Informations de débogage :</h3>
            <p>Rôle: {user.role}</p>
            <p>Département: {user.department}</p>
            <p>Total des demandes: {requests.length}</p>
            <p>Demandes du département: {getRequestsForRole(user.role, user.department, user.id).length}</p>
            <p>Demandes soumises: {pendingRequests.length}</p>
          </div>
        </Card>
      )}

      {/* Requests List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Demandes à Valider ({filteredRequests.length})
          </h2>
        </div>
        
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">
                Aucune demande en attente de validation
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

      {/* Toutes les demandes du département (pour les chefs) */}
      {user?.role === 'chef_departement' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Toutes les demandes du département ({getRequestsForRole(user.role, user.department, user.id).length})
            </h2>
          </div>
          
          <div className="space-y-4">
            {getRequestsForRole(user.role, user.department, user.id).length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Aucune demande dans ce département
                </p>
              </div>
            ) : (
              getRequestsForRole(user.role, user.department, user.id).map((request) => (
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
                      {request.status === 'submitted' && (
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
      )}
    </div>
  );
}; 