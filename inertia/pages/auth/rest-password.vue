<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white p-8 rounded shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Changer le mot de passe</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Mot de passe actuel -->
        <div class="relative">
          <label for="current_password" class="block text-gray-700 font-medium mb-1">Mot de passe actuel</label>
          <input
            :type="showCurrentPassword ? 'text' : 'password'"
            id="current_password"
            v-model="form.current_password"
            required
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 pr-10"
            autocomplete="current-password"
          />
          <button
            type="button"
            @click="showCurrentPassword = !showCurrentPassword"
            class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            tabindex="-1"
          >
            <svg v-if="!showCurrentPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
            </svg>
          </button>
        </div>

        <!-- Nouveau mot de passe -->
        <div class="relative">
          <label for="password" class="block text-gray-700 font-medium mb-1">Nouveau mot de passe</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            required
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 pr-10"
            autocomplete="new-password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            tabindex="-1"
          >
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
            </svg>
          </button>
        </div>

        <!-- Confirmation mot de passe -->
        <div class="relative">
          <label for="password_confirmation" class="block text-gray-700 font-medium mb-1">Confirmer le nouveau mot de passe</label>
          <input
            :type="showPasswordConfirm ? 'text' : 'password'"
            id="password_confirmation"
            v-model="form.password_confirmation"
            required
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 pr-10"
            autocomplete="new-password"
          />
          <button
            type="button"
            @click="showPasswordConfirm = !showPasswordConfirm"
            class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            tabindex="-1"
          >
            <svg v-if="!showPasswordConfirm" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
            </svg>
          </button>
        </div>

        <div v-if="errorMessage" class="text-red-600 text-sm mb-2">{{ errorMessage }}</div>
        <div v-if="successMessage" class="text-green-600 text-sm mb-2">{{ successMessage }}</div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Chargement...' : 'Changer le mot de passe' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'

const showCurrentPassword = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const form = useForm({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const handleSubmit = () => {
  form.clearErrors()

  if (form.password !== form.password_confirmation) {
    form.setError('password_confirmation', 'Les nouveaux mots de passe ne correspondent pas.')
    return
  }

  form.put(`/users/${form.user_id || 'cf9cb3a9-49a6-4cb6-89f9-b4d4f497ba17'}/change-password`, {
    preserveScroll: true,
    onSuccess: () => {
      form.reset()
      form.clearErrors()
    },
  })
}
</script>

