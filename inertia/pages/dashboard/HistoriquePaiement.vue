<template>
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Historique des Paiements</h2>
          <div class="mt-3 flex items-center gap-4">
            <div class="border border-blue-400 rounded-lg p-4 flex items-center justify-between w-64 bg-white">
              <div>
                <div class="text-gray-500 text-sm mb-1">Revenus</div>
                <div class="text-2xl font-bold text-black">XAF 60K</div>
              </div>
              <div class="flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-400">
                <DollarSign class="w-7 h-7 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
  
        <!-- Barre de recherche -->
        <div class="mt-4 md:mt-0">
          <input
            v-model="search"
            type="text"
            placeholder=" Rechercher une transaction..."
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
  
      <!-- Tableau des paiements -->
      <div class="bg-white rounded-lg shadow overflow-auto">
        <div class="bg-blue-100 px-6 py-3 font-semibold text-gray-700 flex items-center border-b">
          <div class="w-10"></div>
          <div class="w-48">Nom</div>
          <div class="w-32">Prénom</div>
          <div class="w-56">Email</div>
          <div class="w-32">Montant</div>
          <div class="w-32">Type</div>
          <div class="w-48">Date transaction</div>
          <div class="w-10 text-right"></div>
        </div>
  
        <div
          v-for="paiement in filteredPaiements"
          :key="paiement.id"
          class="flex items-center px-6 py-3 border-b bg-white hover:bg-blue-50 relative"
        >
          <input type="checkbox" class="mr-4 cursor-pointer" />
  
          <div class="w-48 font-bold flex items-center gap-2">
            <img :src="paiement.profileImage || '/doctor1.jpg'" class="w-8 h-8 rounded-full object-cover" />
            <User class="w-5 h-5 text-blue-500" /> Dr. {{ paiement.nom }}
          </div>
          <div class="w-32 text-gray-600">{{ paiement.prenom }}</div>
          <div class="w-56 text-gray-600">{{ paiement.email }}</div>
          <div class="w-32 text-gray-600">{{ paiement.montant }}</div>
          <div class="w-32 text-gray-600">{{ paiement.type }}</div>
          <div class="w-48 text-gray-600">{{ paiement.date }}</div>
  
          <!-- Menu contextuel -->
          <div class="w-10 text-right relative">
            <button
              @click="toggleMenu(paiement.id)"
              class="px-2 py-1 rounded hover:bg-gray-200"
              title="Options"
            >
              ⋮
            </button>
            <div
              v-if="openMenu === paiement.id"
              class="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10"
            >
              <ul>
                <li
                  class="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  @click="voirPlus(paiement)"
                >
                  Voir plus
                </li>
                <li
                  class="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                  @click="supprimer(paiement)"
                >
                  Supprimer
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Panneau latéral Détails paiement -->
      <div v-if="showDetails" class="fixed inset-0 z-50 flex">
        <div class="flex-1 bg-black bg-opacity-40" @click="showDetails = false"></div>
        <div class="w-full max-w-md h-full bg-white shadow-lg p-8 relative animate-slide-in-right overflow-y-auto">
          <button class="absolute top-2 right-2 text-gray-500" @click="showDetails = false">&times;</button>
          <h3 class="text-lg font-bold mb-4 text-blue-700">Détails du paiement</h3>
          <div v-if="selectedPaiement">
            <div class="mb-4 flex flex-col items-center">
              <img :src="selectedPaiement.profileImage || '/doctor1.jpg'" class="w-24 h-24 rounded-full object-cover mb-2" />
              <span class="font-bold text-xl">Dr. {{ selectedPaiement.nom }} {{ selectedPaiement.prenom }}</span>
            </div>
            <div class="mb-2"><b>Email :</b> {{ selectedPaiement.email }}</div>
            <div class="mb-2"><b>Montant :</b> {{ selectedPaiement.montant }}</div>
            <div class="mb-2"><b>Type :</b> {{ selectedPaiement.type }}</div>
            <div class="mb-2"><b>Date transaction :</b> {{ selectedPaiement.date }}</div>
            <!-- Ajoute d'autres infos si besoin -->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { Stethoscope, User, DollarSign } from 'lucide-vue-next'
  
  const search = ref('')
  const openMenu = ref(null)
  const showDetails = ref(false)
  const selectedPaiement = ref(null)
  
  const paiements = ref([
    {
      id: 1,
      nom: 'IGAMBA',
      prenom: 'Paul',
      email: 'paul.igamba@email.com',
      montant: '50 000 XAF',
      type: 'Consultation',
      date: '2024-06-10 14:00'
    },
    {
      id: 2,
      nom: 'NTOUTOUME',
      prenom: 'Sarah',
      email: 'sarah.nti@email.com',
      montant: '75 000 XAF',
      type: 'Examen',
      date: '2024-06-12 09:30'
    }
  ])
  
  const filteredPaiements = computed(() => {
    if (!search.value) return paiements.value
    return paiements.value.filter(p =>
      p.nom.toLowerCase().includes(search.value.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.value.toLowerCase()) ||
      p.email.toLowerCase().includes(search.value.toLowerCase()) ||
      p.montant.toLowerCase().includes(search.value.toLowerCase()) ||
      p.type.toLowerCase().includes(search.value.toLowerCase()) ||
      p.date.toLowerCase().includes(search.value.toLowerCase())
    )
  })
  
  function toggleMenu(id) {
    openMenu.value = openMenu.value === id ? null : id
  }
  function voirPlus(paiement) {
    selectedPaiement.value = { ...paiement }
    showDetails.value = true
    openMenu.value = null
  }
  function supprimer(paiement) {
    if (confirm('Supprimer ce paiement ?')) {
      paiements.value = paiements.value.filter(p => p.id !== paiement.id)
    }
    openMenu.value = null
  }
  </script>
  