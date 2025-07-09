import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  UserPlus,
  Shield,
  Mail,
  Phone,
  Building,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { User, UserRole } from '../types';

export const UsersManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { users, createUser, updateUser, deleteUser, sendCredentials, isLoading, fetchUsers } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [newUserData, setNewUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'agent' as UserRole,
    department: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Ajout du state pour le formulaire d'édition
  const [editUserData, setEditUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'agent' as UserRole,
    department: '',
    isActive: true
  });

  // Remplir le formulaire d'édition quand editingUser change
  useEffect(() => {
    if (editingUser) {
      setEditUserData({
        email: editingUser.email,
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        role: editingUser.role,
        department: editingUser.department || '',
        isActive: editingUser.isActive
      });
    }
  }, [editingUser]);

  const handleEditUser = async () => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, editUserData);
      setEditingUser(null);
      fetchUsers();
      alert('Utilisateur modifié avec succès');
    } catch (error) {
      alert('Erreur lors de la modification de l\'utilisateur');
    }
  };

  const departments = [
    'Informatique',
    'Génie Civil',
    'Génie Mécanique',
    'Génie Électrique',
    'Mathématiques',
    'Physique',
    'Chimie',
    'Administration'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: UserRole) => {
    const colors = {
      'admin': 'danger',
      'recteur': 'warning',
      'direction': 'info',
      'chef_departement': 'success',
      'agent': 'default',
      'auditeur': 'info'
    };
    return colors[role] || 'default';
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      'admin': 'Super Admin',
      'recteur': 'Recteur',
      'direction': 'Direction',
      'chef_departement': 'Chef Département',
      'agent': 'Agent',
      'auditeur': 'Auditeur'
    };
    return labels[role] || role;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUserData({ ...newUserData, password, confirmPassword: password });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newUserData.email) newErrors.email = 'Email requis';
    if (!newUserData.firstName) newErrors.firstName = 'Prénom requis';
    if (!newUserData.lastName) newErrors.lastName = 'Nom requis';
    if (!newUserData.password) newErrors.password = 'Mot de passe requis';
    if (newUserData.password !== newUserData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if ((newUserData.role === 'agent' || newUserData.role === 'chef_departement') && !newUserData.department) {
      newErrors.department = 'Département requis pour ce rôle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    try {
      await createUser({
        email: newUserData.email,
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        role: newUserData.role,
        department: newUserData.department || undefined,
        password: newUserData.password,
        isActive: true
      });

      // Reset form
      setNewUserData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'agent',
        department: '',
        password: '',
        confirmPassword: ''
      });
      setShowCreateModal(false);
      alert('Utilisateur créé avec succès');
    } catch (error) {
      alert('Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleSendCredentials = async (userId: string, method: 'email' | 'sms') => {
    try {
      await sendCredentials(userId, method);
      alert(`Identifiants envoyés par ${method === 'email' ? 'email' : 'SMS'}`);
    } catch (error) {
      alert('Erreur lors de l\'envoi des identifiants');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUser(userId);
      alert('Utilisateur supprimé');
    }
  };

  const stats = [
    {
      title: 'Total Utilisateurs',
      value: users.length.toString(),
      icon: <Users className="text-blue-600" size={20} />,
      color: 'blue'
    },
    {
      title: 'Actifs',
      value: users.filter(u => u.isActive).length.toString(),
      icon: <Shield className="text-green-600" size={20} />,
      color: 'green'
    },
    {
      title: 'Agents',
      value: users.filter(u => u.role === 'agent').length.toString(),
      icon: <UserPlus className="text-purple-600" size={20} />,
      color: 'purple'
    },
    {
      title: 'Administrateurs',
      value: users.filter(u => u.role === 'admin').length.toString(),
      icon: <Shield className="text-red-600" size={20} />,
      color: 'red'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-sm text-gray-600">
            Créez et gérez les comptes utilisateurs de la plateforme
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setShowCreateModal(true)}>
          Nouvel Utilisateur
        </Button>
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
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${stat.color}-500`} />
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
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Super Admin</option>
              <option value="recteur">Recteur</option>
              <option value="direction">Direction</option>
              <option value="chef_departement">Chef Département</option>
              <option value="agent">Agent</option>
              <option value="auditeur">Auditeur</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <Card>
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Utilisateur</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rôle</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Département</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {u.firstName[0]}{u.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={getRoleColor(u.role)}>
                      {getRoleLabel(u.role)}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{u.department || '-'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={u.isActive ? 'success' : 'danger'}>
                      {u.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Mail size={16} />}
                        onClick={() => handleSendCredentials(u.id, 'email')}
                      >
                        Email
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Edit size={16} />}
                        onClick={() => setEditingUser(u)}
                      >
                        Modifier
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Créer un Nouvel Utilisateur</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={newUserData.firstName}
                    onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={newUserData.lastName}
                    onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle *
                  </label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="agent">Agent</option>
                    <option value="chef_departement">Chef Département</option>
                    <option value="direction">Direction</option>
                    <option value="recteur">Recteur</option>
                    <option value="auditeur">Auditeur</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>

                {(newUserData.role === 'agent' || newUserData.role === 'chef_departement') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Département *
                    </label>
                    <select
                      value={newUserData.department}
                      onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.department ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionner un département</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe *
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generatePassword}
                  >
                    Générer
                  </Button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  value={newUserData.confirmPassword}
                  onChange={(e) => setNewUserData({ ...newUserData, confirmPassword: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleCreateUser} isLoading={isLoading}>
                Créer l'utilisateur
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Modifier l'utilisateur</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={editUserData.firstName}
                    onChange={(e) => setEditUserData({ ...editUserData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={editUserData.lastName}
                    onChange={(e) => setEditUserData({ ...editUserData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle *
                  </label>
                  <select
                    value={editUserData.role}
                    onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="agent">Agent</option>
                    <option value="chef_departement">Chef Département</option>
                    <option value="direction">Direction</option>
                    <option value="recteur">Recteur</option>
                    <option value="auditeur">Auditeur</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>
                {(editUserData.role === 'agent' || editUserData.role === 'chef_departement') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Département *
                    </label>
                    <select
                      value={editUserData.department}
                      onChange={(e) => setEditUserData({ ...editUserData, department: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un département</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={editUserData.isActive ? 'active' : 'inactive'}
                  onChange={e => setEditUserData({ ...editUserData, isActive: e.target.value === 'active' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleEditUser} isLoading={isLoading}>
                Enregistrer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};