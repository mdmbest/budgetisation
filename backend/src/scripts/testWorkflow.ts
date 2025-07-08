import prisma from '../utils/database';
import { BudgetRequestService } from '../services/budgetRequestService';

async function testWorkflow() {
  console.log('🧪 Test du workflow des demandes de budget...\n');

  try {
    // 1. Vérifier les utilisateurs existants
    console.log('1. Vérification des utilisateurs...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        department: true,
      },
    });

    console.log(`   ${users.length} utilisateurs trouvés:`);
    users.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) - ${user.role} - ${user.department || 'N/A'}`);
    });

    // 2. Vérifier les demandes existantes
    console.log('\n2. Vérification des demandes existantes...');
    const requests = await prisma.budgetRequest.findMany({
      include: {
        items: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`   ${requests.length} demandes trouvées:`);
    requests.forEach(request => {
      console.log(`   - ${request.title} (${request.status}) - ${request.department} - ${request.agentName} - ${request.amount}€`);
    });

    // 3. Vérifier les départements
    console.log('\n3. Vérification des départements...');
    const departments = await prisma.department.findMany();
    console.log(`   ${departments.length} départements trouvés:`);
    departments.forEach(dept => {
      console.log(`   - ${dept.name} (${dept.code})`);
    });

    // 4. Tester la création d'une nouvelle demande
    console.log('\n4. Test de création d\'une nouvelle demande...');
    
    // Trouver un membre permanent
    const agent = users.find(u => u.role === 'membre_permanent');
    if (!agent) {
      console.log('   ❌ Aucun membre permanent trouvé');
      return;
    }

    const testRequest = {
      agentId: agent.id,
      agentName: `${agent.firstName} ${agent.lastName}`,
      department: agent.department || 'Génie Informatique',
      category: 'Équipement',
      title: 'Test Workflow - Ordinateurs',
      description: 'Demande de test pour vérifier le workflow',
      amount: 5000,
      justification: 'Besoin d\'ordinateurs pour les étudiants',
      urgency: 'medium' as const,
      status: 'submitted' as const,
      items: [
        {
          description: 'Ordinateur portable',
          quantity: 2,
          unitPrice: 2500,
          totalPrice: 5000,
        },
      ],
    };

    const createResult = await BudgetRequestService.createRequest(testRequest);
    if (createResult.success) {
      console.log(`   ✅ Demande créée avec succès: ${createResult.data?.id}`);
      console.log(`   Statut: ${createResult.data?.status}`);
    } else {
      console.log(`   ❌ Erreur lors de la création: ${createResult.error}`);
    }

    // 5. Tester la validation par le chef de département
    console.log('\n5. Test de validation par le chef de département...');
    
    // Trouver un chef de département
    const chef = users.find(u => u.role === 'chef_departement' && u.department === agent.department);
    if (!chef) {
      console.log(`   ❌ Aucun chef de département trouvé pour ${agent.department}`);
    } else {
      console.log(`   Chef trouvé: ${chef.firstName} ${chef.lastName}`);
      
      // Trouver une demande soumise du département
      const submittedRequest = requests.find(r => r.status === 'submitted' && r.department === agent.department);
      if (submittedRequest) {
        console.log(`   Demande soumise trouvée: ${submittedRequest.id}`);
        
        // Tester l'approbation
        const approveResult = await BudgetRequestService.updateRequestStatus(
          submittedRequest.id,
          { status: 'chef_approved', comment: 'Test d\'approbation par le chef' },
          chef.id
        );
        
        if (approveResult.success) {
          console.log(`   ✅ Demande approuvée par le chef: ${approveResult.data?.status}`);
        } else {
          console.log(`   ❌ Erreur lors de l'approbation: ${approveResult.error}`);
        }
      } else {
        console.log('   Aucune demande soumise trouvée pour ce département');
      }
    }

    // 6. Afficher le résumé final
    console.log('\n6. Résumé final...');
    const finalRequests = await prisma.budgetRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log('   Statuts des demandes:');
    const statusCounts: Record<string, number> = {};
    finalRequests.forEach(request => {
      statusCounts[request.status] = (statusCounts[request.status] || 0) + 1;
    });

    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count}`);
    });

    console.log('\n✅ Test du workflow terminé');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test si le script est appelé directement
if (require.main === module) {
  testWorkflow();
}

export { testWorkflow }; 