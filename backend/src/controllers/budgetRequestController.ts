import { Request, Response } from 'express';
import { BudgetRequestService } from '../services/budgetRequestService';
import { CreateBudgetRequestRequest, UpdateBudgetRequestRequest, UpdateRequestStatusRequest } from '../types';

export class BudgetRequestController {
  // Créer une nouvelle demande de budget
  static async createRequest(req: Request, res: Response): Promise<void> {
    try {
      const requestData: CreateBudgetRequestRequest = req.body;
      const userId = (req as any).user?.id;

      console.log('Données reçues dans le contrôleur:', requestData);
      console.log('User ID:', userId);

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      // Validation des données
      if (!requestData.title || !requestData.description || !requestData.amount || !requestData.department) {
        console.log('Validation échouée:', {
          title: requestData.title,
          description: requestData.description,
          amount: requestData.amount,
          department: requestData.department
        });
        res.status(400).json({
          success: false,
          error: 'Tous les champs obligatoires doivent être remplis',
        });
        return;
      }

      // S'assurer que l'agentId correspond à l'utilisateur connecté
      requestData.agentId = userId;

      console.log('Données envoyées au service:', requestData);

      const result = await BudgetRequestService.createRequest(requestData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Récupérer une demande par ID
  static async getRequestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      const result = await BudgetRequestService.getRequestById(id);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      // Vérifier les permissions selon le rôle
      if (userRole === 'agent' && result.data!.agentId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Vous n\'avez pas la permission d\'accéder à cette demande',
        });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur lors de la récupération de la demande:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Récupérer les demandes avec filtres
  static async getRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const userDepartment = (req as any).user?.department;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      // Récupérer les paramètres de filtrage
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      // Appliquer les filtres selon les paramètres de requête
      if (req.query.status) filters.status = req.query.status;
      if (req.query.department) filters.department = req.query.department;
      if (req.query.urgency) filters.urgency = req.query.urgency;
      if (req.query.amountMin) filters.amountMin = parseFloat(req.query.amountMin as string);
      if (req.query.amountMax) filters.amountMax = parseFloat(req.query.amountMax as string);
      if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom as string;
      if (req.query.dateTo) filters.dateTo = req.query.dateTo as string;

      // Filtrage métier strict selon le rôle
      if (userRole === 'agent') {
        // L'agent ne voit que ses propres demandes (tous statuts)
        filters.agentId = userId;
      } else if (userRole === 'chef_departement' && userDepartment) {
        // Le chef ne voit que les demandes de son département, hors brouillons
        filters.department = userDepartment;
        filters.status = {
          not: 'draft',
        };
      } else if (userRole === 'direction') {
        // La direction ne voit que les demandes validées par le chef ou en cours de traitement direction
        filters.status = {
          in: ['chef_approved', 'direction_approved'],
        };
      } else if (userRole === 'recteur') {
        // Le recteur ne voit que les demandes validées par la direction ou en cours de traitement recteur
        filters.status = {
          in: ['direction_approved', 'recteur_approved'],
        };
      }

      const result = await BudgetRequestService.getRequests(filters, page, limit);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Mettre à jour une demande
  static async updateRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const updates: UpdateBudgetRequestRequest = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      // Vérifier les permissions
      const requestResult = await BudgetRequestService.getRequestById(id);
      if (!requestResult.success) {
        res.status(404).json(requestResult);
        return;
      }

      const request = requestResult.data!;
      if (userRole === 'agent' && request.agentId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Vous n\'avez pas la permission de modifier cette demande',
        });
        return;
      }

      const result = await BudgetRequestService.updateRequest(id, updates);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la demande:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Mettre à jour le statut d'une demande
  static async updateRequestStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const statusUpdate: UpdateRequestStatusRequest = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      if (!statusUpdate.status) {
        res.status(400).json({
          success: false,
          error: 'Statut requis',
        });
        return;
      }

      // Vérifier les permissions selon le rôle et le statut
      const requestResult = await BudgetRequestService.getRequestById(id);
      if (!requestResult.success) {
        res.status(404).json(requestResult);
        return;
      }

      const request = requestResult.data!;
      const currentStatus = request.status;
      const newStatus = statusUpdate.status;

      // Vérifier les permissions selon le rôle
      let hasPermission = false;

      switch (userRole) {
        case 'agent':
          hasPermission = request.agentId === userId && 
                        (currentStatus === 'draft' || currentStatus === 'submitted');
          break;
        case 'chef_departement':
          hasPermission = request.department === (req as any).user?.department &&
                        (newStatus.includes('chef_') || newStatus === 'submitted');
          break;
        case 'direction':
          hasPermission = newStatus.includes('direction_');
          break;
        case 'recteur':
          hasPermission = newStatus.includes('recteur_');
          break;
        case 'admin':
          hasPermission = true;
          break;
        default:
          hasPermission = false;
      }

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          error: 'Vous n\'avez pas la permission de modifier le statut de cette demande',
        });
        return;
      }

      const result = await BudgetRequestService.updateRequestStatus(id, statusUpdate, userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Supprimer une demande
  static async deleteRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      // Vérifier les permissions
      const requestResult = await BudgetRequestService.getRequestById(id);
      if (!requestResult.success) {
        res.status(404).json(requestResult);
        return;
      }

      const request = requestResult.data!;
      if (userRole === 'agent' && request.agentId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Vous n\'avez pas la permission de supprimer cette demande',
        });
        return;
      }

      const result = await BudgetRequestService.deleteRequest(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Récupérer les statistiques des demandes
  static async getRequestStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const userDepartment = (req as any).user?.department;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      // Construire les filtres selon le rôle
      const filters: any = {};
      if (userRole === 'agent') {
        filters.agentId = userId;
      } else if (userRole === 'chef_departement' && userDepartment) {
        filters.department = userDepartment;
      }

      // Récupérer toutes les demandes pour calculer les stats
      const requestsResult = await BudgetRequestService.getRequests(filters, 1, 1000);
      
      if (!requestsResult.success) {
        res.status(400).json(requestsResult);
        return;
      }

      const requests = requestsResult.data!.data;
      
      // Calculer les statistiques
      const stats = {
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status.includes('review')).length,
        approvedRequests: requests.filter(r => r.status.includes('approved')).length,
        rejectedRequests: requests.filter(r => r.status.includes('rejected')).length,
        totalAmount: requests.reduce((sum, r) => sum + r.amount, 0),
        approvedAmount: requests.filter(r => r.status.includes('approved')).reduce((sum, r) => sum + r.amount, 0),
        pendingAmount: requests.filter(r => r.status.includes('review')).reduce((sum, r) => sum + r.amount, 0),
        rejectedAmount: requests.filter(r => r.status.includes('rejected')).reduce((sum, r) => sum + r.amount, 0),
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }
} 