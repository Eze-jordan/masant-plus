<script setup lang="ts">
import { error } from 'console';

defineProps<{ error: any }>();
</script>

<template>
  <div class="container">
    <div class="title">Server Error</div>

    <span>{{ error.name }}</span>
  </div>
</template>