import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Clock,
  FileText,
  Book,
  Building,
  Star,
  Award,
  Zap
} from 'lucide-react';
import { TypewriterText } from '../components/home/TypewriterText';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';

interface HomePageProps {
  onLogin: () => void;
  onDocumentation: () => void;
}

const features = [
  {
    icon: <FileText className="text-slate-600" size={24} />,
    title: 'Saisie des Besoins',
    description: 'Interface intuitive pour les agents permettant de saisir leurs besoins budgétaires avec justifications et pièces jointes.'
  },
  {
    icon: <Users className="text-slate-600" size={24} />,
    title: 'Workflow de Validation',
    description: 'Circuit de validation automatisé : Agent → Chef Département → Direction → Recteur avec traçabilité complète.'
  },
  {
    icon: <BarChart3 className="text-slate-600" size={24} />,
    title: 'Suivi Temps Réel',
    description: 'Tableaux de bord analytiques avec suivi des budgets, alertes de dépassement et rapports détaillés.'
  },
  {
    icon: <Shield className="text-slate-600" size={24} />,
    title: 'Sécurité Renforcée',
    description: 'Authentification multi-rôles, signature électronique, et journalisation complète de toutes les opérations.'
  }
];

const stats = [
  { label: 'Départements', value: '8+', icon: <Building size={20} />, color: 'slate' },
  { label: 'Utilisateurs', value: '200+', icon: <Users size={20} />, color: 'slate' },
  { label: 'Demandes/An', value: '1000+', icon: <FileText size={20} />, color: 'slate' },
  { label: 'Conformité', value: '100%', icon: <CheckCircle size={20} />, color: 'slate' }
];

const benefits = [
  {
    icon: <Zap className="text-slate-500" size={24} />,
    title: 'Efficacité Maximale',
    description: 'Réduction de 80% du temps de traitement des demandes budgétaires'
  },
  {
    icon: <Shield className="text-slate-500" size={24} />,
    title: 'Conformité Totale',
    description: 'Respect intégral des normes institutionnelles et des procédures établies'
  },
  {
    icon: <Award className="text-slate-500" size={24} />,
    title: 'Transparence',
    description: 'Traçabilité complète et audit en temps réel de toutes les opérations'
  }
];

export const HomePage: React.FC<HomePageProps> = ({ onLogin, onDocumentation }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" variant="full" />
            
            <div className="flex items-center gap-3">
              {/* <Button onClick={onDocumentation} variant="outline">
                <Book size={16} />
                Documentation
              </Button> */}
              <Button onClick={onLogin} variant="primary">
                Se Connecter
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Bubbles */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-slate-200/30 rounded-full floating-element animate-sparkle"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-slate-300/40 rounded-full floating-element animate-sparkle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-60 left-1/4 w-3 h-3 bg-slate-400/50 rounded-full floating-element animate-sparkle" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-80 right-1/3 w-5 h-5 bg-slate-200/30 rounded-full floating-element animate-sparkle" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-32 left-2/3 w-4 h-4 bg-slate-300/40 rounded-full floating-element animate-sparkle" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Sparkles */}
          <div className="absolute top-16 left-1/2 w-2 h-2 bg-slate-400/60 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-48 right-1/4 w-1 h-1 bg-slate-500/70 rounded-full animate-sparkle" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute top-72 left-1/3 w-2 h-2 bg-slate-300/50 rounded-full animate-sparkle" style={{ animationDelay: '1.2s' }}></div>
          
          {/* Gradient Orbs */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-slate-200/20 to-slate-300/10 rounded-full blur-xl animate-glow"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-slate-300/15 to-slate-400/5 rounded-full blur-xl animate-glow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 -right-20 w-24 h-24 bg-gradient-to-br from-slate-200/10 to-slate-300/5 rounded-full blur-lg animate-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 px-6 py-3 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm border border-slate-200/50 animate-glow">
                  <Star size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
                  Solution Institutionnelle
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 bg-clip-text text-transparent font-bold tracking-wide text-3xl md:text-5xl">
                  Plateforme de
                </span>
                <br />
                <div className="relative">
                  <TypewriterText
                    texts={[
                      'Gestion Budgétaire',
                      'Validation Automatisée',
                      'Suivi Financier',
                      'Conformité Institutionnelle'
                    ]}
                    className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 bg-clip-text text-transparent font-bold tracking-wide text-3xl md:text-5xl"
                  />
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 rounded-full opacity-60 animate-glow"></div>
                </div>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
                Solution complète et sécurisée pour la digitalisation du processus budgétaire 
                de l'École Supérieure Polytechnique. De la collecte des besoins à la signature 
                électronique rectorale.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={onLogin} size="lg" variant="primary" className="btn-glow shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Users size={20} />
                  Accéder à la Plateforme
                </Button>
                {/* <Button onClick={onDocumentation} size="lg" variant="outline" className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-slate-300 hover:border-slate-400">
                  <Book size={20} />
                  Documentation
                </Button> */}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="text-center" hover>
                <div className={`flex items-center justify-center mb-3 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600">
                  {stat.label}
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-slate-700 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Pourquoi Choisir ESP Budget ?
            </h2>
            <p className="text-base text-slate-200 max-w-3xl mx-auto">
              Une solution pensée pour l'excellence opérationnelle et la conformité réglementaire
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-base text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-200 leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Fonctionnalités Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme complète couvrant l'ensemble du cycle budgétaire avec 
              traçabilité, sécurité et conformité aux standards institutionnels.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <h3 className="font-semibold text-lg text-gray-900 ml-3">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Workflow Automatisé
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Circuit de validation optimisé avec traçabilité complète et 
              notifications automatiques à chaque étape.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Agent', desc: 'Saisie des besoins', color: 'slate' },
              { step: '2', title: 'Chef Dept.', desc: 'Consolidation', color: 'slate' },
              { step: '3', title: 'Direction', desc: 'Arbitrage global', color: 'slate' },
              { step: '4', title: 'Recteur', desc: 'Approbation finale', color: 'slate' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center`}>
                  <span className={`text-2xl font-bold text-slate-600`}>
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.desc}
                </p>
                {index < 3 && (
                  <ArrowRight className="mx-auto mt-4 text-gray-400 hidden md:block" size={20} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-700 to-slate-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à Digitaliser Votre Processus Budgétaire ?
            </h2>
            <p className="text-xl text-slate-200 mb-8">
              Rejoignez la transformation numérique de l'ESP avec une solution 
              sécurisée, conforme et efficace.
            </p>
            <Button onClick={onLogin} size="lg" variant="secondary">
              <Clock size={20} />
              Commencer Maintenant
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Logo size="md" variant="full" className="mb-4 text-white" />
              <p className="text-gray-400">
                Plateforme de gestion budgétaire pour l'École Supérieure Polytechnique.
                Solution complète, sécurisée et conforme aux standards institutionnels.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Fonctionnalités</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Saisie des besoins</li>
                <li>Workflow de validation</li>
                <li>Suivi temps réel</li>
                <li>Rapports détaillés</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Assistance technique</li>
                <li>Formation utilisateurs</li>
                <li>Contact DSI</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 École Supérieure Polytechnique. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};