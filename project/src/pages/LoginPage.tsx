import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Info, Shield, GraduationCap, Building2, Users, TrendingUp } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../hooks/useAuth';

type LoginPageProps = {
  onLoginSuccess?: () => void;
  onBack?: () => void;
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError('Identifiants invalides. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center p-2 md:p-4 relative overflow-hidden">
      {/* Geometric background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-white rounded-full opacity-10 animate-bounce"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center relative z-10">
        {/* Left side - Illustration/Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-start items-center text-white p-8 pt-16">
          {/* Titre ESP Budget */}
          <div className="w-full flex justify-center mb-6">
            <span className="text-3xl md:text-4xl font-extrabold tracking-wide text-blue-200 drop-shadow-lg">ESP Budget</span>
          </div>
          {/* SVG Illustration institutionnelle */}
          <div className="mb-8 flex justify-center w-full">
            <svg width="220" height="180" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="60" width="160" height="80" rx="18" fill="#1e293b" stroke="#3b82f6" strokeWidth="3" />
              <rect x="60" y="40" width="100" height="30" rx="10" fill="#3b82f6" />
              <rect x="80" y="110" width="60" height="18" rx="6" fill="#e0e7ef" />
              <circle cx="180" cy="100" r="12" fill="#3b82f6" />
              <rect x="170" y="90" width="20" height="20" rx="6" fill="#fff" />
              <rect x="175" y="95" width="10" height="10" rx="2" fill="#3b82f6" />
              <rect x="100" y="70" width="20" height="8" rx="4" fill="#b6c6e3" />
              <rect x="120" y="70" width="30" height="8" rx="4" fill="#b6c6e3" />
              <rect x="70" y="70" width="20" height="8" rx="4" fill="#b6c6e3" />
              <ellipse cx="110" cy="160" rx="60" ry="12" fill="#3b82f6" opacity="0.12" />
            </svg>
          </div>
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold italic mb-4 leading-tight text-blue-100">
              Quelques clics de plus pour<br />
              <span className="text-blue-200 font-serif not-italic">accéder à votre compte</span>
            </h1>
            <p className="text-xl text-blue-200 mb-6 font-cursive italic tracking-wide">
              Solution de gestion budgétaire ESP
            </p>
          </div>
        </div>

        {/* Right side - Login Form with curved design */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="relative w-full max-w-md p-2 md:p-0">
            {/* Curved white background */}
            <div className="absolute inset-0 bg-white rounded-3xl lg:rounded-l-[3rem] shadow-2xl transform rotate-1"></div>
            <div className="relative bg-white rounded-3xl lg:rounded-l-[3rem] shadow-2xl p-6 md:p-8 lg:p-12 w-full max-w-md transform -rotate-1">
              {/* Logo mobile */}
              <div className="md:hidden flex justify-center mb-6">
                <Logo size="lg" variant="full" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Connexion à la plateforme</h1>
              <p className="text-sm text-gray-600 text-center mb-6">Accédez à votre espace de gestion budgétaire</p>
              <div className="flex items-center justify-center gap-2 mb-8 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg w-fit mx-auto">
                <Shield size={16} />
                <span>Connexion sécurisée</span>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="votre.email@esp.sn"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connexion...
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </form>

              {/* Terms and Privacy */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  <span className="hover:underline cursor-pointer">Conditions d'utilisation</span>
                  {' · '}
                  <span className="hover:underline cursor-pointer">Politique de confidentialité</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};