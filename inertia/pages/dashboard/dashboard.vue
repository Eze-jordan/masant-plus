<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
  :class="[sidebarOpen ? 'w-64' : 'w-20', 'bg-blue-600 text-white flex flex-col justify-between p-4 transition-all duration-300']"
>
      <div>
        
        <div class="flex justify-between items-center mb-10">
  <img src="/public/logo.png" alt="Logo Mindiva" class="h-30 w-50 object-contain" v-if="sidebarOpen" />
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
              :class="activeMenu === 'docteurs' ? 'bg-white  font-bold text-black shadow' : 'text-white'"
              @click="toggleSubMenu('docteurs'); setActiveMenu('docteurs')"
            >
              <div class="flex items-center gap-6">
                <Stethoscope class="w-5 h-5" :class="activeMenu === 'docteurs' ? 'text-black' : 'text-white'" />
                <span v-if="sidebarOpen">Docteurs</span>
              </div>
              <span v-if="sidebarOpen"><ChevronRight
                :class="['w-4 h-4 transition-transform', openSubMenu === 'docteurs' ? 'rotate-45' : '', activeMenu === 'docteurs' ? 'text-black' : 'text-white']"
              /></span>
              
            </div>
            <ul
              v-if="openSubMenu === 'docteurs'"
              class="ml-8 mt-2 space-y-2 text-sm"
            >
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'liste-docteurs' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('docteurs', 'liste-docteurs')"
                style="text-decoration: none;"
              ><span v-if="sidebarOpen">Gérer les docteurs</span>
              </li>
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'Liste-demande' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('docteurs', 'Liste-demande')"
                style="text-decoration: none;"
              ><span v-if="sidebarOpen">Liste des demandes</span></li>
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
              <span v-if="sidebarOpen"><ChevronRight
                :class="['w-4 h-4 transition-transform', openSubMenu === 'patients' ? 'rotate-45' : '', activeMenu === 'patients' ? 'text-black' : 'text-white']"
              /></span>
              
            </div>
            <ul
              v-if="openSubMenu === 'patients'"
              class="ml-8 mt-2 space-y-2 text-sm"
            >
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'gerer-patients' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('patients', 'gerer-patients')"
                style="text-decoration: none;"
              >                <span v-if="sidebarOpen">Gérer les patients</span> 
              </li>
            </ul>
          </li>

          <li class="flex flex-col">
            <div
              class="flex items-center justify-between cursor-pointer p-2 rounded"
              :class="activeMenu === 'urgent' ? 'bg-white text-black shadow font-bold' : 'text-white'"
              @click="toggleSubMenu('urgent'); setActiveMenu('urgent')"
            >
              <div class="flex items-center gap-6">
                <Calendar class="w-5 h-5" :class="activeMenu === 'urgent' ? 'text-black' : 'text-white'" />
                <span v-if="sidebarOpen">Urgent</span> 
              </div>
              <span v-if="sidebarOpen"><ChevronRight
                :class="['w-4 h-4 transition-transform', openSubMenu === 'urgent' ? 'rotate-45' : '', activeMenu === 'urgent' ? 'text-black' : 'text-white']"
              /></span>
              
            </div>
            <ul
              v-if="openSubMenu === 'urgent'"
              class="ml-8 mt-2 space-y-2 text-sm"
            >
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'gerer-urgences' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('urgent', 'gerer-urgences')"
                style="text-decoration: none;"
              ><span v-if="sidebarOpen">Gérer les urgences</span> </li>
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
              <span v-if="sidebarOpen"><ChevronRight
                :class="['w-4 h-4 transition-transform', openSubMenu === 'paiement' ? 'rotate-45' : '', activeMenu === 'paiement' ? 'text-black' : 'text-white']"
              /></span>
              
            </div>
            <ul
              v-if="openSubMenu === 'paiement'"
              class="ml-8 mt-2 space-y-2 text-sm"
            >
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'historique' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('paiement', 'historique')"
                style="text-decoration: none;"
              ><span v-if="sidebarOpen">Historique</span></li>
            </ul>
          </li>

          <li
            class="flex items-center justify-between cursor-pointer p-2 rounded"
            :class="activeMenu === 'parametre' ? 'bg-white text-black shadow font-bold' : 'text-white'"
            @click="setActiveMenu('parametre')"
          >
            <div class="flex items-center gap-6">
              <Settings class="w-5 h-5" :class="activeMenu === 'parametre' ? 'text-black' : 'text-white'" />
              <span v-if="sidebarOpen">Paramètre</span>
            </div>
          </li>
        </ul>

      </div>
      
      <div class="text-sm">
        <p class="font-semibold">{{ user?.name || 'Utilisateur' }}</p>
<p class="text-gray-200">{{ user?.email || 'email@example.com' }}</p>


        <div class="text-sm"> <span v-if="sidebarOpen"> <p class="font-semibold">        Administrateur</p>
     </span>
       
      </div>
    </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-6 overflow-auto">
      <GererDocteur v-if="activeSubMenu === 'liste-docteurs'"  :user="user" :users="users"/>
      <ListeDemande v-else-if="activeSubMenu === 'Liste-demande'" :user="user" :users="users" />
      <GererPatients v-else-if="activeSubMenu === 'gerer-patients'" />
      <GererUrgences v-else-if="activeSubMenu === 'gerer-urgences'" />
      <HistoriquePaiement v-else-if="activeSubMenu === 'historique'" />
      <div v-else>
        <!-- Topbar -->
        <div class="flex justify-between items-center mb-6">
          <input type="text" placeholder="Rechercher..." class="px-4 py-2 border rounded-md w-1/3" />
          <div class="flex gap-4 items-center">
            <MessageCircle class="w-6 h-6 text-gray-600" />
            <Bell class="w-6 h-6 text-gray-600" />
            <button @click="logout" class="focus:outline-none">
  <User class="w-6 h-6 text-gray-600" />
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
                  <p class="font-semibold">{{ props.stats.totalPatients }}</p>
