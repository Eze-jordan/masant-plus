<template>
  <div class="p-6">
    <!-- Title -->
    <h1 class="text-2xl font-bold mb-6">Logs du système</h1>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-5 flex gap-4 items-end">
      
      <div class="flex-1">
        <label class="text-sm text-gray-600">Recherche (action, IP…)</label>
        <input
          v-model="filters.search"
          type="text"
          class="w-full px-3 py-2 border rounded-md"
          placeholder="ex: login, GET, appointments"
        />
      </div>

      <div>
        <label class="text-sm text-gray-600">Méthode</label>
        <select 
          v-model="filters.method"
          class="px-3 py-2 border rounded-md"
        >
          <option value="">Toutes</option>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
      </div>

      <div>
        <label class="text-sm text-gray-600">User ID</label>
        <input
          v-model="filters.userId"
          type="number"
          class="px-3 py-2 border rounded-md w-28"
          placeholder="4"
        />
      </div>

      <button 
        @click="loadLogs(1)"
        class="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Rechercher
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-200 text-left">
          <tr>
            <th class="p-3">ID</th>
            <th class="p-3">Action</th>
            <th class="p-3">Méthode</th>
            <th class="p-3">IP</th>
            <th class="p-3">User Agent</th>
            <th class="p-3">Statut</th>
            <th class="p-3">Date</th>
          </tr>
        </thead>

        <!-- Loader -->
        <tbody v-if="loading">
          <tr>
            <td colspan="7" class="py-6 text-center text-gray-500">
              Chargement...
            </td>
          </tr>
        </tbody>

        <!-- Data -->
        <tbody v-else>
          <tr 
            v-for="log in logs.data"
            :key="log.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="p-3 font-medium">{{ log.id }}</td>
            <td class="p-3">{{ log.action }}</td>
            <td class="p-3">{{ log.method }}</td>
            <td class="p-3">{{ log.ipAddress }}</td>
            <td class="p-3 truncate max-w-xs">{{ log.userAgent }}</td>

            <td class="p-3">
              <span 
                class="px-2 py-1 rounded text-white text-xs"
                :class="log.statusCode >= 400 ? 'bg-red-500' : 'bg-green-600'"
              >
                {{ log.statusCode }}
              </span>
            </td>

            <td class="p-3">{{ formatDate(log.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-6">
      <button 
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        :disabled="logs.meta.currentPage === 1"
        @click="loadLogs(logs.meta.currentPage - 1)"
      >
        Précédent
      </button>

      <span class="text-gray-600">
        Page {{ logs.meta.currentPage }} / {{ logs.meta.lastPage }}
      </span>

      <button 
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        :disabled="logs.meta.currentPage === logs.meta.lastPage"
        @click="loadLogs(logs.meta.currentPage + 1)"
      >
        Suivant
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(false)

const logs = ref({
  data: [],
  meta: {}
})

const filters = ref({
  search: '',
  method: '',
  userId: '',
})

// Charger les logs depuis l’API
async function loadLogs(page = 1) {
  try {
    loading.value = true

    const params = new URLSearchParams({
      page,
      search: filters.value.search,
      method: filters.value.method,
      userId: filters.value.userId
    })

    const res = await fetch(`/api/logs?${params}`)
    const data = await res.json()

    logs.value = data
  } catch (e) {
    console.error('Erreur API logs:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLogs()
})

function formatDate(date) {
  return new Date(date).toLocaleString()
}
</script>
