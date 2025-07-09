#!/bin/bash

# Script de déploiement ESP Budget
# Usage: ./deploy.sh

set -e

echo "🚀 Déploiement de ESP Budget..."
echo "================================"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ npm détecté: $(npm --version)"

# Installation des dépendances backend
echo ""
echo "📦 Installation des dépendances backend..."
cd backend
npm install

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  Fichier .env non trouvé dans backend/"
    echo "📝 Création d'un fichier .env.example..."
    
    cat > .env.example << EOF
# Configuration de la base de données
DATABASE_URL="postgresql://username:password@localhost:5432/esp_budget_db"

# Configuration JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Configuration Email (optionnel)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""

# Configuration SMS (optionnel)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Configuration serveur
PORT="3001"
NODE_ENV="development"
EOF

    echo "✅ Fichier .env.example créé"
    echo "⚠️  IMPORTANT: Copiez .env.example vers .env et configurez vos paramètres !"
    echo "   cp .env.example .env"
    echo "   # Puis éditez .env avec vos paramètres de base de données"
    echo ""
    read -p "Appuyez sur Entrée quand vous avez configuré le fichier .env..."
fi

# Générer le client Prisma
echo ""
echo "🔧 Génération du client Prisma..."
npm run db:generate

# Exécuter les migrations
echo ""
echo "🗄️  Exécution des migrations de base de données..."
npm run db:migrate

# Créer le super administrateur
echo ""
echo "👤 Création du super administrateur..."
npm run db:seed

# Créer les comptes de démonstration
echo ""
echo "👥 Création des comptes de démonstration..."
npm run create-demo-users

cd ..

# Installation des dépendances frontend
echo ""
echo "📦 Installation des dépendances frontend..."
npm install

echo ""
echo "🎉 Déploiement terminé avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Démarrer le backend : cd backend && npm run dev"
echo "2. Démarrer le frontend : npm run dev"
echo "3. Ouvrir http://localhost:5173 dans votre navigateur"
echo ""
echo "👥 Comptes de démonstration disponibles :"
echo "• admin@esp.sn / password123 (Administrateur)"
echo "• agent@esp.sn / password123 (Agent)"
echo "• chef@esp.sn / password123 (Chef Département)"
echo "• direction@esp.sn / password123 (Direction)"
echo "• recteur@esp.sn / password123 (Recteur)"
echo ""
echo "⚠️  IMPORTANT: Changez ces mots de passe après la première connexion !" 