<p class="text-sm text-gray-500">{{ props.stats.percentActive }}% actif</p>

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
                <span class="w-3 h-3 bg-blue-500 rounded-full"></span> Compte actif
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-indigo-200 rounded-full"></span> Compte inactif
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
                  <p class="font-semibold">{{ props.users.length }}</p>
<p class="text-sm text-gray-500">{{ Math.round((activeDoctors / props.users.length) * 100) || 0 }}% actif</p>

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
                <span class="w-3 h-3 bg-green-500 rounded-full"></span> Compte actif
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-green-200 rounded-full"></span> Compte inactif
              </span>
            </div>
          </div>
        </div>

        <!-- Top Doctors -->
        <h2 class="text-lg font-semibold mb-4">Top Docteurs</h2>
<div class="grid grid-cols-4 gap-4">
  <div
    v-for="doctor in topDoctors"
    :key="doctor.id"
    class="bg-white p-2 rounded-lg shadow text-center"
  >
    <img
      :src="doctor.profileImage || '/default-doctor.jpg'"
      class="h-28 w-full object-cover rounded mb-2"
      alt="Photo du docteur"
    />
    <p class="font-medium">
      Dr {{ doctor.firstName }} {{ doctor.lastName }}
    </p>
    <p class="text-sm text-gray-500">
      {{ doctor.specialty || 'Spécialité inconnue' }}
    </p>
  </div>
</div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const sidebarOpen = ref(true)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

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
  Settings,
  Users,
  DollarSign,
  Bell,
  MessageCircle,
  ChevronRight
} from 'lucide-vue-next'

import GererDocteur from './geredocteur.vue'
import ListeDemande from './ListeDemande.vue'
import GererPatients from './GererPatients.vue'
import GererUrgences from './GererUrgences.vue'
import HistoriquePaiement from './HistoriquePaiement.vue'

// Props typés
const props = defineProps<{
  stats: {
    totalPatients: number
    activePatients: number
    inactivePatients: number
    percentActive: number
    montantTotalPlateforme: number // ✅ AJOUT

  },
  user: any,
  users: any[]
}>()


 
const topDoctors = computed(() => {
  return props.users
    .filter(user => ['doctor', 'medecin'].includes((user.role || '').toLowerCase()))
    .slice(0, 4) // Les 4 premiers
})


// Stat cards dynamiques
const stats = [
  { label: 'Total Patients', value: props.stats.totalPatients, icon: Users },
  { label: 'Total Docteurs', value: props.users.length, icon: Stethoscope },
  { label: 'Urgent', value: '0', icon: Calendar },
  { label: 'Revenus', value: `XAF ${props.stats.montantTotalPlateforme.toLocaleString()}`, icon: DollarSign }
  ]

// Docteurs actifs/inactifs estimés
const activeDoctors = computed(() => Math.round(props.users.length * 0.8))
const inactiveDoctors = computed(() => props.users.length - activeDoctors.value)

// Chart.js registration
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

// Fonction pour générer les labels des mois jusqu'au mois actuel
function getMonthLabelsUntilNow(): string[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  return months.slice(0, currentMonth + 1)
}

// Patients chart (dynamique)
const chartData = computed(() => {
  const months = getMonthLabelsUntilNow()
  return {
    labels: months,
    datasets: [
      {
        label: 'Compte actif',
        backgroundColor: '#c7d2fe',
        borderColor: '#3b82f6',
        data: Array(months.length - 1).fill(0).concat(props.stats.activePatients),
        fill: true,
        tension: 0.4
      },
      {
        label: 'Compte inactif',
        backgroundColor: '#e0e7ff',
        borderColor: '#6366f1',
        data: Array(months.length - 1).fill(0).concat(props.stats.inactivePatients),
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Docteurs chart (dynamique)
const chartDataMedecins = computed(() => {
  const months = getMonthLabelsUntilNow()
  return {
    labels: months,
    datasets: [
      {
        label: 'Compte actif',
        backgroundColor: '#bbf7d0',
        borderColor: '#22c55e',
        data: Array(months.length - 1).fill(0).concat(activeDoctors.value),
        fill: true,
        tension: 0.4
      },
      {
        label: 'Compte inactif',
        backgroundColor: '#dcfce7',
        borderColor: '#4ade80',
        data: Array(months.length - 1).fill(0).concat(inactiveDoctors.value),
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Chart options (communs)
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

// État UI sidebar
const openSubMenu = ref<string | null>(null)
const activeMenu = ref('dashboard')
const activeSubMenu = ref('')

function toggleSubMenu(menu: string) {
  openSubMenu.value = openSubMenu.value === menu ? null : menu
}

function setActiveMenu(menu: string) {
  activeMenu.value = menu

  // Si on clique sur Dashboard, on vide le sous-menu
  if (menu === 'dashboard') {
    activeSubMenu.value = ''
  }
}


function setActiveSubMenu(parent: string, submenu: string) {
  activeMenu.value = parent
  activeSubMenu.value = submenu
}
</script>




<style scoped></style>