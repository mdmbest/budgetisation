import { create } from 'zustand';
import { BudgetRequest, RequestStatus, RequestItem } from '../types';

interface BudgetRequestStore {
  requests: BudgetRequest[];
  isLoading: boolean;
  addRequest: (request: Omit<BudgetRequest, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<void>;
  updateRequestStatus: (requestId: string, status: RequestStatus, comment?: string) => Promise<void>;
  getRequestsByUser: (userId: string) => BudgetRequest[];
  getRequestsByDepartment: (department: string) => BudgetRequest[];
  getRequestsByStatus: (status: RequestStatus) => BudgetRequest[];
  updateRequest: (requestId: string, updates: Partial<BudgetRequest>) => Promise<void>;
  deleteRequest: (requestId: string) => Promise<void>;
  fetchRequests: () => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('esp_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const useBudgetRequests = create<BudgetRequestStore>((set, get) => ({
  requests: [],
  isLoading: false,

  fetchRequests: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des demandes');
      }

      const data = await response.json();
      if (data.success && data.data) {
        set({ requests: data.data.data || [], isLoading: false });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      set({ isLoading: false });
    }
  },

  addRequest: async (requestData) => {
    set({ isLoading: true });
    try {
      console.log('Données envoyées au serveur:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
      });

      console.log('Statut de la réponse:', response.status);
      console.log('Headers de la réponse:', response.headers);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Réponse d\'erreur du serveur:', errorData);
        throw new Error('Erreur lors de la création de la demande');
      }

      const data = await response.json();
      console.log('Réponse du serveur:', data);
      
      if (data.success && data.data) {
        // Après création, rafraîchir la liste complète depuis l'API
        await get().fetchRequests();
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateRequestStatus: async (requestId, status, comment) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, comment }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      const data = await response.json();
      if (data.success && data.data) {
        set(state => ({
          requests: state.requests.map(request =>
            request.id === requestId ? data.data : request
          ),
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateRequest: async (requestId, updates) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la demande');
      }

      const data = await response.json();
      if (data.success && data.data) {
        set(state => ({
          requests: state.requests.map(request =>
            request.id === requestId ? data.data : request
          ),
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la demande:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la demande');
      }

      set(state => ({
        requests: state.requests.filter(request => request.id !== requestId),
        isLoading: false
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getRequestsByUser: (userId) => {
    return get().requests.filter(request => request.agentId === userId);
  },

  getRequestsByDepartment: (department) => {
    return get().requests.filter(request => request.department === department);
  },

  getRequestsByStatus: (status) => {
    return get().requests.filter(request => request.status === status);
  }
}));