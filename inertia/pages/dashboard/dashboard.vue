<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <span class="ml-2 text-xl font-semibold text-gray-900">Dashboard</span>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="#" :class="activeTab === 'overview' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'" 
                 class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                 @click="activeTab = 'overview'">
                Vue d'ensemble
              </a>
              <a href="#" :class="activeTab === 'analytics' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'" 
                 class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                 @click="activeTab = 'analytics'">
                Analytiques
              </a>
              <a href="#" :class="activeTab === 'users' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'" 
                 class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                 @click="activeTab = 'users'">
                Utilisateurs
              </a>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <button class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </button>

            <div class="ml-3 relative">
              <div>
                <button @click="showUserMenu = !showUserMenu" class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                </button>
              </div>
              <div v-if="showUserMenu" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div class="py-1">
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Votre profil</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="handleLogout">Se déconnecter</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p class="mt-1 text-sm text-gray-600">Bienvenue dans votre espace de gestion</p>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="px-4 sm:px-0">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9.282-4.944m-3.418-5.353a4 4 0 00-2.016-1.011M5 6v8m5-5h7m4 5v4m0-4H7m0 4v5m5 0v-2"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 text-gray-900 text-sm font-medium">
                  Utilisateurs en attente
                </div>
              </div>
              <!-- Affichage dynamique du nombre d'utilisateurs en attente -->
              <div class="mt-2 text-2xl font-semibold text-gray-900">
                {{ pendingUsersCount }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau des utilisateurs -->
      <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière connexion</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="user.accountStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : user.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ user.accountStatus === 'PENDING' ? 'En attente' : user.accountStatus === 'ACTIVE' ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(user.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="updateUserStatus(user.id)" class="text-blue-600 hover:text-blue-900">Mettre à jour</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const users = ref([]);

// Fonction pour récupérer les utilisateurs en attente
const fetchPendingUsers = async () => {
  try {
    const response = await fetch('/users/pending'); // URL de l'API pour les utilisateurs en attente
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs en attente');
    }
    const data = await response.json();
    users.value = data.users; // On stocke les utilisateurs en attente
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    alert('Erreur lors de la récupération des utilisateurs');
  }
};

// Calculer le nombre d'utilisateurs en attente
const pendingUsersCount = computed(() => {
  return users.value.filter(user => user.accountStatus === 'PENDING').length;
});

onMounted(() => {
  fetchPendingUsers(); // On appelle l'API pour récupérer les utilisateurs en attente
});

const activeTab = ref("overview");
const showUserMenu = ref(false);

// Fonction pour mettre à jour le statut de l'utilisateur
const updateUserStatus = async (userId) => {
  const user = users.value.find((u) => u.id === userId);

  if (!user) {
    alert("Utilisateur introuvable");
    return;
  }

  // Logique de changement de statut
  let newStatus = user.accountStatus === 'PENDING' ? 'ACTIVE' : (user.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'PENDING');

  try {
    const response = await fetch(`/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "x-app-key": "boulinguiboulingui",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      user.accountStatus = newStatus;
      toast.success(`Le statut de l'utilisateur a été mis à jour à ${newStatus}`);
    } else {
      throw new Error('Erreur lors de la mise à jour du statut');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    alert('Erreur lors de la mise à jour du statut');
  }
};
</script>
