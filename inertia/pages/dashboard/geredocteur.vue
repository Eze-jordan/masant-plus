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

    <!-- Formulaire d'ajout de docteur -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex">
      <div class="flex-1 bg-black bg-opacity-40" @click="showForm = false"></div>
      <div class="w-full max-w-md h-full bg-white shadow-lg p-8 relative animate-slide-in-right">
        <button class="absolute top-2 right-2 text-gray-500" @click="showForm = false">&times;</button>
        <h3 class="text-lg font-bold mb-4">Ajouter un Docteur</h3>
        <form @submit.prevent="ajouterDocteur">
          <!-- Form fields for adding a doctor -->
        </form>
      </div>
    </div>

    <!-- Tableau des docteurs -->
    <div class="bg-white rounded shadow p-4">
      <h3 class="font-bold mb-4">Liste des docteurs et spécialités</h3>
      <table class="w-full text-left">
        <thead>
          <tr class="border-b">
            <th class="py-2 px-2">Nom</th>
            <th class="py-2 px-2">Prenom</th>
            <th class="py-2 px-2">Telephone</th>
            <th class="py-2 px-2">Email</th>
            <th class="py-2 px-2">Spécialité</th>
            <th class="py-2 px-2">Matricule</th>
            <th class="py-2 px-2">Statut</th>
            <th class="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through docteurs and render each row -->
          <tr
            v-for="docteur in filteredDocteurs"
            :key="docteur.id"
            v-if="docteur && docteur.id"
            class="border-b hover:bg-gray-100"
          >
            <td class="py-2 px-2">{{ docteur.nom }}</td> <!-- nom (mapped from firstName) -->
            <td class="py-2 px-2">{{ docteur.prenom }}</td> <!-- prenom (mapped from lastName) -->
            <td class="py-2 px-2">{{ docteur.telephone }}</td>
            <td class="py-2 px-2">{{ docteur.email }}</td>
            <td class="py-2 px-2">{{ docteur.specialite }}</td>
            <td class="py-2 px-2">{{ docteur.matricule }}</td>
            <td class="py-2 px-2">{{ docteur.statut }}</td>
            <td class="py-2 px-2 relative">
              <button @click="toggleMenu(docteur.id)" class="px-2 py-1 rounded hover:bg-gray-200">...</button>
              <div v-if="openMenu === docteur.id" class="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                <ul>
                  <li class="px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="voirPlus(docteur)">Voir plus</li>
                  <li class="px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="modifier(docteur)">Modifier</li>
                  <li class="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer" @click="supprimer(docteur)">Supprimer</li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Stethoscope } from 'lucide-vue-next'

const props = defineProps({
  users: {
    type: Array,
    default: () => []  // Default to an empty array if no value is passed
  }
})

const search = ref('')
const openMenu = ref(null)
const showForm = ref(false)

// Total count of doctors
const totalDocteurs = computed(() => props.users ? props.users.length : 0)

// Filtered doctors based on search input
const filteredDocteurs = computed(() => {
  if (!search.value) return mappedUsers.value  // use mapped users for consistency
  return mappedUsers.value.filter(d =>
    d.nom.toLowerCase().includes(search.value.toLowerCase()) ||
    d.prenom.toLowerCase().includes(search.value.toLowerCase()) ||
    d.email.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Mapping the user data to match the expected table fields
const mappedUsers = computed(() => {
  return props.users.map(user => ({
    ...user,
    nom: user.firstName,   // Mapping firstName to nom
    prenom: user.lastName, // Mapping lastName to prenom
  }))
})
console.log("nklendzejndzejnd",mappedUsers,"dd")
function toggleMenu(id) {
  openMenu.value = openMenu.value === id ? null : id
}

function voirPlus(docteur) {
  alert('Voir plus sur ' + docteur.nom)
  openMenu.value = null
}

function modifier(docteur) {
  alert('Modifier ' + docteur.nom)
  openMenu.value = null
}

function supprimer(docteur) {
  if (confirm('Supprimer ' + docteur.nom + ' ?')) {
    props.users = props.users.filter(d => d.id !== docteur.id)
  }
  openMenu.value = null
}

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  statut: 'Actif',
  photo: '/doctor1.jpg'
})

function ajouterDocteur() {
  const nouveau = { ...form.value, id: Date.now() }
  props.users.push(nouveau)
  showForm.value = false
  form.value = { nom: '', prenom: '', telephone: '', email: '', statut: 'Actif', specialite: '', matricule: '', photo: '/doctor1.jpg' }
}
</script>
