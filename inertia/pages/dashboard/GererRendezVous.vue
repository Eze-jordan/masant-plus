<template>
  <div>
    <!-- HEADER -->
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

        <input 
          v-model="selectedDate" 
          type="date" 
          class="px-3 py-2 border rounded-md" 
          :max="maxDate" 
        />

        <select v-model.number="pageSize" class="px-3 py-2 border rounded-md">
          <option v-for="s in pageSizes" :key="s" :value="s">
            {{ s }} / page
          </option>
        </select>
      </div>
    </div>

    <!-- TABLE -->
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
            <td colspan="7" class="px-4 py-6 text-center">
              Aucun rendez-vous trouvé.
            </td>
          </tr>

          <tr
            v-else
            v-for="apt in pagedAppointments"
            :key="apt.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-3 text-sm">
              {{ formatDate(apt.dateDebut) }}
            </td>

            <td class="px-4 py-3 text-sm">
              {{ formatDate(apt.dateFin) }}
            </td>

            <td class="px-4 py-3 text-sm">
              {{ getPatientName(apt) }}
            </td>

            <td class="px-4 py-3 text-sm">
              {{ getDoctorName(apt) }}
            </td>

            <td class="px-4 py-3 text-sm">
              {{ apt.typeRdv }}
            </td>

            <td class="px-4 py-3 text-sm">
              <span :class="getStatusClass(apt.etatRdv)">
                {{ apt.etatRdv }}
              </span>
            </td>

            <td class="px-4 py-3 text-sm">
              <button
                @click="openDetails(apt)"
                class="text-blue-600 hover:underline mr-2"
              >
                Détails
              </button>

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

    <!-- PAGINATION -->
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
          :class="[
            'px-3 py-1 rounded',
            p === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-100'
          ]"
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

    <!-- DETAILS PANEL -->
    <div v-if="showDetails" class="fixed inset-0 z-50 flex">
      <div 
        class="flex-1 bg-black bg-opacity-40" 
        @click="closeDetails"
      ></div>

      <div 
        class="w-full max-w-md h-full bg-white shadow-2xl p-6 relative animate-slide-in-right overflow-y-auto"
      >
        <button 
          class="absolute top-3 right-3 text-gray-500 hover:bg-gray-100 rounded-full p-1"
          @click="closeDetails"
        >
          &times;
        </button>

        <h3 class="text-xl font-semibold mb-4">
          Détails du rendez-vous
        </h3>

        <div v-if="selectedAppointment" class="space-y-4">

          <!-- PATIENT -->
          <div class="flex items-start gap-4">
            <div 
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500"
            >
              {{ getInitials(selectedAppointment.patient) }}
            </div>

            <div class="flex-1">
              <div class="text-lg font-semibold">
                {{ getPatientName(selectedAppointment) }}
              </div>

              <div class="text-sm text-gray-500">
                {{ selectedAppointment.patient?.email || '—' }}
              </div>

              <div class="text-sm text-gray-500">
                {{ selectedAppointment.patient?.phone || '—' }}
              </div>
            </div>
          </div>

          <!-- INFORMATIONS -->
          <div class="grid grid-cols-2 gap-4">
            
            <!-- Médecin -->
            <div class="p-3 bg-gray-50 rounded">
              <div class="text-xs text-gray-500">Médecin</div>
              <div class="font-semibold">{{ getDoctorName(selectedAppointment) }}</div>
              <div class="text-sm text-gray-500">{{ selectedAppointment.doctor?.email || '—' }}</div>
              <div class="text-sm text-gray-500">{{ selectedAppointment.doctor?.phone || '—' }}</div>
            </div>

            <!-- Infos -->
            <div class="p-3 bg-gray-50 rounded">
              <div class="text-xs text-gray-500">Informations</div>
              <div class="mt-1 text-sm">
                <span class="font-medium">Début:</span> 
                {{ formatDate(selectedAppointment.dateDebut) }}
              </div>

              <div class="text-sm">
                <span class="font-medium">Fin:</span> 
                {{ formatDate(selectedAppointment.dateFin) }}
              </div>

              <div class="mt-1">
                <span :class="getStatusClass(selectedAppointment.etatRdv)">
                  {{ selectedAppointment.etatRdv }}
                </span>

                <span class="ml-2 inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                  {{ selectedAppointment.typeRdv }}
                </span>
              </div>
            </div>

          </div>

          <!-- DESCRIPTION -->
          <div class="p-3 bg-white rounded border">
            <div class="text-sm font-medium mb-2">Description</div>
            <div class="text-sm text-gray-700">
              {{ selectedAppointment.description || 'Aucune description' }}
            </div>
          </div>

          <!-- PAYMENTS -->
          <div 
            v-if="selectedAppointment.paiements && selectedAppointment.paiements.length"
            class="p-3 bg-white rounded border"
          >
            <div class="text-sm font-medium mb-2">Paiements</div>
            <ul class="text-sm text-gray-700 space-y-1">
              <li v-for="p in selectedAppointment.paiements" :key="p.id">
                {{ p.montant || p.amount || '0' }} €
                —
                {{ p.mode || p.method || '—' }}
                —
                {{ p.statut || p.status || '' }}
              </li>
            </ul>
          </div>

          <!-- PRESCRIPTION -->
          <div 
            v-if="selectedAppointment.prescription"
            class="p-3 bg-white rounded border"
          >
            <div class="text-sm font-medium mb-2">
              Prescription
            </div>

            <div class="text-sm text-gray-700">
              {{ 
                selectedAppointment.prescription.notes ||
                selectedAppointment.prescription.description ||
                'Aucun détail'
              }}
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

