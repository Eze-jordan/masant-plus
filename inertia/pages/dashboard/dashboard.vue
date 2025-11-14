<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="[sidebarOpen ? 'w-64' : 'w-20', 'bg-blue-600 text-white flex flex-col justify-between p-4 transition-all duration-300']"
    >
      <div>
        <div class="flex justify-between items-center mb-10">
          <img src="/public/logo.png" alt="Logo Mindiva" class="h- w-40 object-contain" v-if="sidebarOpen" />
          <button @click="toggleSidebar" class="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
              <line x1="9" y1="4" x2="9" y2="20" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <ul class="space-y-5">
          <li
            class="p-2 rounded flex items-center justify-between font-bold cursor-pointer"
            :class="activeMenu === 'dashboard' ? 'bg-white text-black shadow' : 'text-white'"
            @click="setActiveMenu('dashboard')"
          >
            <div class="flex items-center gap-4">
              <Home class="w-5 h-5" :class="activeMenu === 'dashboard' ? 'text-black' : 'text-white'" />
              <span v-if="sidebarOpen">Dashboard</span>
            </div>
          </li>

          <li class="flex flex-col">
            <div
              class="flex items-center justify-between cursor-pointer p-2 rounded"
              :class="activeMenu === 'docteurs' ? 'bg-white font-bold text-black shadow' : 'text-white'"
              @click="toggleSubMenu('docteurs'); setActiveMenu('docteurs')"
            >
              <div class="flex items-center gap-6">
                <Stethoscope class="w-5 h-5" :class="activeMenu === 'docteurs' ? 'text-black' : 'text-white'" />
                <span v-if="sidebarOpen">Docteurs</span>
              </div>
              <span v-if="sidebarOpen">
                <ChevronRight
                  :class="['w-4 h-4 transition-transform', openSubMenu === 'docteurs' ? 'rotate-90' : '', activeMenu === 'docteurs' ? 'text-black' : 'text-white']"
                />
              </span>
            </div>
            <ul
              v-if="openSubMenu === 'docteurs'"
              class="ml-8 mt-2 space-y-2 text-sm"
            >
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'liste-docteurs' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('docteurs', 'liste-docteurs')"
              >
                <span v-if="sidebarOpen">Gérer les docteurs</span>
              </li>
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'Liste-demande' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('docteurs', 'Liste-demande')"
              >
                <span v-if="sidebarOpen">Liste des demandes</span>
              </li>
            </ul>
          </li>

          <li class="flex flex-col">
            <div
              class="flex items-center justify-between cursor-pointer p-2 rounded"
              :class="activeMenu === 'patients' ? 'bg-white text-black shadow font-bold' : 'text-white'"
              @click="toggleSubMenu('patients'); setActiveMenu('patients')"
            >
              <div class="flex items-center gap-6">
                <User class="w-5 h-5" :class="activeMenu === 'patients' ? 'text-black' : 'text-white'" />
                <span v-if="sidebarOpen">Patients</span>
              </div>
              <span v-if="sidebarOpen">
                <ChevronRight
                  :class="['w-4 h-4 transition-transform', openSubMenu === 'patients' ? 'rotate-90' : '', activeMenu === 'patients' ? 'text-black' : 'text-white']"
                />
              </span>
            </div>
            <ul
              v-if="openSubMenu === 'patients'"
              class="ml-8 mt-2 space-y-2 text-sm"
            >
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'gerer-patients' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('patients', 'gerer-patients')"
              >
                <span v-if="sidebarOpen">Gérer les patients</span>
              </li>
            </ul>
          </li>

          <li class="flex flex-col">
            <div
              class="flex items-center justify-between cursor-pointer p-2 rounded"
              :class="activeMenu === 'Rendez-vous' ? 'bg-white text-black shadow font-bold' : 'text-white'"
              @click="toggleSubMenu('Rendez-vous'); setActiveMenu('Rendez-vous')"
            >
              <div class="flex items-center gap-6">
                <Calendar class="w-5 h-5" :class="activeMenu === 'Rendez-vous' ? 'text-black' : 'text-white'" />
                <span v-if="sidebarOpen">Rendez-vous</span>
              </div>
              <span v-if="sidebarOpen">
                <ChevronRight
                  :class="['w-4 h-4 transition-transform', openSubMenu === 'Rendez-vous' ? 'rotate-90' : '', activeMenu === 'Rendez-vous' ? 'text-black' : 'text-white']"
                />
              </span>
            </div>
            <ul
              v-if="openSubMenu === 'Rendez-vous'"
              class="ml-8 mt-2 space-y-2 text-sm"
            >
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'gerer-Rendez-vous' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('Rendez-vous', 'gerer-Rendez-vous')"
              >
                <span v-if="sidebarOpen">Gérer les Rendez-vous</span>
              </li>
            </ul>
          </li>

          <li class="flex flex-col">
            <div
              class="flex items-center justify-between cursor-pointer p-2 rounded"
              :class="activeMenu === 'paiement' ? 'bg-white text-black shadow font-bold' : 'text-white'"
              @click="toggleSubMenu('paiement'); setActiveMenu('paiement')"
            >
              <div class="flex items-center gap-6">
                <CreditCard class="w-5 h-5" :class="activeMenu === 'paiement' ? 'text-black' : 'text-white'" />
                <span v-if="sidebarOpen">Paiement</span>
              </div>
              <span v-if="sidebarOpen">
                <ChevronRight
                  :class="['w-4 h-4 transition-transform', openSubMenu === 'paiement' ? 'rotate-90' : '', activeMenu === 'paiement' ? 'text-black' : 'text-white']"
                />
              </span>
            </div>
            <ul
              v-if="openSubMenu === 'paiement'"
              class="ml-8 mt-2 space-y-2 text-sm"
            >
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'historique' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('paiement', 'historique')"
              >
                <span v-if="sidebarOpen">Historique</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="text-sm">
        <span v-if="sidebarOpen">
          <p class="font-semibold">{{ user?.name || '' }}</p>
          <p class="text-gray-200">{{ user?.email || 'email@example.com' }}</p>
        </span>

        <div class="text-sm">
          <span v-if="sidebarOpen">
            <p class="font-semibold">Administrateur</p>
          </span>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-6 overflow-auto">
      <GererDocteur v-if="activeSubMenu === 'liste-docteurs'" :user="user" :users="users"/>
      <ListeDemande v-else-if="activeSubMenu === 'Liste-demande'" :user="user" :users="users" />
      <GererPatients v-else-if="activeSubMenu === 'gerer-patients'" />
      <GererRendezVous v-else-if="activeSubMenu === 'gerer-Rendez-vous'" />
      <HistoriquePaiement v-else-if="activeSubMenu === 'historique'" />
      <div v-else>
        <!-- Topbar -->
        <div class="flex justify-between items-center mb-6">
          <input type="text" placeholder="Rechercher..." class="px-4 py-2 border rounded-md w-1/3" />
          <div class="flex gap-4 items-center">
            <MessageCircle class="w-6 h-6 text-gray-600 cursor-pointer" @click="showMessagesModal = true" />
            <Bell class="w-6 h-6 text-gray-600 cursor-pointer" @click="showNotificationsModal = true" />
            <button @click="logout" class="focus:outline-none">
              <LogOut class="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div v-for="card in stats" :key="card.label" class="bg-white p-4 rounded-lg shadow text-center">
            <div class="flex justify-center mb-2">
              <div class="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center">
                <component :is="card.icon" class="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p class="text-sm text-gray-500">{{ card.label }}</p>
            <p class="text-2xl font-bold">{{ card.value }}</p>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Chart Patients -->
          <div class="bg-white p-6 rounded-lg shadow border border-blue-100">
            <h3 class="text-lg font-bold mb-4 text-blue-700 flex items-center gap-2">
              <User class="w-6 h-6 text-blue-400" /> Statistiques Patients
            </h3>
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2">
                <User class="w-6 h-6 text-blue-600" />
                <div>
                  <p class="font-semibold">{{ statsData.totalPatients }}</p>
                  <p class="text-sm text-gray-500">{{ statsData.percentActive }}% actif</p>
                </div>
              </div>
              <select class="border rounded px-2 py-1 text-sm">
                <option>Par mois</option>
              </select>
            </div>
            <div class="h-72">
              <Line :data="chartData" :options="chartOptions" />
            </div>
            <div class="flex gap-4 mt-4 text-sm">
              <span class="flex items-center gap-3">
                <span class="w-3 h-3 bg-blue-600 rounded-full"></span> Compte actif
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-blue-300 rounded-full"></span> Compte inactif
              </span>
            </div>
          </div>
          
          <!-- Chart Médecins -->
          <div class="bg-white p-6 rounded-lg shadow border border-green-100">
            <h3 class="text-lg font-bold mb-4 text-green-700 flex items-center gap-2">
              <Stethoscope class="w-6 h-6 text-green-400" /> Statistiques Médecins
            </h3>
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2">
                <Stethoscope class="w-6 h-6 text-green-500" />
                <div>
                  <p class="font-semibold">{{ statsData.totalDoctors }}</p>
                  <p class="text-sm text-gray-500">{{ statsData.doctorActivePercent }}% actif</p>
                </div>
              </div>
              <select class="border rounded px-2 py-1 text-sm">
                <option>Par mois</option>
              </select>
            </div>
            <div class="h-72">
              <Line :data="chartDataMedecins" :options="chartOptions" />
            </div>
            <div class="flex gap-4 mt-4 text-sm">
              <span class="flex items-center gap-3">
                <span class="w-3 h-3 bg-green-600 rounded-full"></span> Compte actif
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-green-300 rounded-full"></span> Compte inactif
              </span>
            </div>
          </div>
        </div>

        <!-- Section vide pour permettre un éventuel contenu futur -->
        <div class="mt-8 text-center text-gray-500">
          <p>Dashboard principal - Sélectionnez une section dans le menu de gauche pour gérer le contenu</p>
        </div>
      </div>
    </main>

    <!-- Modal Messages -->
    <div
      v-if="showMessagesModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          @click="showMessagesModal = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <h2 class="text-lg font-bold mb-4">Messages</h2>
        <p>Contenu de la messagerie ici…</p>
      </div>
    </div>

    <!-- Modal Notifications -->
    <div
      v-if="showNotificationsModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          @click="showNotificationsModal = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <h2 class="text-lg font-bold mb-4">Notifications</h2>
        <p>Contenu des notifications ici…</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
