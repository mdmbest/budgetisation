import prisma from '../utils/database';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

async function createDemoUsers() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const demoUsers = [
      {
        email: 'admin@esp.sn',
        firstName: 'Serigne Mame',
        lastName: 'Sarr',
        password: hashedPassword,
        role: 'admin' as UserRole,
        department: null,
        isActive: true,
      },
      {
        email: 'agent@esp.sn',
        firstName: 'MAME DIARRA',
        lastName: 'MBACKE',
        password: hashedPassword,
        role: 'agent' as UserRole,
        department: 'Informatique',
        isActive: true,
      },
      {
        email: 'chef@esp.sn',
        firstName: 'Chef',
        lastName: 'Département',
        password: hashedPassword,
        role: 'chef_departement' as UserRole,
        department: 'Informatique',
        isActive: true,
      },
      {
        email: 'direction@esp.sn',
        firstName: 'Direction',
        lastName: 'Générale',
        password: hashedPassword,
        role: 'direction' as UserRole,
        department: null,
        isActive: true,
      },
      {
        email: 'recteur@esp.sn',
        firstName: 'Recteur',
        lastName: 'ESP',
        password: hashedPassword,
        role: 'recteur' as UserRole,
        department: null,
        isActive: true,
      }
    ];

    for (const userData of demoUsers) {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = await prisma.user.create({
          data: userData,
        });
        console.log(`✅ Utilisateur créé: ${user.email} (${user.firstName} ${user.lastName})`);
      } else {
        console.log(`ℹ️  Utilisateur existe déjà: ${userData.email}`);
      }
    }

    console.log('\n🎉 Script terminé avec succès !');
    console.log('\n📋 Comptes de démonstration créés :');
    console.log('• admin@esp.sn / password123 (Administrateur)');
    console.log('• agent@esp.sn / password123 (Agent)');
    console.log('• chef@esp.sn / password123 (Chef Département)');
    console.log('• direction@esp.sn / password123 (Direction)');
    console.log('• recteur@esp.sn / password123 (Recteur)');
    console.log('\n⚠️  IMPORTANT: Changez ces mots de passe après la première connexion !');
  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsers(); 