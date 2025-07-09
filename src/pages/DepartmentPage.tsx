import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBudgetRequests } from '../hooks/useBudgetRequests';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatDateShort } from '../utils/formatters';
import { BudgetRequest } from '../types';

export const DepartmentPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, updateRequestStatus, fetchRequests } = useBudgetRequests();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [viewedRequest, setViewedRequest] = useState<BudgetRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const departmentRequests = requests;
  const pendingRequests = departmentRequests.filter(r => r.status === 'submitted' || r.status === 'chef_review');

  const stats = [
    {
      title: 'Demandes Totales',
      value: departmentRequests.length.toString(),
      icon: <FileText className="text-blue-600" size={24} />,
      change: '+3 ce mois',
      color: 'blue'
    },
    {
      title: 'En Attente',
      value: pendingRequests.length.toString(),
      icon: <Clock className="text-yellow-600" size={24} />,
      change: 'À traiter',
      color: 'yellow'
    },
    {
      title: 'Approuvées',
      value: departmentRequests.filter(r => r.status.includes('approved')).length.toString(),
      icon: <CheckCircle className="text-green-600" size={24} />,
      change: 'Ce trimestre',
      color: 'green'
    },
    {
      title: 'Budget Demandé',
      value: formatCurrency(departmentRequests.reduce((sum, r) => sum + r.amount, 0)),
      icon: <DollarSign className="text-purple-600" size={24} />,
      change: 'Total',
      color: 'purple'
    }
  ];

  const handleRequestAction = (requestId: string, action: 'approve' | 'reject', comment?: string) => {
    const status = action === 'approve' ? 'chef_approved' : 'chef_rejected';
    updateRequestStatus(requestId, status, comment);
  };

  // Handler pour voir une demande
  const handleView = (request: BudgetRequest) => {
    setViewedRequest(request);
  };

  // Handler pour approuver/rejeter avec confirmation et rafraîchissement
  const handleRequestActionWithConfirm = async (requestId: string, action: 'approve' | 'reject', comment?: string) => {
    const actionLabel = action === 'approve' ? 'approuver' : 'rejeter';
    if (!window.confirm(`Voulez-vous vraiment ${actionLabel} cette demande ?`)) return;
    setIsProcessing(true);
    try {
      await handleRequestAction(requestId, action, comment);
      await fetchRequests();
      alert(`Demande ${actionLabel} avec succès !`);
    } catch (e) {
      alert('Erreur lors du traitement de la demande.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('approved')) return 'success';
    if (status.includes('rejected')) return 'danger';
    if (status.includes('review')) return 'warning';
    return 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'submitted': 'Nouvelle demande',
      'chef_review': 'En cours d\'examen',
      'chef_approved': 'Approuvée',
      'chef_rejected': 'Rejetée',
      'direction_review': 'Transmise à la Direction',
      'direction_approved': 'Approuvée par la Direction',
      'recteur_review': 'En validation Rectorale'
    };
    return statusMap[status] || status;
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <TrendingUp size={18} /> },
    { id: 'requests', label: 'Demandes à traiter', icon: <FileText size={18} /> },
    { id: 'team', label: 'Équipe', icon: <Users size={18} /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header personnalisé chef de département */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <Users className="text-blue-700" size={32} />
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900">Espace Chef de Département</h1>
            <p className="text-base text-blue-700 font-medium">Validez et supervisez les demandes de votre département</p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <nav className="text-sm text-blue-800 font-semibold">
          Département
        </nav>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card hover className="relative overflow-hidden min-h-[140px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-gray-50">
                  {stat.icon}
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${stat.color}-500`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === 'requests' && pendingRequests.length > 0 && (
                  <Badge variant="warning" size="sm">
                    {pendingRequests.length}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Activité Récente
                  </h3>
                  <div className="space-y-3">
                    {departmentRequests.slice(0, 5).map((request) => (
                      <div key={request.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="text-blue-600" size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {request.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {request.agentName} • {formatDateShort(request.createdAt)}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(request.status)} size="sm">
                          {getStatusText(request.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Résumé Budgétaire
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Budget demandé</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(departmentRequests.reduce((sum, r) => sum + r.amount, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Approuvé</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(departmentRequests.filter(r => r.status.includes('approved')).reduce((sum, r) => sum + r.amount, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">En attente</span>
                      <span className="font-semibold text-yellow-600">
                        {formatCurrency(pendingRequests.reduce((sum, r) => sum + r.amount, 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Demandes à Traiter ({pendingRequests.length})
                </h3>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Toutes les demandes sont traitées
                  </h3>
                  <p className="text-gray-600">
                    Aucune demande en attente de validation.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <Card key={request.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {request.title}
                          </h4>
                          <p className="text-gray-600 mb-3">
                            {request.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>Demandeur: {request.agentName}</span>
                            <span>Montant: {formatCurrency(request.amount)}</span>
                            <span>Catégorie: {request.category}</span>
                            <span>Urgence: {request.urgency}</span>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Créée le {formatDateShort(request.createdAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" icon={<Eye size={16} />} onClick={() => handleView(request)}>
                              Détails
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              icon={<X size={16} />}
                              onClick={() => handleRequestActionWithConfirm(request.id, 'reject', 'Demande rejetée par le chef de département')}
                              disabled={isProcessing}
                            >
                              Rejeter
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              icon={<Check size={16} />}
                              onClick={() => handleRequestActionWithConfirm(request.id, 'approve', 'Demande approuvée par le chef de département')}
                              disabled={isProcessing}
                            >
                              Approuver
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'team' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Équipe du Département {user?.department}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mock team members */}
                {[
                  { name: 'Amadou Diallo', role: 'Enseignant-Chercheur', requests: 3 },
                  { name: 'Fatou Sall', role: 'Maître de Conférences', requests: 2 },
                  { name: 'Ousmane Ba', role: 'Assistant', requests: 1 },
                  { name: 'Aïcha Ndiaye', role: 'Technicien', requests: 2 },
                  { name: 'Moussa Diop', role: 'Administratif', requests: 1 }
                ].map((member, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-xs text-blue-600">{member.requests} demande(s)</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de visualisation */}
      {viewedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Détail de la demande</h3>
              <button onClick={() => setViewedRequest(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              <div><b>Titre :</b> {viewedRequest.title}</div>
              <div><b>Description :</b> {viewedRequest.description}</div>
              <div><b>Montant :</b> {formatCurrency(viewedRequest.amount)}</div>
              <div><b>Statut :</b> {getStatusText(viewedRequest.status)}</div>
              <div><b>Urgence :</b> {viewedRequest.urgency}</div>
              <div><b>Demandeur :</b> {viewedRequest.agentName}</div>
              <div><b>Département :</b> {viewedRequest.department}</div>
              <div><b>Catégorie :</b> {viewedRequest.category}</div>
              <div><b>Code :</b> {viewedRequest.accountCode}</div>
              <div><b>Créée le :</b> {formatDateShort(viewedRequest.createdAt)}</div>
              <div><b>Dernière mise à jour :</b> {formatDateShort(viewedRequest.updatedAt)}</div>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setViewedRequest(null)}>
                Fermer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};