import {
  Home,
  Stethoscope,
  User,
  Calendar,
  CreditCard,
  Users,
  DollarSign,
  Bell,
  MessageCircle,
  ChevronRight,
  LogOut
} from 'lucide-vue-next'

// Enregistrer les composants Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

// Composants de page
import GererDocteur from './geredocteur.vue'
import ListeDemande from './ListeDemande.vue'
import GererPatients from './GererPatients.vue'
import GererRendezVous from './GererRendezVous.vue'
import HistoriquePaiement from './HistoriquePaiement.vue'

// États réactifs
const sidebarOpen = ref(true)
const openSubMenu = ref(null)
const activeMenu = ref('dashboard')
const activeSubMenu = ref('')
const showMessagesModal = ref(false)
const showNotificationsModal = ref(false)

// Props avec valeurs par défaut
const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      totalPatients: 0,
      activePatients: 0,
      inactivePatients: 0,
      percentActive: 0,
      montantTotalPlateforme: 0
    })
  },
  user: {
    type: Object,
    default: () => ({})
  },
  users: {
    type: Array,
    default: () => []
  }
})

// État pour les données de l'API
const apiStats = ref({
  appointments: [],
  doctors: [],
  patients: []
})

// Fonction pour charger les données
async function fetchStatsData() {
  try {
    const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
      fetch('/appointments').catch(() => ({ ok: false })),
      fetch('/patient').catch(() => ({ ok: false })),
      fetch('/doctors').catch(() => ({ ok: false }))
    ])

    if (!appointmentsRes.ok) {
      apiStats.value.appointments = []
    } else {
      const appointmentsData = await appointmentsRes.json()
      apiStats.value.appointments = Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.appointments || []
    }

    if (!patientsRes.ok) {
      apiStats.value.patients = []
    } else {
      const patientsData = await patientsRes.json()
      apiStats.value.patients = Array.isArray(patientsData) ? patientsData : patientsData.patients || []
    }

    if (!doctorsRes.ok) {
      apiStats.value.doctors = []
    } else {
      const doctorsData = await doctorsRes.json()
      apiStats.value.doctors = Array.isArray(doctorsData) ? doctorsData : doctorsData.doctors || []
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    apiStats.value = {
      appointments: [],
      patients: [],
      doctors: []
    }
  }
}
let refreshInterval = null

