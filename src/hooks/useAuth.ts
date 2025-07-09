import { create } from 'zustand';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  getTokenInfo: () => void;
}

const API_BASE_URL = 'http://localhost:3001/api';

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }

      const data = await response.json();
      if (data.success && data.data) {
        localStorage.setItem('esp_token', data.data.token);
        set({ user: data.data.user, isAuthenticated: true, isLoading: false });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('esp_token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('esp_token');
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          set({ user: data.data, isAuthenticated: true });
          return true;
        }
      }
      
      set({ user: null, isAuthenticated: false });
      return false;
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      set({ user: null, isAuthenticated: false });
      return false;
    }
  },

  getTokenInfo: () => {
    const token = localStorage.getItem('esp_token');
    if (!token) {
      console.log('Aucun token trouvé');
      return;
    }

    try {
      // Décoder le token JWT (partie payload)
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      console.log('Informations du token JWT:', decoded);
      console.log('User ID dans le token:', decoded.userId);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
    }
  }
}));