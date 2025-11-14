<template>
  <div>
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">Paramètre des médecins</h2>
        <div class="mt-2 flex items-center gap-4">
          <div class="bg-white rounded shadow p-4 flex items-center gap-2">
            <span class="font-bold text-2xl">{{ totalDocteurs }}</span>
            <Stethoscope class="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un Docteur par Matricule, nom, etc."
          class="px-4 py-2 border rounded-md"
        />
        
      </div>
    </div>

    <!-- Tableau des docteurs -->
    <div class="bg-white rounded shadow p-4">
      <h3 class="font-bold mb-4">Liste des docteurs et spécialités</h3>
      <table class="w-full text-left border-collapse border border-gray-200">
        <thead>
          <tr class="border-b bg-gray-100">
            <th class="py-2 px-2 border border-gray-200">Nom</th>
            <th class="py-2 px-2 border border-gray-200">Prénom</th>
            <th class="py-2 px-2 border border-gray-200">Email</th>
            <th class="py-2 px-2 border border-gray-200">Téléphone</th>
            <th class="py-2 px-2 border border-gray-200">Spécialité</th>
            <th class="py-2 px-2 border border-gray-200">Matricule</th>
            <th class="py-2 px-2 border border-gray-200">Statut</th>
            <th class="py-2 px-2 border border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="docteur in filteredDocteurs" :key="docteur.id" class="hover:bg-gray-50">
            <td class="py-2 px-2 border border-gray-200">{{ docteur.lastName || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.firstName || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.email || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.phone || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.specialisation || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.licenseNumber || 'N/A' }}</td>
<td class="py-2 px-2 border border-gray-200">
  <span
    class="px-3 py-1 rounded-full text-sm font-semibold"
    :class="getStatusClass(docteur.accountStatus)"
  >
    {{ docteur.accountStatus || 'Pending' }}
  </span>
</td>
            <td class="py-2 px-2 border border-gray-200">
              <!-- Trois points ouvrant la sidebar -->
              <button
                class="px-2 py-1 rounded hover:bg-gray-100"
                aria-label="Plus d'actions"
                @click="openSidebar(docteur)"
              >
                <!-- simple ellipsis -->
                <span class="text-xl">⋯</span>
              </button>
            </td>
          </tr>
          <tr v-if="filteredDocteurs.length === 0">
            <td colspan="8" class="py-4 text-center text-gray-500">Aucun docteur trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sidebar: détails du docteur -->
    <div v-if="showSidebar" class="fixed inset-0 z-40">
      <!-- overlay -->
      <div class="absolute inset-0 bg-black opacity-40" @click="closeSidebar"></div>

      <!-- panel -->
      <aside class="absolute right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-auto">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-lg font-bold">Détails du docteur</h4>
          <button class="text-gray-500 hover:text-gray-800" @click="closeSidebar">✕</button>
        </div>

        <div v-if="selectedDoctor">
          <!-- Profile image -->
          <div class="flex items-center gap-4 mb-4">
            <div class="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
              <img v-if="selectedDoctor.profileImage" :src="selectedDoctor.profileImage" alt="profile" class="w-full h-full object-cover" />
              <span v-else class="text-gray-500">No Image</span>
            </div>
            <div>
              <h5 class="font-bold text-lg">{{ selectedDoctor.name || `${selectedDoctor.firstName || ''} ${selectedDoctor.lastName || ''}`.trim() || 'N/A' }}</h5>
              <div class="text-sm text-gray-500">{{ selectedDoctor.type || selectedDoctor.role || 'N/A' }}</div>
            </div>
          </div>

          <p class="mb-2"><strong>Email :</strong> {{ selectedDoctor.email || 'N/A' }}</p>
          <p class="mb-2"><strong>Adresse :</strong> {{ selectedDoctor.address || 'N/A' }}</p>
          <p class="mb-2"><strong>Téléphone :</strong> {{ selectedDoctor.phone || 'N/A' }}</p>
          <p class="mb-2"><strong>Spécialité :</strong> {{ selectedDoctor.specialisation || selectedDoctor.specialty || 'N/A' }}</p>
          <p class="mb-2"><strong>Année d'expérience :</strong> {{ selectedDoctor.annee_experience ?? 'N/A' }}</p>
          <p class="mb-2"><strong>À propos :</strong> {{ selectedDoctor.about || 'N/A' }}</p>
<p class="mb-2 flex items-center gap-2">
  <strong>Statut :</strong>
  <span
    class="px-3 py-1 rounded-full text-sm font-semibold"
    :class="getStatusClass(selectedDoctor.accountStatus)"
  >
    {{ selectedDoctor.accountStatus || 'Pending' }}
  </span>
</p>

          <div class="mt-4">
          </div>
        </div>

        <div v-else class="text-gray-500">Aucun docteur sélectionné.</div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Données
const docteurs = ref([])

// Recherche
const search = ref('')

// Compteur total docteurs
const totalDocteurs = computed(() => docteurs.value.length)

// Sidebar / sélection
const showSidebar = ref(false)
const selectedDoctor = ref(null)

function openSidebar(doctor) {
  selectedDoctor.value = doctor
  showSidebar.value = true
}

function closeSidebar() {
  showSidebar.value = false
  selectedDoctor.value = null
}

// Classes Tailwind selon statut
const getStatusClass = (status) => {
  const s = status?.toLowerCase() || ''

  if (s === 'approved' || s === 'active')
    return 'bg-green-100 text-green-700 border border-green-300'

  if (s === 'pending')
    return 'bg-yellow-100 text-yellow-700 border border-yellow-300'

  if (s === 'rejected' || s === 'blocked')
    return 'bg-red-100 text-red-700 border border-red-300'

  return 'bg-gray-200 text-gray-600 border border-gray-300'
}

// ➤ Fonction de récupération
async function fetchDoctors() {
  try {
    const response = await fetch('/alldoctors')
    if (!response.ok) throw new Error('Erreur lors de la récupération des docteurs')

    const data = await response.json()

    const isDoctor = (d) => (
      d && (
        d.type === 'doctor' ||
        d.role === 'doctor' ||
        d.accountType === 'doctor' ||
        d.isDoctor === true
      )
    )

    docteurs.value = data
      .filter(isDoctor)
      .map(d => ({
        phone: '',
        specialisation: '',
        licenseNumber: '',
        accountStatus: 'Pending',
        ...d,
      }))

  } catch (error) {
    console.error("Erreur de chargement :", error)
  }
}

// ➤ Rafraîchissement automatique toutes les 10 secondes
let refreshInterval = null

onMounted(() => {
  fetchDoctors()

  refreshInterval = setInterval(() => {
    fetchDoctors()
  }, 15000) // 10 secondes
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})

// Computed : liste filtrée selon la recherche
const filteredDocteurs = computed(() => {
  const q = search.value.toLowerCase()
  return docteurs.value.filter(d =>
    d.firstName?.toLowerCase().includes(q) ||
    d.lastName?.toLowerCase().includes(q) ||
    d.email?.toLowerCase().includes(q) ||
    d.licenseNumber?.toLowerCase().includes(q) ||
    d.phone?.toLowerCase().includes(q) ||
    d.specialisation?.toLowerCase().includes(q)
  )
})
</script>


<!-- Sidebar template placé ici en dehors du script -->
 

<style>
/* optionnel : style simple pour le tableau */
table {
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
}
th {
  background-color: #f9fafb;
}
</style>
