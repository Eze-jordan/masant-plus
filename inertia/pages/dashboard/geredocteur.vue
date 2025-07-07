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
          <div class="mb-4"><label class="block mb-1">Nom</label><input v-model="form.nom" type="text" class="w-full border rounded px-3 py-2" required /></div>
          <div class="mb-4"><label class="block mb-1">Prénom</label><input v-model="form.prenom" type="text" class="w-full border rounded px-3 py-2" required /></div>
          <div class="mb-4"><label class="block mb-1">Téléphone</label><input v-model="form.telephone" type="text" class="w-full border rounded px-3 py-2" required /></div>
          <div class="mb-4"><label class="block mb-1">Email</label><input v-model="form.email" type="email" class="w-full border rounded px-3 py-2" required /></div>
          <div class="mb-4"><label class="block mb-1">Spécialité</label><input v-model="form.specialite" type="text" class="w-full border rounded px-3 py-2" required /></div>
          <div class="mb-4"><label class="block mb-1">Matricule</label><input v-model="form.matricule" type="text" class="w-full border rounded px-3 py-2" required /></div>
          <div class="mb-4">
            <label class="block mb-1">Statut</label>
            <select v-model="form.statut" class="w-full border rounded px-3 py-2" required>
              <option>Actif</option>
              <option>Inactif</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block mb-1">Photo</label>
            <input type="file" @change="onFileChange" class="w-full border rounded px-3 py-2" accept="image/*" />
            <div v-if="form.photo" class="mt-2">
              <img :src="form.photo" alt="Aperçu" class="w-16 h-16 object-cover rounded" />
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
              <span class="font-bold">Dr. {{ docteur.firstName }}</span>
            </td>
            <td class="py-2 px-2">{{ docteur.lastName }}</td>
            <td class="py-2 px-2">{{ docteur.phone }}</td>
            <td class="py-2 px-2">{{ docteur.email }}</td>
            <td class="py-2 px-2">{{ docteur.specialty }}</td>
            <td class="py-2 px-2">{{ docteur.registrationNumber }}</td>
            <td class="py-2 px-2">{{ docteur.accountStatus }}</td>
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
          <div class="mb-4"><label class="block mb-1">Nom</label><input v-model="selectedDocteur.firstName" type="text" class="w-full border rounded px-3 py-2" /></div>
          <div class="mb-4"><label class="block mb-1">Prénom</label><input v-model="selectedDocteur.lastName" type="text" class="w-full border rounded px-3 py-2" /></div>
          <div class="mb-4"><label class="block mb-1">Téléphone</label><input v-model="selectedDocteur.phone" type="text" class="w-full border rounded px-3 py-2" /></div>
          <div class="mb-4"><label class="block mb-1">Email</label><input v-model="selectedDocteur.email" type="email" class="w-full border rounded px-3 py-2" /></div>
          <div class="mb-4"><label class="block mb-1">Spécialité</label><input v-model="selectedDocteur.specialty" type="text" class="w-full border rounded px-3 py-2" /></div>
          <div class="mb-4"><label class="block mb-1">Matricule</label><input v-model="selectedDocteur.registrationNumber" type="text" class="w-full border rounded px-3 py-2" /></div>
          <div class="mb-4"><label class="block mb-1">Statut</label>
            <select v-model="selectedDocteur.statut" class="w-full border rounded px-3 py-2">
              <option>Actif</option>
              <option>Inactif</option>
            </select>
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold w-full">
            Enregistrer
          </button>
        </form>
        <div v-else>
          <div class="mb-4 flex flex-col items-center">
            <img :src="selectedDocteur.profileImage" class="w-24 h-24 rounded-full object-cover mb-2" />
            <span class="font-bold text-xl">Dr. {{ selectedDocteur.firstName }} {{ selectedDocteur.lastName }}</span>
          </div>
          <div class="mb-2"><b>Téléphone :</b> {{ selectedDocteur.phone }}</div>
          <div class="mb-2"><b>Email :</b> {{ selectedDocteur.email }}</div>
          <div class="mb-2"><b>Spécialité :</b> {{ selectedDocteur.specialty }}</div>
          <div class="mb-2"><b>Matricule :</b> {{ selectedDocteur.registrationNumber }}</div>
          <div class="mb-2"><b>Statut :</b> {{ selectedDocteur.accountStatus }}</div>
          <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold w-full"
            @click="isEditing = true">
            Modifier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Stethoscope } from 'lucide-vue-next'

const search = ref('')
const openMenu = ref(null)
const showForm = ref(false)
const showDetails = ref(false)
const selectedDocteur = ref(null)
const isEditing = ref(false)

const props = defineProps({
  user: Object,    // pour l’utilisateur connecté (unique)
  users: {
    type: Array,   // pour la liste des utilisateurs/docteurs
    required: true,
    default: () => []
  }
})


const docteurs = ref(props.users || [])


const totalDocteurs = computed(() => docteurs.value.length)

const filteredDocteurs = computed(() => {
  if (!search.value) return docteurs.value
  return docteurs.value.filter(d =>
    d.nom.toLowerCase().includes(search.value.toLowerCase()) ||
    d.prenom.toLowerCase().includes(search.value.toLowerCase()) ||
    d.email.toLowerCase().includes(search.value.toLowerCase())
  )
})

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
function supprimer(docteur) {
  if (confirm('Supprimer ' + docteur.nom + ' ?')) {
    docteurs.value = docteurs.value.filter(d => d.id !== docteur.id)
  }
  openMenu.value = null
}

const form = ref({
  nom: '',
  prenom: '',
  telephone: '',
  email: '',
  specialite: '',
  matricule: '',
  statut: 'Actif',
  photo: '/doctor1.jpg',
})

function ajouterDocteur() {
  const nouveau = { ...form.value, id: Date.now() }
  docteurs.value.push(nouveau)
  showForm.value = false
  form.value = {
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    specialite: '',
    matricule: '',
    statut: 'Actif',
    photo: '/doctor1.jpg',
  }
}

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      form.value.photo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function enregistrerModif() {
  const idx = docteurs.value.findIndex(d => d.id === selectedDocteur.value.id)
  if (idx !== -1) {
    docteurs.value[idx] = { ...selectedDocteur.value }
  }
  showDetails.value = false
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