onMounted(() => {
  fetchStatsData()

  refreshInterval = setInterval(() => {
    fetchStatsData()
  }, 20000)
})



// Charger les données au montage du composant
onMounted(() => {
  fetchStatsData()
})

// Données statistiques calculées
const statsData = computed(() => {
  const patients = apiStats.value.patients || []
  const doctors = apiStats.value.doctors || []
  
  const activePatients = patients.filter(p => p.accountStatus === 'ACTIVE').length
  const activeDoctors = doctors.filter(d => d.accountStatus === 'ACTIVE').length
  
  return {
    totalPatients: patients.length,
    activePatients,
    inactivePatients: patients.length - activePatients,
    percentActive: patients.length > 0 ? Math.round((activePatients / patients.length) * 100) : 0,
    totalDoctors: doctors.length,
    activeDoctors,
    inactiveDoctors: doctors.length - activeDoctors,
    doctorActivePercent: doctors.length > 0 ? Math.round((activeDoctors / doctors.length) * 100) : 0
  }
})

// Cartes de statistiques
const stats = computed(() => [
  { 
    label: 'Total Patients', 
    value: statsData.value.totalPatients, 
    icon: Users 
  },
  { 
    label: 'Total Docteurs', 
    value: statsData.value.totalDoctors, 
    icon: Stethoscope 
  },
  { 
    label: 'Rendez-vous', 
    value: apiStats.value.appointments.length, 
    icon: Calendar 
  },
  { 
    label: 'Revenus', 
    value: `XAF ${props.stats.montantTotalPlateforme.toLocaleString()}`, 
    icon: DollarSign 
  }
])

