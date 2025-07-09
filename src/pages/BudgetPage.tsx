import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  BarChart3,
  Calendar,
  Building,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBudgetRequests } from '../hooks/useBudgetRequests';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatters';

export const BudgetPage: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return null;
  const { requests, getRequestsForRole, fetchRequests } = useBudgetRequests();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  // Charger les demandes au montage du composant
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const relevantRequests = getRequestsForRole(user?.role || '', user?.department, user?.id);
  
  // Calculer les statistiques budgétaires selon le rôle
  const totalBudget = relevantRequests.reduce((sum, r) => sum + r.amount, 0);
  const approvedBudget = relevantRequests
    .filter(r => r.status.includes('approved'))
    .reduce((sum, r) => sum + r.amount, 0);
  const pendingBudget = relevantRequests
    .filter(r => r.status.includes('review'))
    .reduce((sum, r) => sum + r.amount, 0);
  const rejectedBudget = relevantRequests
    .filter(r => r.status.includes('rejected'))
    .reduce((sum, r) => sum + r.amount, 0);

  // Statistiques par département (selon le rôle)
  const departmentStats = relevantRequests.reduce((acc, request) => {
    if (!acc[request.department]) {
      acc[request.department] = {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        count: 0
      };
    }
    acc[request.department].total += request.amount;
    acc[request.department].count += 1;
    
    if (request.status.includes('approved')) {
      acc[request.department].approved += request.amount;
    } else if (request.status.includes('rejected')) {
      acc[request.department].rejected += request.amount;
    } else {
      acc[request.department].pending += request.amount;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const budgetStats = [
    {
      title: 'Budget Total',
      value: formatCurrency(totalBudget),
      icon: <DollarSign className="text-green-600" size={24} />,
      change: '+12% vs 2023',
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Budget Approuvé',
      value: formatCurrency(approvedBudget),
      icon: <CheckCircle className="text-blue-600" size={24} />,
      change: `${Math.round((approvedBudget / totalBudget) * 100)}% du total`,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'En Attente',
      value: formatCurrency(pendingBudget),
      icon: <Clock className="text-yellow-600" size={24} />,
      change: `${Math.round((pendingBudget / totalBudget) * 100)}% du total`,
      color: 'yellow',
      trend: 'neutral'
    },
    {
      title: 'Budget Rejeté',
      value: formatCurrency(rejectedBudget),
      icon: <AlertTriangle className="text-red-600" size={24} />,
      change: `${Math.round((rejectedBudget / totalBudget) * 100)}% du total`,
      color: 'red',
      trend: 'down'
    }
  ];

  const getRoleSpecificTitle = () => {
    switch (user?.role) {
      case 'admin':
        return 'Budget Global ESP';
      case 'direction':
        return 'Budget Directionnel';
      case 'recteur':
        return 'Budget Rectoral';
      case 'chef_departement':
        return `Budget Département ${user.department}`;
      default:
        return 'Budget Global';
    }
  };

  const getRoleSpecificDescription = () => {
    switch (user?.role) {
      case 'admin':
        return 'Vue d\'ensemble du budget global de l\'ESP';
      case 'direction':
        return 'Gestion budgétaire directionnelle';
      case 'recteur':
        return 'Approbation budgétaire rectorale';
      case 'chef_departement':
        return `Budget du département ${user.department}`;
      default:
        return 'Gestion du budget global';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <DollarSign className="text-green-300" size={28} />
            {getRoleSpecificTitle()}
          </h1>
          <p className="text-green-100 text-sm">
            {getRoleSpecificDescription()}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-green-300" size={16} />
              <span className="text-sm">Exercice {selectedPeriod}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="text-green-300" size={16} />
              <span className="text-sm">8 Départements</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {budgetStats.map((stat, index) => (
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
                  stat.trend === 'up' ? 'bg-green-100 text-green-700' :
                  stat.trend === 'down' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> :
                   stat.trend === 'down' ? <TrendingDown size={12} /> :
                   <TrendingUp size={12} />}
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
              
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${stat.color}-500`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Budget by Department */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building className="text-blue-600" size={20} />
              Budget par Département
            </h2>
            <Badge variant="info" size="sm">
              {Object.keys(departmentStats).length} départements
            </Badge>
          </div>
          
          <div className="space-y-4">
            {Object.entries(departmentStats).map(([dept, stats]) => (
              <motion.div
                key={dept}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{dept}</h3>
                  <Badge variant="info" size="sm">
                    {stats.count} demandes
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(stats.total)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Approuvé</p>
                    <p className="font-semibold text-green-600">{formatCurrency(stats.approved)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">En attente</p>
                    <p className="font-semibold text-yellow-600">{formatCurrency(stats.pending)}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(stats.approved / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((stats.approved / stats.total) * 100)}% approuvé
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Budget Timeline */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="text-purple-600" size={20} />
              Évolution Budgétaire
            </h2>
            <Badge variant="success" size="sm">
              +15% vs 2023
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Janvier 2024</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(1500000)}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Février 2024</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(2200000)}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Mars 2024</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(1800000)}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Avril 2024</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(2500000)}</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Tendances</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-600" size={16} />
                <span>Croissance constante du budget (+12% mensuel)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-blue-600" size={16} />
                <span>Taux d'approbation élevé (85%)</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-yellow-600" size={16} />
                <span>15% des demandes en attente de validation</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-orange-600" size={20} />
            Actions Budgétaires
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <BarChart3 className="text-blue-600 mx-auto mb-2" size={20} />
            <p className="text-xs font-medium text-gray-900">Générer Rapport</p>
          </button>
          
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <PieChart className="text-green-600 mx-auto mb-2" size={20} />
            <p className="text-xs font-medium text-gray-900">Analyses</p>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <Calendar className="text-purple-600 mx-auto mb-2" size={20} />
            <p className="text-xs font-medium text-gray-900">Planification</p>
          </button>
          
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
            <FileText className="text-orange-600 mx-auto mb-2" size={20} />
            <p className="text-xs font-medium text-gray-900">Exporter</p>
          </button>
        </div>
      </Card>
    </div>
  );
}; 