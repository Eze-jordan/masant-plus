<template>
    <div className="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">Dashboard</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#" :className="activeTab === 'overview' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'" 
                   className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                   @click="activeTab = 'overview'">
                  Vue d'ensemble
                </a>
                <a href="#" :className="activeTab === 'analytics' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'" 
                   className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                   @click="activeTab = 'analytics'">
                  Analytiques
                </a>
                <a href="#" :className="activeTab === 'users' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'" 
                   className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                   @click="activeTab = 'users'">
                  Utilisateurs
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </button>
              
              <div className="ml-3 relative">
                <div>
                  <button @click="showUserMenu = !showUserMenu" className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  </button>
                </div>
                <div v-if="showUserMenu" className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Votre profil</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="handleLogout">Se déconnecter</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Contenu principal -->
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- En-tête -->
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="mt-1 text-sm text-gray-600">Bienvenue dans votre espace de gestion</p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Exporter
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Nouveau
              </button>
            </div>
          </div>
        </div>
  
        <!-- Statistiques -->
        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Utilisateurs totaux</dt>
                      <dd className="text-lg font-medium text-gray-900">{{ stats.totalUsers }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="text-green-600 font-medium">+12%</span>
                  <span className="text-gray-500">depuis le mois dernier</span>
                </div>
              </div>
            </div>
  
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Revenus</dt>
                      <dd className="text-lg font-medium text-gray-900">{{ stats.revenue }}€</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="text-green-600 font-medium">+8%</span>
                  <span className="text-gray-500">depuis le mois dernier</span>
                </div>
              </div>
            </div>
  
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Commandes</dt>
                      <dd className="text-lg font-medium text-gray-900">{{ stats.orders }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="text-red-600 font-medium">-2%</span>
                  <span className="text-gray-500">depuis le mois dernier</span>
                </div>
              </div>
            </div>
  
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Taux de conversion</dt>
                      <dd className="text-lg font-medium text-gray-900">{{ stats.conversionRate }}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="text-green-600 font-medium">+5%</span>
                  <span className="text-gray-500">depuis le mois dernier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Contenu des onglets -->
        <div className="mt-8 px-4 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div v-if="activeTab === 'overview'">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Activité récente</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    <li v-for="(activity, index) in recentActivities" :key="index">
                      <div className="relative pb-8" :className="{ 'pb-0': index === recentActivities.length - 1 }">
                        <span v-if="index !== recentActivities.length - 1" className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                        <div className="relative flex space-x-3">
                          <div>
                            <span :className="activity.iconBg" className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activity.iconPath"></path>
                              </svg>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">{{ activity.description }}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {{ activity.time }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
  
              <div v-else-if="activeTab === 'analytics'">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Analytiques</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Visiteurs par jour</h4>
                    <div className="h-32 bg-white rounded flex items-center justify-center">
                      <span className="text-gray-500">Graphique des visiteurs</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Sources de trafic</h4>
                    <div className="h-32 bg-white rounded flex items-center justify-center">
                      <span className="text-gray-500">Graphique des sources</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <div v-else-if="activeTab === 'users'">
  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Gestion des utilisateurs</h3>
  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière connexion</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr v-for="user in users" :key="user.id">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <!-- Utilisation du nom complet de l'utilisateur -->
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span :className="user.accountStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'" 
                  className="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ user.accountStatus === 'PENDING' ? 'En attente' : 'Actif' }}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <!-- Utilisation de createdAt comme dernière connexion -->
            {{ new Date(user.createdAt).toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { onMounted } from 'vue';
  
  const activeTab = ref('overview')
  const showUserMenu = ref(false)
  
  const stats = reactive({
    totalUsers: '2,543',
    revenue: '45,231',
    orders: '1,234',
    conversionRate: '3.24'
  })
  
  const recentActivities = ref([
    {
      description: 'Nouvel utilisateur inscrit',
      time: 'Il y a 2 minutes',
      iconBg: 'bg-green-500',
      iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      description: 'Commande #1234 traitée',
      time: 'Il y a 1 heure',
      iconBg: 'bg-blue-500',
      iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
    },
    {
      description: 'Rapport mensuel généré',
      time: 'Il y a 3 heures',
      iconBg: 'bg-yellow-500',
      iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    }
  ])
  
// Déclare une variable reactive pour stocker les utilisateurs
const users = ref([]);

// Fonction pour récupérer les utilisateurs en attente
const fetchPendingUsers = async () => {
  try {
    // Utilisation de fetch pour récupérer les utilisateurs
    const response = await fetch('/users/pending'); // Remplace par l'URL correcte de ton API

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }

    const data = await response.json();
    console.log(data);

    // Remplir la variable `users` avec les utilisateurs récupérés
    users.value = data.users; // On accède à `users.value` car `users` est une ref
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
  }
};

// Appeler la fonction pour récupérer les utilisateurs au moment où le composant est monté
onMounted(() => {
  fetchPendingUsers();
});
  
  const handleLogout = () => {
    alert('Déconnexion...')
    // Ici vous ajouteriez votre logique de déconnexion
  }
  </script>