import { create } from 'zustand';
import { User, UserRole } from '../types';

interface UsersStore {
  users: User[];
  isLoading: boolean;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getUsersByRole: (role: UserRole) => User[];
  getUsersByDepartment: (department: string) => User[];
  sendCredentials: (userId: string, method: 'email' | 'sms') => Promise<void>;
  fetchUsers: () => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('esp_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const useUsers = create<UsersStore>((set, get) => ({
  users: [],
  isLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      const data = await response.json();
      if (data.success && data.data) {
        // Exclure les utilisateurs admin de la liste
        set({ users: (data.data.data || []).filter(u => u.role !== 'admin'), isLoading: false });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      set({ isLoading: false });
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      const data = await response.json();
      if (data.success && data.data) {
        set(state => ({
          users: [...state.users, data.data],
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
      }

      const data = await response.json();
      if (data.success && data.data) {
        set(state => ({
          users: state.users.map(user =>
            user.id === userId ? data.data : user
          ),
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'utilisateur');
      }

      set(state => ({
        users: state.users.filter(user => user.id !== userId),
        isLoading: false
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getUsersByRole: (role) => {
    return get().users.filter(user => user.role === role);
  },

  getUsersByDepartment: (department) => {
    return get().users.filter(user => user.department === department);
  },

  sendCredentials: async (userId, method) => {
    const user = get().users.find(u => u.id === userId);
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/credentials`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ method }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des identifiants');
      }

      console.log(`Identifiants envoyés via ${method} à ${user.email}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi des identifiants:', error);
      throw error;
    }
  }
}));