// Fonction pour générer les labels des mois
function getMonthLabelsUntilNow() {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
  const currentMonth = new Date().getMonth()
  return months.slice(0, currentMonth + 1)
}
function buildMonthlyStats(items) {
  const months = getMonthLabelsUntilNow()
  const monthIndex = (date) => new Date(date).getMonth()

  const activePerMonth = Array(months.length).fill(0)
  const inactivePerMonth = Array(months.length).fill(0)

  items.forEach(item => {
    const month = monthIndex(item.createdAt || item.created_at || item.dateCreation || item.date || new Date())

    if (item.accountStatus === 'ACTIVE') {
      activePerMonth[month]++
    } else {
      inactivePerMonth[month]++
    }
  })

  return { months, activePerMonth, inactivePerMonth }
}

const chartData = computed(() => {
  const { months, activePerMonth, inactivePerMonth } = buildMonthlyStats(apiStats.value.patients)

  return {
    labels: months,
    datasets: [
      {
        label: 'Actifs',
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
        data: activePerMonth,
        fill: false,
        tension: 0.3
      },
      {
        label: 'Inactifs',
        backgroundColor: '#93c5fd',
        borderColor: '#93c5fd',
        data: inactivePerMonth,
        fill: false,
        tension: 0.3
      }
    ]
  }
})


const chartDataMedecins = computed(() => {
  const { months, activePerMonth, inactivePerMonth } = buildMonthlyStats(apiStats.value.doctors)

  return {
    labels: months,
    datasets: [
      {
        label: 'Actifs',
        backgroundColor: '#86efac',
        borderColor: '#86efac',
        data: activePerMonth,
        fill: false,
        tension: 0.3
      },
      {
        label: 'Inactifs',
        backgroundColor: '#16a34a',
        borderColor: '#16a34a',
        data: inactivePerMonth,
        fill: false,
        tension: 0.3
      }
    ]
  }
})



// Options des graphiques
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    y: { beginAtZero: true }
  }
}

// Méthodes de navigation
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function toggleSubMenu(menu) {
  openSubMenu.value = openSubMenu.value === menu ? null : menu
}

function setActiveMenu(menu) {
  activeMenu.value = menu
  if (menu === 'dashboard') {
    activeSubMenu.value = ''
  }
}

function setActiveSubMenu(parent, submenu) {
  activeMenu.value = parent
  activeSubMenu.value = submenu
}

function logout() {
  window.location.href = '/logout'
}
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