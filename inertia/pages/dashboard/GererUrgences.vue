<template>
  <div>
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">Paramètre des urgence</h2>
        <div class="mt-2 flex items-center gap-4">
          <div class="bg-white rounded shadow p-4 flex items-center gap-2">
            <span class="font-bold text-2xl">{{ totalUrgences }}</span>
            <Calendar class="w-6 h-6 text-blue-500" />
          </div>
          <div class="bg-green-100 rounded shadow p-4 flex items-center gap-2">
            <span class="font-bold text-2xl text-green-700">{{ urgencesAffectees }}</span>
            <span class="text-green-700 font-semibold">Affectations</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher une urgence"
          class="px-4 py-2 border rounded-md"
        />
      </div>
    </div>

    <!-- Grille des urgences -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="urgence in filteredUrgences"
        :key="urgence.id"
        class="relative bg-white border-l-8 border-red-500 rounded-lg shadow-lg p-6 flex flex-col transition hover:shadow-2xl"
      >
        <!-- Menu d'actions -->
        <div class="absolute top-4 right-1 z-20">
          <button @click="toggleMenu(urgence.id)" class="text-gray-500 hover:text-red-500 text-xl font-bold px-2 py-1 rounded-full focus:outline-none">
            ⋮
          </button>
          <div
            v-if="openMenu === urgence.id"
            class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow z-30"
          >
            <ul>
              <li class="px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="voirPlus(urgence)">Voir plus</li>
              <li class="px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="affecterMedecinPanel(urgence)">Affecter un médecin</li>
              <li class="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer" @click="supprimer(urgence)">Supprimer</li>
            </ul>
          </div>
        </div>

        <!-- Infos principales -->
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-red-600 flex items-center gap-2">
            <Calendar class="w-5 h-5" /> Urgence
          </div>
          <span class="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
            {{ urgence.type === 'video' ? 'Vidéo' : 'Téléphone' }}
          </span>
        </div>

        <div class="flex justify-between gap-4 mb-2">
          <div>
            <div class="text-xs text-gray-500">Patient</div>
            <div class="font-semibold">{{ urgence.patient.nom }} {{ urgence.patient.prenom }}</div>
            <div class="text-xs text-gray-400">{{ urgence.patient.telephone }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">Docteur</div>
            <div class="font-semibold">{{ urgence.docteur.nom }} {{ urgence.docteur.prenom }}</div>
            <div class="text-xs text-gray-400">{{ urgence.docteur.telephone }}</div>
          </div>
        </div>

        <div class="mt-2 text-sm text-gray-700">
          <div><span class="font-semibold">Date :</span> {{ urgence.date }}</div>
        </div>
      </div>
    </div>

    <!-- Panneau latéral Détails -->
    <div v-if="showDetails" class="fixed inset-0 z-50 flex">
      <div class="flex-1 bg-black bg-opacity-40" @click="showDetails = false"></div>
      <div class="w-full max-w-md h-full bg-white shadow-lg p-8 relative animate-slide-in-right overflow-y-auto">
        <button class="absolute top-2 right-2 text-gray-500" @click="showDetails = false">&times;</button>
        <h3 class="text-lg font-bold mb-4 text-red-600">Détails de l'urgence</h3>
        <div v-if="selectedUrgence">
          <div class="mb-2"><b>Patient :</b> {{ selectedUrgence.patient.nom }} {{ selectedUrgence.patient.prenom }}</div>
          <div class="mb-2"><b>Téléphone patient :</b> {{ selectedUrgence.patient.telephone }}</div>
          <div class="mb-2"><b>Docteur :</b> {{ selectedUrgence.docteur.nom }} {{ selectedUrgence.docteur.prenom }}</div>
          <div class="mb-2"><b>Téléphone docteur :</b> {{ selectedUrgence.docteur.telephone }}</div>
          <div class="mb-2"><b>Date :</b> {{ selectedUrgence.date }}</div>
          <div class="mb-2"><b>Type :</b> <span class="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">{{ selectedUrgence.type }}</span></div>
        </div>
      </div>
    </div>

    <!-- Panneau latéral Affecter un médecin -->
    <div v-if="showAffecter" class="fixed inset-0 z-50 flex">
      <div class="flex-1 bg-black bg-opacity-40" @click="showAffecter = false"></div>
      <div class="w-full max-w-md h-full bg-white shadow-lg p-8 relative animate-slide-in-right overflow-y-auto">
        <button class="absolute top-2 right-2 text-gray-500" @click="showAffecter = false">&times;</button>
        <h3 class="text-lg font-bold mb-4 text-red-600">Affecter un médecin</h3>
        <form @submit.prevent="affecterMedecin">
          <div class="mb-4">
            <label class="block mb-1 font-semibold">Médecin à affecter</label>
            <select v-model="medecinSelectionne" class="w-full border rounded px-3 py-2" required>
              <option :value="null" disabled>Sélectionner un médecin</option>
              <option v-for="med in medecinsDisponibles" :key="med.id" :value="med">
                {{ med.nom }} {{ med.prenom }}
              </option>
            </select>
          </div>
          <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold">Affecter</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar } from 'lucide-vue-next'

const search = ref('')
const openMenu = ref(null)
const showDetails = ref(false)
const showEdit = ref(false)
const showAffecter = ref(false)
const selectedUrgence = ref(null)
const medecinSelectionne = ref(null)
const urgencesAffectees = ref(0)

const urgences = ref([
  {
    id: 1,
    patient: { nom: 'DIALLO', prenom: 'Fatou', telephone: '0700000000' },
    docteur: { nom: 'IGAMBA', prenom: 'Paul', telephone: '0788888888' },
    date: '2024-06-10 14:00',
    type: 'video'
  },
  // Ajoute d'autres urgences ici
])

const totalUrgences = computed(() => urgences.value.length)

const filteredUrgences = computed(() => {
  if (!search.value) return urgences.value
  return urgences.value.filter(u =>
    u.patient.nom.toLowerCase().includes(search.value.toLowerCase()) ||
    u.patient.prenom.toLowerCase().includes(search.value.toLowerCase()) ||
    u.docteur.nom.toLowerCase().includes(search.value.toLowerCase()) ||
    u.docteur.prenom.toLowerCase().includes(search.value.toLowerCase()) ||
    u.date.toLowerCase().includes(search.value.toLowerCase()) ||
    u.type.toLowerCase().includes(search.value.toLowerCase())
  )
})

const medecinsDisponibles = ref([
  { id: 1, nom: 'IGAMBA', prenom: 'Paul' },
  { id: 2, nom: 'KONE', prenom: 'Awa' },
  // Ajoute d'autres médecins ici
])

function toggleMenu(id) {
  openMenu.value = openMenu.value === id ? null : id
}
function voirPlus(urgence) {
  selectedUrgence.value = { ...urgence }
  showDetails.value = true
  openMenu.value = null
}
function affecterMedecinPanel(urgence) {
  selectedUrgence.value = { ...urgence }
  showAffecter.value = true
  openMenu.value = null
  // Sélectionne le premier médecin par défaut si la liste n'est pas vide
  if (medecinsDisponibles.value.length > 0) {
    medecinSelectionne.value = medecinsDisponibles.value[0]
  } else {
    medecinSelectionne.value = null
  }
}
function supprimer(urgence) {
  if (confirm('Supprimer cette urgence ?')) {
    urgences.value = urgences.value.filter(u => u.id !== urgence.id)
  }
  openMenu.value = null
}
function validerModification() {
  // Ici tu peux faire un appel API ou mettre à jour la liste localement
  showEdit.value = false
}
function affecterMedecin() {
  if (medecinSelectionne.value && selectedUrgence.value) {
    // Met à jour la liste principale (retire l'urgence)
    urgences.value = urgences.value.filter(u => u.id !== selectedUrgence.value.id)
    urgencesAffectees.value++
    showAffecter.value = false
    medecinSelectionne.value = null
  }
}
</script>