/* Refs */
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

/* Utility methods */
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
  return `${person.first_name?.[0] || ''}${person.last_name?.[0] || ''}`.toUpperCase()
}

const getStatusClass = (status) => {
  const base = 'inline-block px-2 py-1 text-xs rounded'
  switch (status) {
    case 'ANNULE': return `${base} bg-red-100 text-red-700`
    case 'TERMINE': return `${base} bg-green-100 text-green-700`
    case 'CONFIRME': return `${base} bg-blue-100 text-blue-700`
    default: return `${base} bg-gray-100 text-gray-700`
  }
}

/* Fetch API */
async function fetchAppointments() {
  loading.value = true

  try {
    const res = await fetch('/appointments')
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`)

    const data = await res.json()
    appointments.value = data.appointments || []
  } catch (err) {
    console.error('Erreur chargement rendez-vous', err)
    appointments.value = []
  } finally {
    loading.value = false
  }
}

/* Cancel appointment */
async function cancelAppointment(id) {
  if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return

  try {
    const res = await fetch(`/appointments/cancel/${id}`, { method: 'PUT' })
    if (!res.ok) throw new Error("Erreur lors de l'annulation")

    await fetchAppointments()
  } catch (err) {
    console.error('Erreur annulation', err)
    alert("Erreur lors de l'annulation du rendez-vous")
  }
}

/* Computed */
const filteredAppointments = computed(() => {
  let list = appointments.value

  if (selectedDate.value) {
    list = list.filter((a) => {
      const iso = (a.dateDebut || '').toString().split('T')[0]
      return iso === selectedDate.value
    })
  }

  if (!search.value) return list

  const q = search.value.toLowerCase()
  return list.filter(a =>
    getPatientName(a).toLowerCase().includes(q) ||
    getDoctorName(a).toLowerCase().includes(q) ||
    (a.dateDebut || '').toString().toLowerCase().includes(q) ||
    (a.typeRdv || '').toLowerCase().includes(q)
  )
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredAppointments.value.length / pageSize.value))
)

const pagedAppointments = computed(() => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  const start = (currentPage.value - 1) * pageSize.value
  return filteredAppointments.value.slice(start, start + pageSize.value)
})

const startItem = computed(() =>
  filteredAppointments.value.length === 0
    ? 0
    : (currentPage.value - 1) * pageSize.value + 1
)

const endItem = computed(() =>
  Math.min(filteredAppointments.value.length, currentPage.value * pageSize.value)
)

const pagesToShow = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  return pages
})

/* Pagination */
const prevPage = () => currentPage.value--
const nextPage = () => currentPage.value++
const goToPage = (p) => (currentPage.value = p)

/* Dates */
const formatDate = (iso) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })
  } catch {
    return 'Date invalide'
  }
}

/* Details */
const openDetails = (apt) => {
  selectedAppointment.value = apt
  showDetails.value = true
}

const closeDetails = () => {
  selectedAppointment.value = null
  showDetails.value = false
}

/* 🔄 Refresh auto */
let refreshInterval = null

onMounted(() => {
  fetchAppointments()

  refreshInterval = setInterval(() => {
    console.log("🔄 Refresh automatique…")
    fetchAppointments()
  }, 30000) // 30s
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>


<style scoped>
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
</style>
