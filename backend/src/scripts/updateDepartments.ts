import prisma from '../utils/database';

async function updateDepartments() {
  // Remplace cette valeur par l'ID d'un utilisateur existant (par exemple le super admin)
  const chefId = await prisma.user.findFirst({ where: { role: 'admin' } }).then(u => u?.id || '');
  if (!chefId) {
    console.error('Aucun utilisateur admin trouvé. Créez d\'abord un super admin.');
    process.exit(1);
  }

  // Les vrais départements de l'ESP
  const espDepartments = [
    {
      name: 'Génie Chimique et Biologie Appliquée',
      code: 'GCBA',
    },
    {
      name: 'Génie Civil',
      code: 'GC',
    },
    {
      name: 'Génie Électrique',
      code: 'GE',
    },
    {
      name: 'Génie Informatique',
      code: 'GI',
    },
    {
      name: 'Génie Mécanique',
      code: 'GM',
    },
    {
      name: 'Gestion',
      code: 'GEST',
    }
  ];

  console.log('Mise à jour des départements selon les vrais départements de l\'ESP...');
  console.log('================================================================');

  // Supprimer les départements qui ne correspondent pas aux vrais départements de l'ESP
  const departmentsToDelete = [
    'Génie Chimique',
    'Génie Industriel', 
    'Informatique',
    'Mathématiques',
    'Physique'
  ];

  for (const deptName of departmentsToDelete) {
    try {
      await prisma.department.delete({
        where: { name: deptName },
      });
      console.log(`✓ Département "${deptName}" supprimé`);
    } catch (error) {
      console.log(`- Département "${deptName}" n'existe pas ou ne peut pas être supprimé`);
    }
  }

  // Mettre à jour ou créer les vrais départements de l'ESP
  for (const dept of espDepartments) {
    try {
      await prisma.department.upsert({
        where: { name: dept.name },
        update: {
          code: dept.code,
        },
        create: {
          name: dept.name,
          code: dept.code,
          chefId,
          totalBudget: 0,
          usedBudget: 0,
        },
      });
      console.log(`✓ Département "${dept.name}" (${dept.code}) mis à jour/créé`);
    } catch (error) {
      console.error(`✗ Erreur avec le département "${dept.name}":`, error);
    }
  }

  console.log('\nMise à jour terminée !');
  await prisma.$disconnect();
}

updateDepartments(); 