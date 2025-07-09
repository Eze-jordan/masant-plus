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
      <div class="w-full max-w-md h-full bg-white shadow-lg p-8 relative animate-slide-in-right overflow-y-auto">
        <button class="absolute top-2 right-2 text-gray-500" @click="showForm = false">&times;</button>
        <h3 class="text-lg font-bold mb-4">Ajouter un Docteur</h3>
        <form @submit.prevent="ajouterDocteur">
          <div class="mb-4">
            <label class="block mb-1">Nom</label>
            <input v-model="form.lastName" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Prénom</label>
            <input v-model="form.firstName" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Téléphone</label>
            <input v-model="form.phone" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Spécialité</label>
            <input v-model="form.specialty" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Matricule</label>
            <input v-model="form.registrationNumber" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Statut</label>
            <select v-model="form.accountStatus" class="w-full border rounded px-3 py-2" required>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Pending">En attente</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block mb-1">Photo</label>
            <input type="file" @change="onFileChange" class="w-full border rounded px-3 py-2" accept="image/*" />
            <div v-if="form.profileImage" class="mt-2">
              <img :src="form.profileImage" alt="Aperçu" class="w-16 h-16 object-cover rounded" />
            </div>
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold w-full">
            Ajouter
          </button>
        </form>
      </div>
    </div>

    <!-- Tableau des docteurs -->
    <div class="bg-white rounded shadow p-4">
      <h3 class="font-bold mb-4">Liste des docteurs et spécialités</h3>
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
            <th class="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="docteur in filteredDocteurs"
            :key="docteur.id"
            class="border-b hover:bg-gray-100"
          >
            <td class="py-2 px-2"><input type="checkbox" /></td>
            <td class="py-2 px-2 flex items-center gap-2">
              <img :src="docteur.profileImage || '/doctor1.jpg'" class="w-8 h-8 rounded-full object-cover" />
              <span class="font-bold">Dr. {{ docteur.lastName }}</span>
            </td>
            <td class="py-2 px-2">{{ docteur.firstName }}</td>
            <td class="py-2 px-2">{{ docteur.phone }}</td>
            <td class="py-2 px-2">{{ docteur.email }}</td>
            <td class="py-2 px-2">{{ docteur.specialty }}</td>
            <td class="py-2 px-2">{{ docteur.registrationNumber }}</td>
            <td class="py-2 px-2">
              <span
                :class="{
                  'bg-green-100 text-green-800': ['Actif', 'ACTIVE'].includes(docteur.accountStatus),
                  'bg-red-100 text-red-800': ['Inactif', 'INACTIVE'].includes(docteur.accountStatus),
                  'bg-yellow-100 text-yellow-800': ['pending', 'PENDING', 'En attente', 'Pending'].includes(docteur.accountStatus)
                }"
                class="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ statutLabel(docteur.accountStatus) }}
              </span>
            </td>
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

    <!-- Détails / Modifier -->
    <div v-if="showDetails" class="fixed inset-0 z-50 flex">
      <div class="flex-1 bg-black bg-opacity-40" @click="showDetails = false"></div>
      <div class="w-full max-w-md h-full bg-white shadow-lg p-8 relative animate-slide-in-right overflow-y-auto">
        <button class="absolute top-2 right-2 text-gray-500" @click="showDetails = false">&times;</button>
        <h3 class="text-lg font-bold mb-4">{{ isEditing ? 'Modifier le Docteur' : 'Détails du Docteur' }}</h3>
        <form v-if="isEditing" @submit.prevent="enregistrerModif">
          <div class="mb-4">
            <label class="block mb-1">Nom</label>
            <input v-model="selectedDocteur.lastName" type="text" class="w-full border rounded px-3 py-2" />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Prénom</label>
            <input v-model="selectedDocteur.firstName" type="text" class="w-full border rounded px-3 py-2" />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Téléphone</label>
            <input v-model="selectedDocteur.phone" type="text" class="w-full border rounded px-3 py-2" />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Email</label>
            <input v-model="selectedDocteur.email" type="email" class="w-full border rounded px-3 py-2" />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Spécialité</label>
            <input v-model="selectedDocteur.specialty" type="text" class="w-full border rounded px-3 py-2" />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Matricule</label>
            <input v-model="selectedDocteur.registrationNumber" type="text" class="w-full border rounded px-3 py-2" />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Statut</label>
            <select v-model="selectedDocteur.accountStatus" class="w-full border rounded px-3 py-2">
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Pending">En attente</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block mb-1">Photo</label>
            <input type="file" @change="onEditFileChange" class="w-full border rounded px-3 py-2" accept="image/*" />
            <div v-if="selectedDocteur.profileImage" class="mt-2">
              <img :src="selectedDocteur.profileImage" alt="Aperçu" class="w-16 h-16 object-cover rounded" />
            </div>
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold w-full">
            Enregistrer
          </button>
        </form>
        <div v-else>
          <div class="mb-4 flex flex-col items-center">
            <img :src="selectedDocteur.profileImage || '/doctor1.jpg'" class="w-24 h-24 rounded-full object-cover mb-2" />
            <span class="font-bold text-xl">Dr. {{ selectedDocteur.lastName }} {{ selectedDocteur.firstName }}</span>
          </div>
          <div class="mb-2"><b>Téléphone :</b> {{ selectedDocteur.phone }}</div>
          <div class="mb-2"><b>Email :</b> {{ selectedDocteur.email }}</div>
          <div class="mb-2"><b>Spécialité :</b> {{ selectedDocteur.specialty }}</div>
          <div class="mb-2"><b>Matricule :</b> {{ selectedDocteur.registrationNumber }}</div>
          <div class="mb-2">
            <b>Statut :</b>
            <span
              :class="{
                'bg-green-100 text-green-800': ['Actif', 'ACTIVE'].includes(selectedDocteur.accountStatus),
                'bg-red-100 text-red-800': ['Inactif', 'INACTIVE'].includes(selectedDocteur.accountStatus),
                'bg-yellow-100 text-yellow-800': ['pending', 'PENDING', 'En attente', 'Pending'].includes(selectedDocteur.accountStatus)
              }"
              class="px-3 py-1 rounded-full text-xs font-semibold ml-2"
            >
              {{ statutLabel(selectedDocteur.accountStatus) }}
            </span>
          </div>
          <button
            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold w-full"
            @click="isEditing = true"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import { Stethoscope } from 'lucide-vue-next'

