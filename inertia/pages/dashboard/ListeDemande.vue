<template>
  <div>
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">Paramètre des médecins</h2>
        <div class="mt-2 flex items-center gap-4">
          <div class="bg-white rounded shadow p-4 flex items-center gap-2">
            <span class="font-bold text-2xl">{{ totalDemandes }}</span>
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
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold">
          + Ajouter un Docteur
        </button>
      </div>
    </div>

    <!-- Tableau des demandes -->
    <div class="bg-white rounded shadow p-4">
      <h3 class="font-bold mb-4">Liste des demandes de compte</h3>
      <table class="w-full text-left">
        <thead>
          <tr class="border-b">
            <th class="py-2 px-2"><input type="checkbox" /></th>
            <th class="py-2 px-2">Nom</th>
            <th class="py-2 px-2">Prénom</th>
            <th class="py-2 px-2">Téléphone</th>
            <th class="py-2 px-2">Email</th>
            <th class="py-2 px-2">Spécialité</th>
            <th class="py-2 px-2">Matricule</th>
            <th class="py-2 px-2">Statut</th>
            <th class="py-2 px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="demande in filteredDemandes"
            :key="demande.id"
            class="border-b hover:bg-gray-100"
          >
            <td class="py-2 px-2"><input type="checkbox" /></td>
            <td class="py-2 px-2 flex items-center gap-2">
              <span class="font-bold">Dr. {{ demande.nom }}</span>
            </td>
            <td class="py-2 px-2">{{ demande.prenom }}</td>
            <td class="py-2 px-2">{{ demande.telephone }}</td>
            <td class="py-2 px-2">{{ demande.email }}</td>
            <td class="py-2 px-2">{{ demande.specialite }}</td>
            <td class="py-2 px-2">{{ demande.matricule }}</td>
            <td class="py-2 px-2">
              <span class="px-2 py-1 rounded-full text-sm" :class="statusClass(demande.status)">{{ demande.status || 'pending' }}</span>
            </td>
            <td class="py-2 px-2 relative">
              <div class="flex items-center">
                <button @click="toggleMenu(demande.id)" class="text-xl font-bold px-2">⋯</button>
              </div>
              <!-- Inline menu -->
              <div v-if="openMenuId === demande.id" class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                <button @click="accepterDemande(demande)" class="w-full text-left px-4 py-2 hover:bg-green-50">Approuver</button>
                <button @click="refuserDemande(demande)" class="w-full text-left px-4 py-2 hover:bg-red-50">Refuser</button>
                <button @click="voirDetails(demande)" class="w-full text-left px-4 py-2 hover:bg-gray-50">Voir détails</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Détails -->
    <div v-if="showDetails" class="fixed inset-0 z-50 flex">
      <div class="flex-1 bg-black bg-opacity-40" @click="showDetails = false"></div>
      <div class="w-full max-w-md h-full bg-white shadow-lg p-8 relative animate-slide-in-right overflow-y-auto">
        <button class="absolute top-2 right-2 text-gray-500" @click="showDetails = false">&times;</button>
        <h3 class="text-lg font-bold mb-4">Détails de la demande</h3>
        <div v-if="selectedDemande">
          <div class="mb-4 flex flex-col items-center">
            <span class="font-bold text-xl">Dr. {{ selectedDemande.nom }} {{ selectedDemande.prenom }}</span>
          </div>
          <div class="mb-2"><b>Téléphone :</b> {{ selectedDemande.telephone }}</div>
          <div class="mb-2"><b>Email :</b> {{ selectedDemande.email }}</div>
          <div class="mb-2"><b>Spécialité :</b> {{ selectedDemande.specialite }}</div>
          <div class="mb-2"><b>Matricule :</b> {{ selectedDemande.matricule }}</div>
          <div class="flex gap-4 mt-6">
            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold flex-1"
              @click="accepterDemande(selectedDemande)">Approuver</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold flex-1"
              @click="refuserDemande(selectedDemande)">Refuser</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Stethoscope } from 'lucide-vue-next'

const search = ref('')
const demandes = ref([])
const showDetails = ref(false)
const selectedDemande = ref(null)

const totalDemandes = computed(() => demandes.value.length)

const filteredDemandes = computed(() => {
  if (!search.value) return demandes.value
  return demandes.value.filter(d =>
    d.nom?.toLowerCase().includes(search.value.toLowerCase()) ||
    d.prenom?.toLowerCase().includes(search.value.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.value.toLowerCase()) ||
    d.specialite?.toLowerCase().includes(search.value.toLowerCase()) ||
    d.matricule?.toLowerCase().includes(search.value.toLowerCase())
  )
})

// API endpoint
const API_URL = '/ListeDemande'

// Appel API pour récupérer les demandes
async function fetchDemandes() {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Erreur de récupération des données')
    const data = await response.json()
    const list = Array.isArray(data) ? data : (data.demandes || [])

    // Mapper les champs de l'API vers ceux attendus dans le template
    demandes.value = list.map(d => ({
      ...d,
      id: d.id,
      nom: d.firstName || d.first_name || d.nom,
      prenom: d.lastName || d.last_name || d.prenom,
      telephone: d.phone || d.telephone,
      specialite: d.specialisation || d.speciality || d.specialite,
      matricule: d.licenseNumber || d.license_number,
      status: d.status || 'pending',
      type: d.type || null,
      profileImage: d.profileImage || d.profile_image || null,
      accountStatus: d.accountStatus || d.account_status || null,
      expoPushToken: d.expoPushToken || d.expo_push_token || null,
      address: d.address || null,
      roleId: d.roleId || d.role_id || null,
      createdAt: d.createdAt || d.created_at || null,
      updatedAt: d.updatedAt || d.updated_at || null,
      dateNaissance: d.dateNaissance || d.date_naissance || null,
      about: d.about || null,
      groupeSanguin: d.groupeSanguin || d.groupe_sanguin || null,
      anneeExperience: d.anneeExperience || d.annee_experience || null,
      genre: d.genre || null,
      weight: d.weight || null,
    }))
  } catch (err) {
    console.error('Erreur API:', err)
  }
}

onMounted(fetchDemandes)

// Actions
async function accepterDemande(demande) {
  try {
    const response = await fetch(`/demandes-docteurs/approve/${demande.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
           "x-app-key": "boulinguiboulingui"
      },
    })

    if (!response.ok) throw new Error('Erreur lors de l\'approbation')

    alert('Demande approuvée pour ' + demande.nom)
    demandes.value = demandes.value.filter(d => d.id !== demande.id)
    showDetails.value = false
  } catch (err) {
    console.error(err)
    alert('Erreur lors de l\'approbation de la demande.')
  }
}

async function refuserDemande(demande) {
  try {
    const response = await fetch(`/demandes-docteurs/reject/${demande.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-app-key": "boulinguiboulingui"
      },
    })

    if (!response.ok) throw new Error('Erreur lors du refus')

    alert('Demande refusée pour ' + demande.nom)
    demandes.value = demandes.value.filter(d => d.id !== demande.id)
    showDetails.value = false
  } catch (err) {
    console.error(err)
    alert('Erreur lors du refus de la demande.')
  }
}


function voirDetails(demande) {
  selectedDemande.value = demande
  showDetails.value = true
}

// menu state for inline actions
const openMenuId = ref(null)
function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function statusClass(status) {
  if (!status) return 'bg-yellow-100 text-yellow-800'
  const s = String(status).toLowerCase()
  if (s === 'approved') return 'bg-green-100 text-green-800'
  if (s === 'rejected') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800'
}
</script>


<style scoped>
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.animate-slide-in-right {
  animation: slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
