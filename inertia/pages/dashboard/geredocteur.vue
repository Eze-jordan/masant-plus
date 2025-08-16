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
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold"
          @click="showForm = true"
        >
          + Ajouter un Docteur
        </button>
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="docteur in filteredDocteurs" :key="docteur.id" class="hover:bg-gray-50">
            <td class="py-2 px-2 border border-gray-200">{{ docteur.lastName || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.firstName || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.email || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.phone || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.specialty || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.registrationNumber || 'N/A' }}</td>
            <td class="py-2 px-2 border border-gray-200">{{ docteur.accountStatus || 'Pending' }}</td>
          </tr>
          <tr v-if="filteredDocteurs.length === 0">
            <td colspan="7" class="py-4 text-center text-gray-500">Aucun docteur trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Données
const docteurs = ref([])

// Recherche
const search = ref('')

// Compteur total docteurs
const totalDocteurs = computed(() => docteurs.value.length)

// Chargement des docteurs via l’API /alldoctors au montage
onMounted(async () => {
  try {
    const response = await fetch('/alldoctors')
    if (!response.ok) throw new Error('Erreur lors de la récupération des docteurs')

    // Récupérer les données et ajouter champs manquants par défaut
    const data = await response.json()
    console.log(data)
    docteurs.value = data.map(d => ({
      phone: '',
      specialty: '',
      registrationNumber: '',
      accountStatus: 'Pending',
      ...d,
    }))
  } catch (error) {
    console.error(error)
  }
})

// Computed : liste filtrée selon la recherche
const filteredDocteurs = computed(() => {
  const q = search.value.toLowerCase()
  return docteurs.value.filter(d =>
    d.firstName?.toLowerCase().includes(q) ||
    d.lastName?.toLowerCase().includes(q) ||
    d.email?.toLowerCase().includes(q) ||
    d.registrationNumber?.toLowerCase().includes(q) ||
    d.phone?.toLowerCase().includes(q) ||
    d.specialty?.toLowerCase().includes(q)
  )
})
</script>

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
