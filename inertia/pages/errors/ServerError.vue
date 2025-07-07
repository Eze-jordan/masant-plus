<script setup lang="ts">
  // Déclare la prop 'onmessage'
  const { onmessage } = defineProps<{ onmessage: string }>()
</script>

<template>
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong class="font-bold">Erreur :</strong>
    <span class="block sm:inline">{{ onmessage }}</span>
  </div>
</template>
