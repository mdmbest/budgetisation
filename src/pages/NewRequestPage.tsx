import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Send, 
  Upload, 
  X, 
  AlertCircle,
  DollarSign,
  FileText,
  Building,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBudgetRequests } from '../hooks/useBudgetRequests';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatters';

interface RequestItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const categories = [
  'Équipement',
  'Fournitures',
  'Services',
  'Formation',
  'Maintenance',
  'Logiciels',
  'Mobilier',
  'Autres'
];

const urgencyLevels = [
  { value: 'low', label: 'Faible' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Élevée' },
  { value: 'critical', label: 'Critique' }
];

export const NewRequestPage: React.FC = () => {
  const { user, getTokenInfo } = useAuth();
  const { addRequest } = useBudgetRequests();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    justification: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  });
  const [items, setItems] = useState<RequestItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
  ]);

  useEffect(() => {
    if (!user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      window.location.href = '/login';
    }
  }, [user]);

  const addItem = () => {
    const newId = (items.length + 1).toString();
    setItems([...items, { id: newId, description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  };

  const removeItem = (itemId: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  const updateItem = (itemId: string, field: keyof RequestItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.justification.trim()) newErrors.justification = 'La justification est requise';

    // Vérifier les articles
    const validItems = items.filter(item => 
      item.description.trim() && item.quantity > 0 && item.unitPrice > 0
    );
    if (validItems.length === 0) {
      newErrors.items = 'Au moins un article valide est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft && !validateForm()) return;
    if (!user) return;

    setIsSubmitting(true);

    try {
      const validItems = items.filter(item => 
        item.description.trim() && item.quantity > 0 && item.unitPrice > 0
      );

      await addRequest({
        agentId: user.id,
        agentName: `${user.firstName} ${user.lastName}`,
        department: user.department || '',
        category: formData.category,
        title: formData.title,
        description: formData.description,
        amount: getTotalAmount(),
        justification: formData.justification,
        urgency: formData.urgency,
        status: isDraft ? 'draft' : 'submitted',
        items: validItems
      });

      // Reset form
      setFormData({
        category: '',
        title: '',
        description: '',
        justification: '',
        urgency: 'medium',
      });
      setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);

      alert(isDraft ? 'Demande sauvegardée en brouillon' : 'Demande soumise avec succès');
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDebugToken = () => {
    getTokenInfo();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <FileText className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle Demande Budgétaire</h1>
          <p className="text-gray-600">
            Créez une nouvelle demande pour votre département
          </p>
        </div>
        <Button onClick={handleDebugToken} variant="outline" size="sm">
          Debug Token
        </Button>
      </div>

      {/* User Info */}
      <Card>
        <div className="flex items-center gap-4">
          <Building className="text-blue-600" size={24} />
          <div>
            <h3 className="font-semibold text-gray-900">Informations du demandeur</h3>
            <p className="text-gray-600">
              {user?.firstName} {user?.lastName} - Département {user?.department}
            </p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <form className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'urgence *
              </label>
              <div className="flex gap-2">
                {urgencyLevels.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: level.value as any })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.urgency === level.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la demande *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Achat d'ordinateurs portables pour le laboratoire"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description détaillée *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Décrivez en détail votre demande..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </Card>

        {/* Items Details */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Détail des articles</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem} icon={<Plus size={16} />}>
              Ajouter un article
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Article {index + 1}</span>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      icon={<Minus size={16} />}
                    >
                      Supprimer
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Description de l'article"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix unitaire (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-3 text-right">
                  <span className="text-sm text-gray-600">Total: </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {errors.items && (
            <p className="mt-2 text-sm text-red-600">{errors.items}</p>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Montant total de la demande:</span>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(getTotalAmount())}
              </span>
            </div>
          </div>
        </Card>

        {/* Justification */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Justification</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Justification de la demande *
            </label>
            <textarea
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              rows={4}
              placeholder="Expliquez pourquoi cette demande est nécessaire..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.justification ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.justification && (
              <p className="mt-1 text-sm text-red-600">{errors.justification}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pièces justificatives (optionnel)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-600">
                Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, XLS - Max 10MB par fichier
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle size={16} />
              <span>Les champs marqués d'un * sont obligatoires</span>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit(true)}
                isLoading={isSubmitting}
                icon={<Save size={18} />}
              >
                Sauvegarder en brouillon
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => handleSubmit(false)}
                isLoading={isSubmitting}
                icon={<Send size={18} />}
              >
                Soumettre la demande
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};