import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, 
  Users, 
  FileText, 
  Settings, 
  Shield, 
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Home
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';

interface DocumentationPageProps {
  onBackToHome: () => void;
}

export const DocumentationPage: React.FC<DocumentationPageProps> = ({ onBackToHome }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Démarrage Rapide',
      icon: <Home size={20} />,
      content: [
        {
          title: 'Première Connexion',
          content: `Pour accéder à la plateforme ESP Budget, utilisez les identifiants fournis par votre administrateur système. 
          
          Comptes de démonstration disponibles :
          • Administrateur : admin@esp.sn / password123
          • Agent : agent@esp.sn / password123  
          • Chef Département : chef@esp.sn / password123
          • Direction : direction@esp.sn / password123
          • Recteur : recteur@esp.sn / password123
          
          ⚠️ IMPORTANT : Changez ces mots de passe après votre première connexion pour des raisons de sécurité !`
        },
        {
          title: 'Navigation',
          content: `La plateforme s'adapte automatiquement selon votre rôle. Le menu de gauche affiche uniquement les fonctionnalités auxquelles vous avez accès.
          
          • Cliquez sur le logo ESP Budget pour retourner à l'accueil
          • Utilisez le bouton menu (☰) sur mobile pour ouvrir la navigation
          • Les notifications apparaissent en temps réel dans l'en-tête`
        }
      ]
    },
    {
      id: 'roles',
      title: 'Rôles et Permissions',
      icon: <Users size={20} />,
      content: [
        {
          title: 'Agent',
          content: `Fonctionnalités disponibles :
          • Créer et soumettre des demandes budgétaires
          • Consulter l'historique de ses demandes
          • Suivre le statut de validation
          • Modifier les demandes en brouillon ou rejetées`
        },
        {
          title: 'Chef de Département',
          content: `Fonctionnalités disponibles :
          • Valider/rejeter les demandes de son département
          • Consolider le budget départemental
          • Gérer son équipe
          • Ajouter des commentaires aux demandes`
        },
        {
          title: 'Direction',
          content: `Fonctionnalités disponibles :
          • Arbitrage centralisé des budgets
          • Vue globale de tous les départements
          • Génération de rapports consolidés
          • Validation finale avant transmission au Recteur`
        },
        {
          title: 'Recteur',
          content: `Fonctionnalités disponibles :
          • Approbation finale des budgets
          • Signature électronique
          • Vue d'ensemble de l'institution
          • Génération d'arrêtés rectoraux`
        },

        {
          title: 'Super Administrateur',
          content: `Fonctionnalités disponibles :
          • Gestion des utilisateurs et rôles
          • Configuration système
          • Sauvegarde et maintenance
          • Journalisation et sécurité`
        }
      ]
    },
    {
      id: 'workflow',
      title: 'Processus Budgétaire',
      icon: <FileText size={20} />,
      content: [
        {
          title: 'Étape 1 : Saisie des Besoins',
          content: `L'agent saisit ses besoins budgétaires :
          • Catégorie et description détaillée
          • Montant et justification
          • Niveau d'urgence
          • Compte comptable OHADA
          • Pièces justificatives (optionnel)`
        },
        {
          title: 'Étape 2 : Validation Départementale',
          content: `Le Chef de Département :
          • Examine toutes les demandes de son département
          • Valide, rejette ou demande des modifications
          • Priorise les demandes selon les besoins
          • Consolide le budget départemental`
        },
        {
          title: 'Étape 3 : Arbitrage Direction',
          content: `La Direction :
          • Agrège tous les budgets départementaux
          • Effectue l'arbitrage global
          • Équilibre recettes et dépenses
          • Prépare le budget consolidé`
        },
        {
          title: 'Étape 4 : Approbation Rectorale',
          content: `Le Recteur :
          • Examine le budget global
          • Effectue les derniers arbitrages
          • Approuve et signe électroniquement
          • Génère l'arrêté rectoral`
        }
      ]
    },
    {
      id: 'features',
      title: 'Fonctionnalités Avancées',
      icon: <Settings size={20} />,
      content: [
        {
          title: 'Suivi Temps Réel',
          content: `• Tableaux de bord dynamiques par rôle
          • Statistiques et indicateurs clés
          • Alertes automatiques
          • Notifications en temps réel`
        },
        {
          title: 'Conformité OHADA',
          content: `• Comptes comptables prédéfinis
          • Génération automatique de documents
          • Respect des normes comptables
          • Traçabilité complète`
        },
        {
          title: 'Sécurité',
          content: `• Authentification sécurisée
          • Gestion granulaire des permissions
          • Journalisation de toutes les actions
          • Signature électronique`
        }
      ]
    },
    {
      id: 'security',
      title: 'Sécurité et Conformité',
      icon: <Shield size={20} />,
      content: [
        {
          title: 'Protection des Données',
          content: `• Chiffrement des données sensibles
          • Sauvegarde automatique régulière
          • Archivage sécurisé sur 10 ans
          • Conformité RGPD`
        },
        {
          title: 'Audit et Traçabilité',
          content: `• Journalisation horodatée de toutes les actions
          • Historique complet des modifications
          • Rapports d'audit automatisés
          • Interface dédiée aux auditeurs`
        }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Book className="text-white" size={18} />
              </div>
              <div>
                <h1 className="font-bold text-base text-gray-900">Documentation ESP Budget</h1>
                <p className="text-xs text-gray-500">Guide d'utilisation complet</p>
              </div>
            </div>
            
            <Button onClick={onBackToHome} variant="outline">
              <Home size={14} />
              Retour à l'accueil
            </Button>
          </div>
               </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Table des Matières</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      expandedSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium text-sm">{section.title}</span>
                    {expandedSection === section.id ? (
                      <ChevronDown size={16} className="ml-auto" />
                    ) : (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={expandedSection === section.id ? 'block' : 'hidden'}
              >
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                  </div>

                  <div className="space-y-6">
                    {section.content.map((item, index) => (
                      <div key={index}>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <div className="prose prose-gray max-w-none">
                          {item.content.split('\n').map((paragraph, pIndex) => (
                            <p key={pIndex} className="text-gray-600 leading-relaxed mb-3">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Quick Start Guide */}
            {expandedSection === null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <div className="text-center py-12">
                    <Logo size="lg" variant="full" className="justify-center mb-6" />
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      Bienvenue dans la Documentation ESP Budget
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Cette documentation vous guide dans l'utilisation de la plateforme de gestion budgétaire 
                      de l'École Supérieure Polytechnique. Sélectionnez une section dans le menu de gauche pour commencer.
                    </p>
                    <Button 
                      onClick={() => setExpandedSection('getting-started')}
                      variant="primary"
                    >
                      Commencer par le Guide de Démarrage
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};