// Props
const props = defineProps({
  user: Object,
  users: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Refs
const search = ref('')
const openMenu = ref(null)
const showForm = ref(false)
const showDetails = ref(false)
const isEditing = ref(false)
const selectedDocteur = ref(null)
const photoFile = ref(null)
const editPhotoFile = ref(null)

const docteurs = ref([...props.users])

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  specialty: '',
  registrationNumber: '',
  accountStatus: '',
  role: 'doctor',
  profileImage: ''
})

// Computed
const totalDocteurs = computed(() => docteurs.value.length)

const filteredDocteurs = computed(() => {
  const q = search.value.toLowerCase()
  return docteurs.value.filter(d =>
    (d.lastName?.toLowerCase().includes(q) ||
    (d.firstName?.toLowerCase().includes(q)) ||
    (d.email?.toLowerCase().includes(q)) ||
    (d.registrationNumber?.toLowerCase().includes(q)) ||
    (d.phone?.toLowerCase().includes(q)) ||
    (d.specialty?.toLowerCase().includes(q))
    )) })

// Méthodes
function ajouterDocteur() {
  const formData = new FormData()
  formData.append('firstName', form.value.firstName)
  formData.append('lastName', form.value.lastName)
  formData.append('phone', form.value.phone)
  formData.append('email', form.value.email)
  formData.append('specialty', form.value.specialty)
  formData.append('registrationNumber', form.value.registrationNumber)
  formData.append('accountStatus', form.value.accountStatus)
  formData.append('role', 'doctor')

  if (photoFile.value) {
    formData.append('profileImage', photoFile.value)
  }

  router.post('/register', formData, {
    forceFormData: true,
    headers: {
      'x-app-key': 'boulinguiboulingui',
    },
    onSuccess: () => {
      resetForm()
      showForm.value = false
      // Recharger les données si nécessaire
    },
    onError: (errors) => {
      console.error('Erreur:', errors)
    }
  })
}

function supprimer(docteur) {
  if (confirm(`Supprimer Dr. ${docteur.lastName} ${docteur.firstName} ?`)) {
    router.delete(`/users/${docteur.id}`, {
      onSuccess: () => {
        docteurs.value = docteurs.value.filter(d => d.id !== docteur.id)
        openMenu.value = null
      },
      headers: {
      'x-app-key': 'boulinguiboulingui',
    },
      onError: (errors) => {
        console.error('Erreur lors de la suppression:', errors)
      }
    })
  }
}

function toggleMenu(id) {
  openMenu.value = openMenu.value === id ? null : id
}

function voirPlus(docteur) {
  selectedDocteur.value = { ...docteur }
  showDetails.value = true
  isEditing.value = false
}

function modifier(docteur) {
  selectedDocteur.value = { ...docteur }
  showDetails.value = true
  isEditing.value = true
}

function enregistrerModif() {
  const formData = new FormData()
  formData.append('firstName', selectedDocteur.value.firstName)
  formData.append('lastName', selectedDocteur.value.lastName)
  formData.append('phone', selectedDocteur.value.phone)
  formData.append('email', selectedDocteur.value.email)
  formData.append('specialty', selectedDocteur.value.specialty)
  formData.append('registrationNumber', selectedDocteur.value.registrationNumber)
  formData.append('accountStatus', selectedDocteur.value.accountStatus)

  if (editPhotoFile.value) {
    formData.append('profileImage', editPhotoFile.value)
  }

  router.put(`/user/${selectedDocteur.value.id}`, formData, {
    forceFormData: true,
    headers: {
      'x-app-key': 'boulinguiboulingui',
    },
    onSuccess: () => {
      const index = docteurs.value.findIndex(d => d.id === selectedDocteur.value.id)
      if (index !== -1) {
        docteurs.value[index] = { ...selectedDocteur.value }
      }
      showDetails.value = false
    },
    onError: (errors) => {
      console.error('Erreur lors de la modification:', errors)
    }
  })
}

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    photoFile.value = file
    const reader = new FileReader()
    reader.onload = e => {
      form.value.profileImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function onEditFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    editPhotoFile.value = file
    const reader = new FileReader()
    reader.onload = e => {
      selectedDocteur.value.profileImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function resetForm() {
  form.value = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    specialty: '',
    registrationNumber: '',
    accountStatus: 'pending',
    role: 'doctor',
    profileImage: ''
  }
  photoFile.value = null
}

function statutLabel(status) {
  if (["Actif", "ACTIVE"].includes(status)) return "Actif"
  if (["Inactif", "INACTIVE"].includes(status)) return "Inactif"
  if (["pending", "PENDING", "En attente", "Pending"].includes(status)) return "En attente"
  return status
}
</script>

<style>
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>