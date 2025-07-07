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
            <th class="py-2 px-2">Prenom</th>
            <th class="py-2 px-2">Telephone</th>
            <th class="py-2 px-2">Email</th>
            <th class="py-2 px-2">Spécialité</th>
            <th class="py-2 px-2">Matricule</th>
            <th class="py-2 px-2"></th>
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
            <td class="py-2 px-2">{{ demande.lastName }}</td>
            <td class="py-2 px-2">{{ demande.telephone }}</td>
            <td class="py-2 px-2">{{ demande.email }}</td>
            <td class="py-2 px-2">{{ demande.specialite }}</td>
            <td class="py-2 px-2">{{ demande.matricule }}</td>
            <td class="py-2 px-2 flex gap-2">
              <button
                class="text-blue-600 text-xl font-bold"
                @click="voirDetails(demande)"
              >+</button>
              <button class="text-red-600 text-xl font-bold" @click="refuserDemande(demande)">−</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Panneau latéral de détails de la demande -->
    <div v-if="showDetails" class="fixed inset-0 z-50 flex">
      <div class="flex-1 bg-black bg-opacity-40" @click="showDetails = false"></div>
      <div class="w-full max-w-md h-full bg-white shadow-lg p-8 relative animate-slide-in-right overflow-y-auto">
        <button class="absolute top-2 right-2 text-gray-500" @click="showDetails = false">&times;</button>
        <h3 class="text-lg font-bold mb-4">Détails de la demande</h3>
        <div v-if="selectedDemande">
          <div class="mb-4 flex flex-col items-center">
            <span class="font-bold text-xl">Dr. {{ selectedDemande.firstName }} {{ selectedDemande.lastName }}</span>
          </div>
          <div class="mb-2"><b>Telephone :</b> {{ selectedDemande.phone }}</div>
          <div class="mb-2"><b>Email :</b> {{ selectedDemande.email }}</div>
          <div class="mb-2"><b>Spécialité :</b> {{ selectedDemande.specialite }}</div>
          <div class="mb-2"><b>Matricule :</b> {{ selectedDemande.matricule }}</div>
          <!-- Boutons d'action -->
          <div class="flex gap-4 mt-6">
            <button
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold flex-1"
              @click="accepterDemande(selectedDemande)"
            >Approuver</button>
            <button
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold flex-1"
              @click="refuserDemande(selectedDemande)"
            >Refuser</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Stethoscope } from 'lucide-vue-next'

const search = ref('')
const props = defineProps({
  demandes: {
    type: Array,
    default: () => []
  }
})

const demandes = ref(props.demandes)

const totalDemandes = computed(() => demandes.value.length)



const filteredDemandes = computed(() => {
  if (!search.value) return demandes.value
  return demandes.value.filter(d =>
    d.nom.toLowerCase().includes(search.value.toLowerCase()) ||
    d.prenom.toLowerCase().includes(search.value.toLowerCase()) ||
    d.email.toLowerCase().includes(search.value.toLowerCase()) ||
    d.specialite.toLowerCase().includes(search.value.toLowerCase()) ||
    d.matricule.toLowerCase().includes(search.value.toLowerCase())
  )
})

const showDetails = ref(false)
const selectedDemande = ref(null)

// Actions sur les demandes
function accepterDemande(demande) {
  alert('Demande acceptée pour ' + demande.nom)
  demandes.value = demandes.value.filter(d => d.id !== demande.id)
  showDetails.value = false
}
function refuserDemande(demande) {
  alert('Demande refusée pour ' + demande.nom)
  demandes.value = demandes.value.filter(d => d.id !== demande.id)
  showDetails.value = false
}

function voirDetails(demande) {
  selectedDemande.value = demande
  showDetails.value = true
}
</script>

<style scoped>
@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1);
}
</style>
