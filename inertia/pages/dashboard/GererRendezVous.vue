<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">Liste des rendez-vous</h2>
        <p class="text-sm text-gray-500">Tableau listant tous les rendez-vous</p>
      </div>

      <div class="flex items-center gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher par patient, médecin ou date"
          class="px-4 py-2 border rounded-md w-80"
        />
        <input v-model="selectedDate" type="date" class="px-3 py-2 border rounded-md" :max="maxDate" />
        <select v-model.number="pageSize" class="px-3 py-2 border rounded-md">
          <option v-for="s in pageSizes" :key="s" :value="s">{{ s }} / page</option>
        </select>
      </div>
    </div>

    <div class="bg-white shadow rounded overflow-x-auto">
      <table class="min-w-full text-left">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-sm font-medium">Date début</th>
            <th class="px-4 py-2 text-sm font-medium">Date fin</th>
            <th class="px-4 py-2 text-sm font-medium">Patient</th>
            <th class="px-4 py-2 text-sm font-medium">Médecin</th>
            <th class="px-4 py-2 text-sm font-medium">Type</th>
            <th class="px-4 py-2 text-sm font-medium">État</th>
            <th class="px-4 py-2 text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="px-4 py-6 text-center">Chargement...</td>
          </tr>
          <tr v-else-if="!loading && filteredAppointments.length === 0">
            <td colspan="7" class="px-4 py-6 text-center">Aucun rendez-vous trouvé.</td>
          </tr>
          <tr v-else v-for="apt in pagedAppointments" :key="apt.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ formatDate(apt.dateDebut) }}</td>
            <td class="px-4 py-3 text-sm">{{ formatDate(apt.dateFin) }}</td>
            <td class="px-4 py-3 text-sm">{{ getPatientName(apt) }}</td>
            <td class="px-4 py-3 text-sm">{{ getDoctorName(apt) }}</td>
            <td class="px-4 py-3 text-sm">{{ apt.typeRdv }}</td>
            <td class="px-4 py-3 text-sm">
              <span :class="getStatusClass(apt.etatRdv)">{{ apt.etatRdv }}</span>
            </td>
            <td class="px-4 py-3 text-sm">
              <button @click="openDetails(apt)" class="text-blue-600 hover:underline mr-2">Détails</button>
              <button 
                v-if="apt.etatRdv !== 'ANNULE' && apt.etatRdv !== 'TERMINE'" 
                @click="cancelAppointment(apt.id)" 
                class="text-red-600 hover:underline"
              >
                Annuler
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Affichage {{ startItem }} - {{ endItem }} sur {{ filteredAppointments.length }}
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1" 
          class="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
        >
          Préc
        </button>
        <button 
          v-for="p in pagesToShow" 
          :key="p" 
          @click="goToPage(p)" 
          :class="{
            'px-3 py-1 rounded': true, 
            'bg-blue-600 text-white': p === currentPage, 
            'bg-gray-100': p !== currentPage
          }"
        >
          {{ p }}
        </button>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages" 
          class="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
        >
          Suiv
        </button>
      </div>
    </div>

    <!-- Panneau latéral Détails rendez-vous -->
    <div v-if="showDetails" class="fixed inset-0 z-50 flex">
      <div class="flex-1 bg-black bg-opacity-40" @click="closeDetails"></div>
      <div class="w-full max-w-md h-full bg-white shadow-2xl p-6 relative animate-slide-in-right overflow-y-auto">
        <button class="absolute top-3 right-3 text-gray-500 hover:bg-gray-100 rounded-full p-1" @click="closeDetails">
          &times;
        </button>
        <h3 class="text-xl font-semibold mb-4">Détails du rendez-vous</h3>

        <div v-if="selectedAppointment" class="space-y-4">
          <!-- Patient -->
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
              {{ getInitials(selectedAppointment.patient) }}
            </div>
            <div class="flex-1">
              <div class="text-lg font-semibold">{{ getPatientName(selectedAppointment) }}</div>
              <div class="text-sm text-gray-500">{{ selectedAppointment.patient?.email || '—' }}</div>
              <div class="text-sm text-gray-500">{{ selectedAppointment.patient?.phone || '—' }}</div>
            </div>
                     </div>

          <!-- Médecin et Informations -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 rounded">
              <div class="text-xs text-gray-500">Médecin</div>
              <div class="font-semibold">{{ getDoctorName(selectedAppointment) }}</div>
              <div class="text-sm text-gray-500">{{ selectedAppointment.doctor?.email || '—' }}</div>
              <div class="text-sm text-gray-500">{{ selectedAppointment.doctor?.phone || '—' }}</div>
            </div>

            <div class="p-3 bg-gray-50 rounded">
              <div class="text-xs text-gray-500">Informations</div>
              <div class="mt-1 text-sm"><span class="font-medium">Début:</span> {{ formatDate(selectedAppointment.dateDebut) }}</div>
              <div class="text-sm"><span class="font-medium">Fin:</span> {{ formatDate(selectedAppointment.dateFin) }}</div>
              <div class="mt-1">
                <span :class="getStatusClass(selectedAppointment.etatRdv)">{{ selectedAppointment.etatRdv }}</span>
                <span class="ml-2 inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                  {{ selectedAppointment.typeRdv }}
                </span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="p-3 bg-white rounded border">
            <div class="text-sm font-medium mb-2">Description</div>
            <div class="text-sm text-gray-700">{{ selectedAppointment.description || 'Aucune description' }}</div>
          </div>

          <!-- Paiements -->
          <div v-if="selectedAppointment.paiements && selectedAppointment.paiements.length" class="p-3 bg-white rounded border">
            <div class="text-sm font-medium mb-2">Paiements</div>
            <ul class="text-sm text-gray-700 space-y-1">
              <li v-for="p in selectedAppointment.paiements" :key="p.id">
                {{ p.montant || p.amount || '0' }} € — {{ p.mode || p.method || '—' }} — {{ p.statut || p.status || '' }}
              </li>
            </ul>
          </div>

          <!-- Prescription -->
          <div v-if="selectedAppointment.prescription" class="p-3 bg-white rounded border">
            <div class="text-sm font-medium mb-2">Prescription</div>
            <div class="text-sm text-gray-700">
              {{ selectedAppointment.prescription.notes || selectedAppointment.prescription.description || 'Aucun détail' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const search = ref('')
const loading = ref(false)
const appointments = ref([])
const selectedAppointment = ref(null)
const showDetails = ref(false)
const selectedDate = ref('')
const pageSizes = [10, 25, 50]
const pageSize = ref(pageSizes[0])
const currentPage = ref(1)

const maxDate = new Date().toISOString().slice(0, 10)

// Méthodes utilitaires
const getPatientName = (apt) => {
  if (!apt.patient) return '—'
  return `${apt.patient.first_name || ''} ${apt.patient.last_name || ''}`.trim() || 'Nom inconnu'
}

const getDoctorName = (apt) => {
  if (!apt.doctor) return '—'
  return `${apt.doctor.first_name || ''} ${apt.doctor.last_name || ''}`.trim() || 'Docteur inconnu'
}

const getInitials = (person) => {
  if (!person) return '?'
  const first = person.first_name?.[0] || ''
  const last = person.last_name?.[0] || ''
  return (first + last).toUpperCase() || '?'
}

const getStatusClass = (status) => {
  const baseClasses = 'inline-block px-2 py-1 text-xs rounded'
  switch (status) {
    case 'ANNULE':
      return `${baseClasses} bg-red-100 text-red-700`
    case 'TERMINE':
      return `${baseClasses} bg-green-100 text-green-700`
    case 'CONFIRME':
      return `${baseClasses} bg-blue-100 text-blue-700`
    default:
      return `${baseClasses} bg-gray-100 text-gray-700`
  }
}

// Fetch des données
async function fetchAppointments() {
  loading.value = true
  try {
  const res = await fetch('/appointments')
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`)
    const data = await res.json()
    appointments.value = data.appointments || []
    console.log('Rendez-vous chargés:', appointments.value.length)
  } catch (err) {
    console.error('Erreur chargement rendez-vous', err)
    appointments.value = []
  } finally {
    loading.value = false
  }
}

// Annulation d'un rendez-vous
async function cancelAppointment(appointmentId) {
  if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return
  
  try {
    const res = await fetch(`/appointments/cancel/${appointmentId}`, {
      method: 'PUT'
    })
    
    if (!res.ok) throw new Error('Erreur lors de l\'annulation')
    
    // Recharger les données
    await fetchAppointments()
  } catch (err) {
    console.error('Erreur annulation', err)
    alert('Erreur lors de l\'annulation du rendez-vous')
  }
}

// Computed properties CORRIGÉES
const filteredAppointments = computed(() => {
  let list = appointments.value

  // Filtre par date
  if (selectedDate.value) {
    const day = selectedDate.value
    list = list.filter((a) => {
      if (!a.dateDebut) return false
      const dateStr = typeof a.dateDebut === 'string' ? a.dateDebut : a.dateDebut.toString()
      const isoDay = dateStr.split('T')[0]
      return isoDay === day
    })
  }

  // Filtre par recherche
  if (!search.value) return list
  const q = search.value.toLowerCase()
  return list.filter(a => {
    const patientName = getPatientName(a).toLowerCase()
    const doctorName = getDoctorName(a).toLowerCase()
    const dateStr = a.dateDebut ? a.dateDebut.toString().toLowerCase() : ''
    const type = (a.typeRdv || '').toLowerCase()
    
    return patientName.includes(q) || 
           doctorName.includes(q) || 
           dateStr.includes(q) || 
           type.includes(q)
  })
})

const totalPages = computed(() => 
  Math.max(1, Math.ceil(filteredAppointments.value.length / pageSize.value))
)

const pagedAppointments = computed(() => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
  const start = (currentPage.value - 1) * pageSize.value
  return filteredAppointments.value.slice(start, start + pageSize.value)
})

const startItem = computed(() => 
  filteredAppointments.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
)

const endItem = computed(() => 
  Math.min(filteredAppointments.value.length, currentPage.value * pageSize.value)
)

const pagesToShow = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// Méthodes de pagination
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function goToPage(p) {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

// Formatage de date
function formatDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return 'Date invalide'
  }
}

function openDetails(apt) {
  selectedAppointment.value = apt
  showDetails.value = true
}

function closeDetails() {
  showDetails.value = false
  selectedAppointment.value = null
}

// Initialisation
onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
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