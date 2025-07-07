<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <!-- Navigation comme précédemment -->
    </nav>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p class="mt-1 text-sm text-gray-600">{{ message }}</p>
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
import { ref, computed } from 'vue';

// Données injectées par Inertia
const props = defineProps({
  users: Array,
  message: String,
});

// Calculer le nombre d'utilisateurs en attente
const pendingUsersCount = computed(() => {
  return props.users.filter(user => user.accountStatus === 'PENDING').length;
});

// Fonction pour mettre à jour le statut de l'utilisateur
const updateUserStatus = (userId) => {
  const user = props.users.find((u) => u.id === userId);
  if (!user) return alert('Utilisateur non trouvé');

  // Mise à jour du statut
  let newStatus = user.accountStatus === 'PENDING' ? 'ACTIVE' : (user.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'PENDING');
  user.accountStatus = newStatus;
  alert(`Statut mis à jour à ${newStatus}`);
};
</script>
