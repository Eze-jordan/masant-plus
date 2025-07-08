<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-blue-600 text-white flex flex-col justify-between p-4">
      <div>
        <h1 class="text-xl font-bold mb-10 flex items-center gap-6">
          <img src="../../public/logo.png" alt="Logo Mindiva" class="h-30 w-60 object-contain mr-2" />
        </h1>
        <ul class="space-y-5">
          <li
            class="p-2 rounded flex items-center justify-between font-bold cursor-pointer"
            :class="activeMenu === 'dashboard' ? 'bg-white text-black shadow' : 'text-white'"
            @click="setActiveMenu('dashboard')"
          >
            <div class="flex items-center gap-4">
              <Home class="w-5 h-5" :class="activeMenu === 'dashboard' ? 'text-black' : 'text-white'" />
              Dashboard
            </div>
            <ChevronRight class="w-4 h-4" :class="activeMenu === 'dashboard' ? 'text-gray-400' : 'text-white'" />
          </li>

          <li class="flex flex-col">
            <div
              class="flex items-center justify-between cursor-pointer p-2 rounded"
              :class="activeMenu === 'docteurs' ? 'bg-white  font-bold text-black shadow' : 'text-white'"
              @click="toggleSubMenu('docteurs'); setActiveMenu('docteurs')"
            >
              <div class="flex items-center gap-6">
                <Stethoscope class="w-5 h-5" :class="activeMenu === 'docteurs' ? 'text-black' : 'text-white'" />
                Docteurs
              </div>
              <ChevronRight
                :class="['w-4 h-4 transition-transform', openSubMenu === 'docteurs' ? 'rotate-150' : '', activeMenu === 'docteurs' ? 'text-black' : 'text-white']"
              />
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
              >Gérer les docteurs</li>
              <li
                class="cursor-pointer px-2 py-1 rounded"
                :class="activeSubMenu === 'Liste-demande' ? 'bg-blue-200 text-black font-bold' : 'text-white'"
                @click.stop="setActiveSubMenu('docteurs', 'Liste-demande')"
                style="text-decoration: none;"
              >Liste des demandes</li>
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
                Patients
              </div>
              <ChevronRight
                :class="['w-4 h-4 transition-transform', openSubMenu === 'patients' ? 'rotate-90' : '', activeMenu === 'patients' ? 'text-gray-400' : 'text-white']"
              />
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
              >Gérer les patients</li>
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
                Urgent
              </div>
              <ChevronRight
                :class="['w-4 h-4 transition-transform', openSubMenu === 'urgent' ? 'rotate-90' : '', activeMenu === 'urgent' ? 'text-gray-400' : 'text-white']"
              />
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
              >Gérer les urgences</li>
            </ul>
          </li>

          <li
            class="flex items-center justify-between cursor-pointer p-2 rounded"
            :class="activeMenu === 'paiement' ? 'bg-white text-black shadow font-bold' : 'text-white'"
            @click="setActiveMenu('paiement')"
          >
            <div class="flex items-center gap-6">
              <CreditCard class="w-5 h-5" :class="activeMenu === 'paiement' ? 'text-black' : 'text-white'" />
              Paiement
            </div>
            <ChevronRight class="w-4 h-4" :class="activeMenu === 'paiement' ? 'text-gray-400' : 'text-white'" />
          </li>

          <li
            class="flex items-center justify-between cursor-pointer p-2 rounded"
            :class="activeMenu === 'parametre' ? 'bg-white text-black shadow font-bold' : 'text-white'"
            @click="setActiveMenu('parametre')"
          >
            <div class="flex items-center gap-6">
              <Settings class="w-5 h-5" :class="activeMenu === 'parametre' ? 'text-black' : 'text-white'" />
              Paramètre
            </div>
            <ChevronRight class="w-4 h-4" :class="activeMenu === 'parametre' ? 'text-gray-400' : 'text-white'" />
          </li>
        </ul>

      </div>
      <div class="text-sm">
        <p class="font-semibold">        Administrateur</p>
        <p class="text-gray-200">administrateur@gmail.com</p>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-6 overflow-auto">
      <GererDocteur v-if="activeSubMenu === 'liste-docteurs'"  :user="user" :users="users"/>
      <ListeDemande v-else-if="activeSubMenu === 'Liste-demande'" :user="user" :users="users" />
      <GererPatients v-else-if="activeSubMenu === 'gerer-patients'" />
      <GererUrgences v-else-if="activeSubMenu === 'gerer-urgences'" />
      <div v-else>
        <!-- Topbar -->
        <div class="flex justify-between items-center mb-6">
          <input type="text" placeholder="Rechercher..." class="px-4 py-2 border rounded-md w-1/3" />
          <div class="flex gap-4 items-center">
            <MessageCircle class="w-6 h-6 text-gray-600" />
            <Bell class="w-6 h-6 text-gray-600" />
            <User class="w-6 h-6 text-gray-600" />

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
        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <User class="w-6 h-6 text-blue-600" />
              <div>
                <p class="font-semibold">12,345</p>
                <p class="text-sm text-gray-500">65% actif</p>
              </div>
            </div>
            <select class="border rounded px-2 py-1 text-sm">
              <option>Par mois</option>
              <option>Par semaine</option>
            </select>
          </div>
          <div class="h-150">
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

        <!-- Top Doctors -->
        <h2 class="text-lg font-semibold mb-4">Top Docteurs</h2>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="bg-white p-2 rounded-lg shadow text-center">
            <img :src="`/doctor${i}.jpg`" class="h-28 w-full object-cover rounded mb-2" />
            <p class="font-medium">Dr Nom {{ i }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
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
  MessageCircle
} from 'lucide-vue-next'
import GererDocteur from './geredocteur.vue'
import ListeDemande from './ListeDemande.vue'
import GererPatients from './GererPatients.vue'
import GererUrgences from './GererUrgences.vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
const props = defineProps({
  user: Object,
  users: Array,
})

const stats = [
  { label: 'Total Patients', value: '2K+', icon: Users },
  { label: 'Total Docteurs', value: '600', icon: Stethoscope },
  { label: 'Urgent', value: '800', icon: Calendar },
  { label: 'Revenus', value: 'XAF 60K', icon: DollarSign }
]

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Compte actif',
      backgroundColor: '#c7d2fe',
      borderColor: '#3b82f6',
      data: [1000, 8000, 6000, 7000, 7500, 6800, 8000, 9000, 12000, 11000, 13000, 15000],
      fill: true,
      tension: 0.4
    },
    {
      label: 'Compte inactif',
      backgroundColor: '#e0e7ff',
      borderColor: '#6366f1',
      data: [400, 1600, 2000, 1200, 1400, 1800, 2000, 2500, 3000, 3500, 4000, 4500, 5000],
      fill: true,
      tension: 0.4
    }
  ]
}

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

const LineChart = defineComponent({
  name: 'LineChart',
  props: ['chartData', 'chartOptions'],
  components: { Line },
  template: `<Line :data="chartData" :options="chartOptions" />`
})

const openSubMenu = ref(null)
const activeMenu = ref('dashboard')
const activeSubMenu = ref('')

function toggleSubMenu(menu) {
  openSubMenu.value = openSubMenu.value === menu ? null : menu
}
function setActiveMenu(menu) {
  activeMenu.value = menu
  activeSubMenu.value = ''
}
function setActiveSubMenu(parent, submenu) {
  activeMenu.value = parent
  activeSubMenu.value = submenu
}
</script>

<style scoped></style>