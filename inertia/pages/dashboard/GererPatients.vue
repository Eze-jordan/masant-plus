<script setup>
import { ref, computed } from 'vue'
import { User } from 'lucide-vue-next'

const props = defineProps({
  user: Object,
  users: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const search = ref('')
const openMenu = ref(null)
const showDetails = ref(false)
const selectedPatient = ref(null)
const isEditing = ref(false)
const showAddForm = ref(false)

const addForm = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  adresse: '',
  accountStatus: 'active'
})

const patients = ref([...props.users])

const totalPatients = computed(() => patients.value.length)

const filteredPatients = computed(() => {
  if (!search.value) return patients.value
  return patients.value.filter(p =>
    p.lastName?.toLowerCase().includes(search.value.toLowerCase()) ||
    p.firstName?.toLowerCase().includes(search.value.toLowerCase()) ||
    p.phone?.toLowerCase().includes(search.value.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.value.toLowerCase()) ||
    p.adresse?.toLowerCase().includes(search.value.toLowerCase())
  )
})

function toggleMenu(id) {
  openMenu.value = openMenu.value === id ? null : id
}
function voirPlus(patient) {
  selectedPatient.value = { ...patient }
  showDetails.value = true
  isEditing.value = false
  openMenu.value = null
}
function modifier(patient) {
  selectedPatient.value = { ...patient }
  showDetails.value = true
  isEditing.value = true
  openMenu.value = null
}
function supprimer(patient) {
  if (confirm('Supprimer ' + patient.lastName + ' ?')) {
    patients.value = patients.value.filter(p => p.id !== patient.id)
  }
  openMenu.value = null
}
function enregistrerModif() {
  const idx = patients.value.findIndex(p => p.id === selectedPatient.value.id)
  if (idx !== -1) {
    patients.value[idx] = { ...selectedPatient.value }
  }
  showDetails.value = false
}
function ajouterPatient() {
  const nouveau = { ...addForm.value, id: Date.now() }
  patients.value.push(nouveau)
  showAddForm.value = false
  addForm.value = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    adresse: '',
    accountStatus: 'active'
  }
}
</script>

<template>
  <div>
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">Paramètre des patients</h2>
        <div class="mt-2 flex items-center gap-4">
          <div class="bg-white rounded shadow p-4 flex items-center gap-2">
            <span class="font-bold text-2xl">{{ totalPatients }}</span>
            <User class="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un patient"
          class="px-4 py-2 border rounded-md"
        />
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold" @click="showAddForm = true">
          + Ajouter un patient
        </button>
      </div>
    </div>

    <!-- Tableau des patients -->
    <div class="bg-white rounded shadow p-4">
      <h3 class="font-bold mb-4">Liste des patients</h3>
      <table class="w-full text-left">
        <thead>
          <tr class="border-b">
            <th class="py-2 px-2"><input type="checkbox" /></th>
            <th class="py-2 px-2">Nom</th>
            <th class="py-2 px-2">Prénom</th>
            <th class="py-2 px-2">Téléphone</th>
            <th class="py-2 px-2">Email</th>
            <th class="py-2 px-2">Adresse</th>
            <th class="py-2 px-2">Statut</th>
            <th class="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="patient in filteredPatients"
            :key="patient.id"
            class="border-b hover:bg-gray-100"
          >
            <td class="py-2 px-2"><input type="checkbox" /></td>
            <td class="py-2 px-2 font-bold">{{ patient.lastName }}</td>
            <td class="py-2 px-2">{{ patient.firstName }}</td>
            <td class="py-2 px-2">{{ patient.phone }}</td>
            <td class="py-2 px-2">{{ patient.email }}</td>
            <td class="py-2 px-2">{{ patient.adresse }}</td>
            <td class="py-2 px-2">
              <span
                :class="[ 'px-3 py-1 rounded-full text-xs font-semibold',
                  patient.accountStatus?.toLowerCase() === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-700'
                ]"
              >
                {{ patient.accountStatus }}
              </span>
            </td>
            <td class="py-2 px-2 relative">
              <button @click="toggleMenu(patient.id)" class="px-2 py-1 rounded hover:bg-gray-200">...</button>
              <div
                v-if="openMenu === patient.id"
                class="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10"
              >
                <ul>
                  <li class="px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="voirPlus(patient)">Voir plus</li>
                  <li class="px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="modifier(patient)">Modifier</li>
                  <li class="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer" @click="supprimer(patient)">Supprimer</li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Panneau latéral détails/modif -->
    <div v-if="showDetails" class="fixed inset-0 z-50 flex">
      <div class="flex-1 bg-black bg-opacity-40" @click="showDetails = false"></div>
      <div class="w-full max-w-md h-full bg-white shadow-lg p-8 relative animate-slide-in-right overflow-y-auto">
        <button class="absolute top-2 right-2 text-gray-500" @click="showDetails = false">&times;</button>
        <h3 class="text-lg font-bold mb-4">
          {{ isEditing ? 'Modifier le patient' : 'Détails du patient' }}
        </h3>
        <form v-if="isEditing" @submit.prevent="enregistrerModif">
          <div class="mb-4">
            <label class="block mb-1">Nom</label>
            <input v-model="selectedPatient.lastName" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Prénom</label>
            <input v-model="selectedPatient.firstName" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Téléphone</label>
            <input v-model="selectedPatient.phone" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Email</label>
            <input v-model="selectedPatient.email" type="email" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Adresse</label>
            <input v-model="selectedPatient.adresse" type="text" class="w-full border rounded px-3 py-2" />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Statut</label>
            <select v-model="selectedPatient.accountStatus" class="w-full border rounded px-3 py-2" required>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold w-full">
            Enregistrer
          </button>
        </form>
        <div v-else>
          <div class="mb-4 flex flex-col items-center">
            <span class="font-bold text-xl">{{ selectedPatient.lastName }} {{ selectedPatient.firstName }}</span>
          </div>
          <div class="mb-2"><b>Téléphone :</b> {{ selectedPatient.phone }}</div>
          <div class="mb-2"><b>Email :</b> {{ selectedPatient.email }}</div>
          <div class="mb-2"><b>Adresse :</b> {{ selectedPatient.adresse }}</div>
          <div class="mb-2"><b>Statut :</b> {{ selectedPatient.accountStatus }}</div>
          <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold w-full"
            @click="isEditing = true">
            Modifier
          </button>
        </div>
      </div>
    </div>

    <!-- Formulaire ajout -->
    <div v-if="showAddForm" class="fixed inset-0 z-50 flex">
      <div class="flex-1 bg-black bg-opacity-40" @click="showAddForm = false"></div>
      <div class="w-full max-w-md h-full bg-white shadow-lg p-8 relative animate-slide-in-right overflow-y-auto">
        <button class="absolute top-2 right-2 text-gray-500" @click="showAddForm = false">&times;</button>
        <h3 class="text-lg font-bold mb-4">Ajouter un patient</h3>
        <form @submit.prevent="ajouterPatient">
          <div class="mb-4">
            <label class="block mb-1">Nom</label>
            <input v-model="addForm.lastName" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Prénom</label>
            <input v-model="addForm.firstName" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Téléphone</label>
            <input v-model="addForm.phone" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Email</label>
            <input v-model="addForm.email" type="email" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Adresse</label>
            <input v-model="addForm.adresse" type="text" class="w-full border rounded px-3 py-2" />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Statut</label>
            <select v-model="addForm.accountStatus" class="w-full border rounded px-3 py-2" required>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold w-full">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

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
