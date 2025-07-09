# ESP Budget - Plateforme de Gestion Budgétaire

## 🚀 Déploiement

### Prérequis
- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd budgetisation
```

2. **Installer les dépendances**
```bash
# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

3. **Configuration de la base de données**
```bash
cd backend
# Créer le fichier .env avec vos paramètres de base de données
cp env.example .env

# Modifier le fichier .env avec vos paramètres
DATABASE_URL="postgresql://username:password@localhost:5432/esp_budget_db"
JWT_SECRET="votre-secret-jwt-super-securise"
```

4. **Migration et seeding de la base de données**
```bash
# Générer le client Prisma
npm run db:generate

# Exécuter les migrations
npm run db:migrate

# Créer le super administrateur
npm run db:seed

# Créer les comptes de démonstration
npm run create-demo-users
```

5. **Démarrer les serveurs**
```bash
# Backend (dans le dossier backend)
npm run dev

# Frontend (dans le dossier racine)
npm run dev
```

## 👥 Comptes de Démonstration

Après avoir exécuté `npm run create-demo-users`, les comptes suivants sont disponibles :

| Rôle | Email | Mot de passe | Fonctionnalités |
|------|-------|--------------|-----------------|
| **Administrateur** | admin@esp.sn | password123 | Gestion complète du système |
| **Agent** | agent@esp.sn | password123 | Création de demandes budgétaires |
| **Chef Département** | chef@esp.sn | password123 | Validation des demandes départementales |
| **Direction** | direction@esp.sn | password123 | Arbitrage centralisé |
| **Recteur** | recteur@esp.sn | password123 | Approbation finale |

⚠️ **IMPORTANT** : Changez ces mots de passe après la première connexion !

## 🔐 Sécurité

### Première connexion
1. Connectez-vous avec un des comptes de démonstration
2. Allez dans les paramètres utilisateur
3. Changez immédiatement le mot de passe par défaut

### Variables d'environnement critiques
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `DATABASE_URL` : URL de connexion à la base de données
- `SMTP_*` : Configuration email pour les notifications

## 📋 Fonctionnalités par Rôle

### Agent
- Créer des demandes budgétaires
- Suivre le statut des demandes
- Consulter l'historique personnel

### Chef de Département  
- Valider/rejeter les demandes du département
- Consolider le budget départemental
- Gérer l'équipe

### Direction
- Arbitrage centralisé des budgets
- Vue globale de tous les départements
- Rapports consolidés

### Recteur
- Approbation finale des budgets
- Signature électronique
- Vue d'ensemble institutionnelle

### Administrateur
- Gestion des utilisateurs
- Configuration système
- Maintenance et sauvegarde

## 🛠️ Maintenance

### Sauvegarde de la base de données
```bash
pg_dump esp_budget_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Mise à jour des dépendances
```bash
npm update
npm audit fix
```

### Logs
Les logs sont disponibles dans :
- Backend : `backend/logs/`
- Frontend : Console du navigateur

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation intégrée (menu Documentation)
2. Vérifiez les logs d'erreur
3. Contactez l'équipe de développement

## 🔄 Mise à jour

Pour mettre à jour la plateforme :
```bash
git pull origin main
cd backend && npm install
cd .. && npm install
npm run db:migrate
```

---

**ESP Budget** - Solution complète de gestion budgétaire conforme OHADA 