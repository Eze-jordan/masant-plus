<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-hidden">
    
    <!-- Header Section -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <!-- Logo and Brand Name -->
          <div class="flex items-center">
            <Sparkles class="h-8 w-8 text-indigo-600 mr-2" />
            <h1 class="text-2xl font-bold text-gray-900">ma sante plus</h1>
          </div>
<<<<<<< HEAD

=======
>>>>>>> 6f506420a02e20676352333842b78602f55cbfe5
          <!-- Navigation Links -->
          <nav class="hidden md:flex space-x-8">
            <a href="#" class="text-gray-500 hover:text-gray-900 transition-colors">Accueil</a>
            <a href="#" class="text-gray-500 hover:text-gray-900 transition-colors">À propos</a>
            <a href="#" class="text-gray-500 hover:text-gray-900 transition-colors">Services</a>
            <a href="#" class="text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
          </nav>
<<<<<<< HEAD

=======
>>>>>>> 6f506420a02e20676352333842b78602f55cbfe5
          <!-- Connexion Button -->
          <Link href="/login" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Connexion
          </Link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <div class="animate-bounce mb-8">
          <Heart class="h-16 w-16 text-red-500 mx-auto" />
        </div>
<<<<<<< HEAD

        <!-- Hero Title -->
        <div class="mb-8">
          <h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Bienvenue sur
            <div class="relative inline-block mt-2">
              <span class="bg-gradient-to-r from-[#165DFB] via-sky-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                ma santé plus
              </span>
              <div class="absolute -inset-2 bg-gradient-to-r from-[#165DFB]/20 via-sky-500/20 to-cyan-500/20 blur-2xl -z-10 animate-pulse"></div>
            </div>
          </h1>
        </div>

        <!-- Hero Description -->
        <div class="mb-12">
          <p class="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Découvrez une expérience unique qui transformera votre façon de prendre soin de votre santé.
            Rejoignez des milliers d'utilisateurs satisfaits qui ont déjà fait le choix de l'excellence.
          </p>
        </div>

        <!-- Hero Buttons -->
        <div class="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[#165DFB] to-cyan-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <button @click="startJourney" class="relative bg-gradient-to-r from-[#165DFB] to-cyan-500 text-[#165DFB] px-10 py-5 rounded-2xl text-xl font-semibold hover:from-[#0F4FD9] hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-2xl">
              <span class="flex items-center">
                Commencer maintenant
                <Sparkles class="ml-3 h-6 w-6" />
              </span>
            </button>
          </div>

          <button @click="showMoreInfo" class="relative bg-white/90 backdrop-blur-sm border-2 border-[#165DFB] text-[#165DFB] px-10 py-5 rounded-2xl text-xl font-semibold hover:bg-[#165DFB]/5 hover:scale-105 transition-all duration-300 shadow-xl">
=======
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Bienvenue sur <span class="text-indigo-600">ma sante plus</span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Découvrez une expérience unique qui transformera votre façon de travailler. 
          Rejoignez des milliers d'utilisateurs satisfaits qui ont déjà fait le choix de l'excellence.
        </p>
        <!-- Hero Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="startJourney" class="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Commencer maintenant
          </button>
          <button @click="showMoreInfo" class="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors">
>>>>>>> 6f506420a02e20676352333842b78602f55cbfe5
            En savoir plus
          </button>
        </div>
      </div>

      <!-- Features Section -->
<<<<<<< HEAD
      <div class="mt-24">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Pourquoi nous choisir ?</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Des fonctionnalités pensées pour vous offrir la meilleure expérience possible</p>
        </div>

        <div class="grid md:grid-cols-3 gap-10">
          <!-- Feature Card 1 -->
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition duration-500 rounded-3xl blur"></div>
            <div class="relative bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div class="mb-8">
                <div class="relative inline-block">
                  <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl blur opacity-50"></div>
                  <div class="relative bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-2xl">
                    <Zap class="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Rapide et Efficace</h3>
              <p class="text-gray-600 leading-relaxed text-lg">Une performance optimisée pour vous faire gagner du temps et améliorer votre productivité.</p>
            </div>
          </div>

          <!-- Feature Card 2 -->
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-[#165DFB] to-sky-500 opacity-0 group-hover:opacity-100 transition duration-500 rounded-3xl blur"></div>
            <div class="relative bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div class="mb-8">
                <div class="relative inline-block">
                  <div class="absolute inset-0 bg-gradient-to-r from-[#165DFB] to-sky-500 rounded-2xl blur opacity-50"></div>
                  <div class="relative bg-gradient-to-r from-[#165DFB] to-sky-500 p-4 rounded-2xl">
                    <Shield class="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Sécurisé</h3>
              <p class="text-gray-600 leading-relaxed text-lg">Vos données sont protégées avec les dernières technologies de sécurité.</p>
            </div>
          </div>

          <!-- Feature Card 3 -->
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition duration-500 rounded-3xl blur"></div>
            <div class="relative bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div class="mb-8">
                <div class="relative inline-block">
                  <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-50"></div>
                  <div class="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <Users class="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Collaboratif</h3>
              <p class="text-gray-600 leading-relaxed text-lg">Travaillez en équipe facilement avec nos outils de collaboration intégrés.</p>
            </div>
          </div>
        </div>
=======
      <div class="mt-20 grid md:grid-cols-3 gap-8">
        <FeatureCard title="Rapide et Efficace" description="Une performance optimisée pour vous faire gagner du temps et améliorer votre productivité." iconClass="Zap" iconColor="green" />
        <FeatureCard title="Sécurisé" description="Vos données sont protégées avec les dernières technologies de sécurité." iconClass="Shield" iconColor="blue" />
        <FeatureCard title="Collaboratif" description="Travaillez en équipe facilement avec nos outils de collaboration intégrés." iconClass="Users" iconColor="purple" />
>>>>>>> 6f506420a02e20676352333842b78602f55cbfe5
      </div>

      <!-- Stats Section -->
      <div class="mt-20 bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Ils nous font confiance</h2>
          <p class="text-gray-600">Des chiffres qui parlent d'eux-mêmes</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <StatCard :value="animatedUsers" label="Utilisateurs actifs" iconClass="User" iconColor="indigo" />
          <StatCard :value="animatedProjects" label="Projets réalisés" iconClass="Project" iconColor="green" />
          <StatCard :value="animatedSatisfaction" label="Satisfaction client" iconClass="Star" iconColor="purple" />
        </div>
      </div>

      <!-- Call-to-Action Section -->
      <div class="mt-20 text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
        <h2 class="text-3xl font-bold mb-4">Prêt à commencer votre aventure ?</h2>
        <p class="text-xl mb-8 opacity-90">Rejoignez notre communauté et découvrez tout ce que nous avons à offrir.</p>
        <button @click="showWelcomeMessage" class="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
          Créer mon compte gratuitement
        </button>
      </div>
    </main>

    <!-- Footer Section -->
    <footer class="bg-gray-900 text-white mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <Sparkles class="h-6 w-6 text-indigo-400 mr-2" />
              <span class="text-xl font-bold">ma sante plus</span>
            </div>
            <p class="text-gray-400">Votre partenaire de confiance pour tous vos projets.</p>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Produit</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Fonctionnalités</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Tarifs</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Entreprise</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">À propos</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Carrières</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Support</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Centre d'aide</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Statut</a></li>
            </ul>
          </div>
        </div>
<<<<<<< HEAD
        <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p class="text-lg">&copy; 2025 ma santé plus. Tous droits réservés.</p>
=======
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ma sante plus. Tous droits réservés.</p>
>>>>>>> 6f506420a02e20676352333842b78602f55cbfe5
        </div>
      </div>
    </footer>

    <!-- Welcome Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 transform transition-all" @click.stop>
        <div class="text-center">
          <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="h-8 w-8 text-green-600" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Bienvenue !</h3>
          <p class="text-gray-600 mb-6">
            Merci de votre intérêt pour ma sante plus. Nous sommes ravis de vous accueillir dans notre communauté !
          </p>
          <button @click="closeModal" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Parfait !
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Link } from '@inertiajs/vue3'
import { Sparkles, Heart, Zap, Shield, Users, CheckCircle } from 'lucide-vue-next'

const showModal = ref(false)
const animatedUsers = ref(0)
const animatedProjects = ref(0)
const animatedSatisfaction = ref(0)

const startJourney = () => {
  Inertia.visit('/subcrib') 
}

const showWelcomeMessage = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const animateNumbers = () => {
  const duration = 2000
  const targetUsers = 10000
  const targetProjects = 5000
  const targetSatisfaction = 98

  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
<<<<<<< HEAD

    // Easing function pour un effet plus fluide
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)

    animatedUsers.value = Math.floor(targetUsers * easeOutQuart)
    animatedProjects.value = Math.floor(targetProjects * easeOutQuart)
    animatedSatisfaction.value = Math.floor(targetSatisfaction * easeOutQuart)

=======
    
    animatedUsers.value = Math.floor(targetUsers * progress)
    animatedProjects.value = Math.floor(targetProjects * progress)
    animatedSatisfaction.value = Math.floor(targetSatisfaction * progress)
    
>>>>>>> 6f506420a02e20676352333842b78602f55cbfe5
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}

onMounted(() => {
  // Démarrer l'animation des chiffres après un délai
  setTimeout(animateNumbers, 500)
})

const showMoreInfo = () => {
  Inertia.visit('/info') 
}
</script>

<style scoped>
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-30px);
  }
  70% {
    transform: translateY(-15px);
  }
  90% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

/* Empêche le scroll horizontal global */
html, body {
  overflow-x: hidden;
}
</style>
