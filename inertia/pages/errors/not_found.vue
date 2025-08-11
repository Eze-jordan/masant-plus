<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

</script>

<template>
  <div class="flex items-center justify-center h-screen bg-gradient-to-r from-[#d8b39d] via-[#ab8c6e] to-[#755c4a]">
    <div class="text-center p-8 bg-white bg-opacity-60 rounded-xl shadow-2xl max-w-xl">
      <!-- Illustration ou Image -->
      <img class="w-48 mx-auto mb-6" src="https://previews.123rf.com/images/monuttanit/monuttanit1805/monuttanit180500043/102209916-404-error-page-not-found-with-white-background-design-template-for-website-background-graphic.jpg" alt="Page Not Found" />

      <h1 class="text-6xl font-extrabold text-gray-800 mb-4">
        Oops! Page Not Found
      </h1>
      <p class="text-xl text-gray-600 mb-6">
        Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
      </p>

      <!-- Lien vers la page d'accueil -->
      <Link href="/" class="inline-block py-3 px-8 text-lg font-semibold text-white bg-[#ab8c6e] rounded-full shadow-lg hover:bg-[#755c4a] transition-all duration-300 ease-in-out transform hover:scale-105">
        Retour à l'accueil
      </Link>
    </div>
  </div>
</template>