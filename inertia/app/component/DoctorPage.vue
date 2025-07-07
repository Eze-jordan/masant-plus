<template>
    <div class="flex-1 p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-6">
          <h1 class="text-2xl font-bold text-gray-800">Paramètre des médecins</h1>
          
          <div class="flex items-center gap-4 bg-white p-4 rounded-lg border">
            <div class="text-center">
              <div class="text-sm text-gray-600">Total Docteurs</div>
              <div class="text-2xl font-bold">600</div>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <button class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </button>
          <button class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </button>
          <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
      </div>
  
      <!-- Search and Add Button -->
      <div class="flex items-center justify-between mb-6">
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Rechercher un Docteur par Mat..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        
        <button @click="showCreateModal = true" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Ajouter un Docteur
        </button>
      </div>
  
      <!-- Doctors List -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold">{{ pageType === 'requests' ? 'Liste des demandes de compte' : 'Liste des docteurs et spécialités' }}</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left">
                  <input type="checkbox" class="rounded" @change="selectAll">
                </th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('nom')">
                  Nom ↕
                </th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('prenom')">
                  Prénom ↕
                </th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('email')">
                  Email ↕
                </th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('specialite')">
                  Spécialité ↕
                </th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('matricule')">
                  Matricule ↕
                </th>
                <th class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="doctor in filteredDoctors" :key="doctor.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <input type="checkbox" class="rounded" v-model="doctor.selected">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                      <span class="text-gray-600 font-medium">{{ doctor.nom.charAt(0) }}</span>
                    </div>
                    <div class="font-medium text-gray-900">{{ doctor.nom }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">
                  {{ doctor.prenom }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">
                  {{ doctor.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">
                  {{ doctor.specialite }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">
                  {{ doctor.matricule }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div v-if="pageType === 'requests'" class="flex items-center justify-center gap-2">
                    <button @click="approveDoctor(doctor.id)" class="w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center justify-center">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </button>
                    <button @click="rejectDoctor(doctor.id)" class="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <div v-else class="relative">
                    <button @click="toggleDropdown(doctor.id)" class="p-1 hover:bg-gray-100 rounded">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                      </svg>
                    </button>
                    <div v-if="activeDropdown === doctor.id" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                      <button @click="viewDoctor(doctor)" class="w-full text-left px-4 py-2 hover:bg-gray-50 text-blue-600">Voir plus</button>
                      <button @click="editDoctor(doctor)" class="w-full text-left px-4 py-2 hover:bg-gray-50">Modifier</button>
                      <button @click="deleteDoctor(doctor.id)" class="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600">Supprimer</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 flex items-center justify-between border-t">
          <div class="text-sm text-gray-500">
            Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, totalItems) }} sur {{ totalItems }} résultats
          </div>
          <div class="flex items-center gap-2">
            <button @click="previousPage" :disabled="currentPage === 1" class="p-2 hover:bg-gray-100 rounded disabled:opacity-50">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
              </svg>
            </button>
            <span class="px-3 py-1">{{ currentPage }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="p-2 hover:bg-gray-100 rounded disabled:opacity-50">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Create Doctor Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 w-full max-w-md mx-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Création du docteur</h2>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="createDoctor" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom :</label>
              <input v-model="newDoctor.nom" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prénom :</label>
              <input v-model="newDoctor.prenom" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Telephone :</label>
              <input v-model="newDoctor.telephone" type="tel" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email :</label>
              <input v-model="newDoctor.email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Spécialité :</label>
              <input v-model="newDoctor.specialite" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Matricule :</label>
              <input v-model="newDoctor.matricule" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
              <button type="button" class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Choose file
              </button>
              <p class="text-xs text-gray-500 mt-1">Image (4MG)</p>
            </div>
            
            <button type="submit" class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
              Créer le docteur
            </button>
          </form>
        </div>
      </div>
  
      <!-- Edit Doctor Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 w-full max-w-md mx-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Modification du docteur</h2>
            <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="updateDoctor" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom :</label>
              <input v-model="editingDoctor.nom" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prénom :</label>
              <input v-model="editingDoctor.prenom" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Telephone :</label>
              <input v-model="editingDoctor.telephone" type="tel" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email :</label>
              <input v-model="editingDoctor.email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Spécialité :</label>
              <input v-model="editingDoctor.specialite" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Matricule :</label>
              <input v-model="editingDoctor.matricule" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
              <button type="button" class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Choose file
              </button>
              <p class="text-xs text-gray-500 mt-1">Image (4MG)</p>
            </div>
            
            <button type="submit" class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DoctorsPage',
    props: {
      pageType: {
        type: String,
        default: 'manage' // 'manage' or 'requests'
      }
    },
    data() {
      return {
        searchQuery: '',
        activeDropdown: null,
        showCreateModal: false,
        showEditModal: false,
        currentPage: 1,
        itemsPerPage: 10,
        sortField: '',
        sortDirection: 'asc',
        newDoctor: {
          nom: '',
          prenom: '',
          telephone: '',
          email: '',
          specialite: '',
          matricule: ''
        },
        editingDoctor: {
          id: null,
          nom: '',
          prenom: '',
          telephone: '',
          email: '',
          specialite: '',
          matricule: ''
        },
        doctors: [
          {
            id: 1,
            nom: 'Dr. IGAMBA',
            prenom: 'Paul',
            email: 'paul.igamba@email.com',
            specialite: 'Cardiologie',
            matricule: 'MAT001',
            telephone: '+33123456789',
            selected: false
          },
          {
            id: 2,
            nom: 'Dr. MARTIN',
            prenom: 'Sophie',
            email: 'sophie.martin@email.com',
            specialite: 'Pédiatrie',
            matricule: 'MAT002',
            telephone: '+33123456790',
            selected: false
          },
          {
            id: 3,
            nom: 'Dr. BERNARD',
            prenom: 'Marie',
            email: 'marie.bernard@email.com',
            specialite: 'Dermatologie',
            matricule: 'MAT003',
            telephone: '+33123456791',
            selected: false
          }
        ]
      }
    },
    computed: {
      filteredDoctors() {
        let filtered = this.doctors.filter(doctor => 
          doctor.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doctor.prenom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doctor.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doctor.matricule.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        
        if (this.sortField) {
          filtered.sort((a, b) => {
            let aVal = a[this.sortField]
            let bVal = b[this.sortField]
            
            if (this.sortDirection === 'asc') {
              return aVal > bVal ? 1 : -1
            } else {
              return aVal < bVal ? 1 : -1
            }
          })
        }
        
        const start = (this.currentPage - 1) * this.itemsPerPage
        const end = start + this.itemsPerPage
        return filtered.slice(start, end)
      },
      totalItems() {
        return this.doctors.length
      },
      totalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage)
      }
    },
    methods: {
      toggleDropdown(doctorId) {
        this.activeDropdown = this.activeDropdown === doctorId ? null : doctorId
      },
      
      sortBy(field) {
        if (this.sortField === field) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortField = field
          this.sortDirection = 'asc'
        }
      },
      
      selectAll(event) {
        this.filteredDoctors.forEach(doctor => {
          doctor.selected = event.target.checked
        })
      },
      
      createDoctor() {
        const doctor = {
          id: Date.now(),
          ...this.newDoctor,
          selected: false
        }
        this.doctors.push(doctor)
        this.showCreateModal = false
        this.resetNewDoctor()
      },
      
      editDoctor(doctor) {
        this.editingDoctor = { ...doctor }
        this.showEditModal = true
        this.activeDropdown = null
      },
      
      updateDoctor() {
        const index = this.doctors.findIndex(d => d.id === this.editingDoctor.id)
        if (index !== -1) {
          this.doctors[index] = { ...this.editingDoctor }
        }
        this.showEditModal = false
      },
      
      viewDoctor(doctor) {
        console.log('Viewing doctor:', doctor)
        this.activeDropdown = null
      },
      
      deleteDoctor(doctorId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce docteur ?')) {
          this.doctors = this.doctors.filter(d => d.id !== doctorId)
        }
        this.activeDropdown = null
      },
      
      approveDoctor(doctorId) {
        console.log('Approving doctor:', doctorId)
        // Handle approval logic
      },
      
      rejectDoctor(doctorId) {
        console.log('Rejecting doctor:', doctorId)
        // Handle rejection logic
      },
      
      resetNewDoctor() {
        this.newDoctor = {
          nom: '',
          prenom: '',
          telephone: '',
          email: '',
          specialite: '',
          matricule: ''
        }
      },
      
      previousPage() {
        if (this.currentPage > 1) {
          this.currentPage--
        }
      },
      
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++
        }
      }
    },
    mounted() {
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
          this.activeDropdown = null
        }
      })
    }
  }
  </script>