<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 overflow-x-hidden">
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <!-- Header Section -->
    <header class="relative z-10 bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <!-- Logo and Brand Name -->
          <div class="flex items-center group cursor-pointer">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-[#165DFB] to-cyan-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative bg-white p-3 rounded-xl shadow-lg">
                <Sparkles class="h-7 w-7 text-[#165DFB]" />
              </div>
            </div>
            <h1 class="ml-4 text-3xl font-bold bg-gradient-to-r from-[#165DFB] to-cyan-500 bg-clip-text text-transparent">
              ma santé plus
            </h1>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex space-x-10">
            <Link href="/" class="relative text-gray-700 hover:text-[#165DFB] transition-all duration-300 group font-medium">
              <span>Accueil</span>
              <div class="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-[#165DFB] to-cyan-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/about" class="relative text-gray-700 hover:text-[#165DFB] transition-all duration-300 group font-medium">
              <span>À propos</span>
              <div class="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-[#165DFB] to-cyan-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/service" class="relative text-gray-700 hover:text-[#165DFB] transition-all duration-300 group font-medium">
              <span>Services</span>
              <div class="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-[#165DFB] to-cyan-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/contact" class="relative text-gray-700 hover:text-[#165DFB] transition-all duration-300 group font-medium">
              <span>Contact</span>
              <div class="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-[#165DFB] to-cyan-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>

          <!-- Connexion Button -->
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[#165DFB] to-cyan-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <Link href="/login" class="relative bg-white text-[#165DFB] px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg border border-[#165DFB]/20">
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <!-- Animated Heart Icon -->
        <div class="relative mb-12">
          <div class="animate-bounce">
            <div class="relative inline-block">
              <div class="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>
              <div class="relative bg-white/95 backdrop-blur-sm p-6 rounded-full shadow-2xl border border-white/50">
                <Heart class="h-16 w-16 text-red-500" />
              </div>
            </div>
          </div>
        </div>

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
            En savoir plus
          </button>
        </div>

        <!-- Trust Indicators -->
        <div class="flex flex-wrap justify-center items-center gap-8 text-lg text-gray-600 mb-12">
          <div class="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            <span class="font-medium">100% Sécurisé</span>
          </div>
          <div class="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <div class="w-3 h-3 bg-[#165DFB] rounded-full mr-3 animate-pulse"></div>
            <span class="font-medium">Support 24/7</span>
          </div>
          <div class="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <div class="w-3 h-3 bg-cyan-500 rounded-full mr-3 animate-pulse"></div>
            <span class="font-medium">Gratuit 30 jours</span>
          </div>
        </div>
      </div>

      <!-- Features Section -->
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
      </div>

      <!-- Stats Section -->
      <div class="mt-24">
        <div class="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/30">
          <div class="absolute inset-0 bg-gradient-to-r from-[#165DFB]/5 to-cyan-500/5 rounded-3xl"></div>
          <div class="relative">
            <div class="text-center mb-12">
              <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ils nous font confiance</h2>
              <p class="text-xl text-gray-600">Des chiffres qui parlent d'eux-mêmes</p>
            </div>
            <div class="grid md:grid-cols-3 gap-10 text-center">
              <!-- Stat Card 1 -->
              <div class="group">
                <div class="relative p-8 rounded-3xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm border border-white/30 hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                  <div class="flex items-center justify-center mb-6">
                    <div class="relative">
                      <div class="absolute inset-0 bg-gradient-to-r from-[#165DFB] to-sky-500 rounded-full blur opacity-50"></div>
                      <div class="relative bg-gradient-to-r from-[#165DFB] to-sky-500 p-4 rounded-full">
                        <Users class="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    {{ animatedUsers.toLocaleString() }}
                  </div>
                  <div class="text-gray-600 font-semibold text-lg">Utilisateurs actifs</div>
                </div>
              </div>

              <!-- Stat Card 2 -->
              <div class="group">
                <div class="relative p-8 rounded-3xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm border border-white/30 hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                  <div class="flex items-center justify-center mb-6">
                    <div class="relative">
                      <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur opacity-50"></div>
                      <div class="relative bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-full">
                        <CheckCircle class="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    {{ animatedProjects.toLocaleString() }}
                  </div>
                  <div class="text-gray-600 font-semibold text-lg">Projets réalisés</div>
                </div>
              </div>

              <!-- Stat Card 3 -->
              <div class="group">
                <div class="relative p-8 rounded-3xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm border border-white/30 hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                  <div class="flex items-center justify-center mb-6">
                    <div class="relative">
                      <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50"></div>
                      <div class="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
                        <Heart class="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    {{ animatedSatisfaction }}%
                  </div>
                  <div class="text-gray-600 font-semibold text-lg">Satisfaction client</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call-to-Action Section -->
      <div class="mt-24">
        <div class="relative bg-gradient-to-r from-[#165DFB] via-sky-500 to-cyan-500 rounded-3xl p-16 text-white overflow-hidden">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="absolute top-0 left-0 w-full h-full">
            <div class="absolute top-12 left-12 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
            <div class="absolute bottom-12 right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          <div class="relative text-center">
            <h2 class="text-4xl md:text-6xl font-bold mb-8">Prêt à commencer votre aventure ?</h2>
            <p class="text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
              Rejoignez notre communauté et découvrez tout ce que nous avons à offrir pour améliorer votre bien-être.
            </p>
            <div class="relative group inline-block">
              <div class="absolute -inset-1 bg-white/40 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <button @click="showWelcomeMessage" class="relative bg-white text-[#165DFB] px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                <span class="flex items-center">
                  Créer mon compte gratuitement
                  <Heart class="ml-3 h-7 w-7 text-red-500" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Section -->
    <footer class="relative z-10 bg-gray-900 text-white mt-24">
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid md:grid-cols-4 gap-12">
          <div>
            <div class="flex items-center mb-6">
              <div class="bg-gradient-to-r from-[#165DFB] to-cyan-500 p-3 rounded-xl mr-4">
                <Sparkles class="h-6 w-6 text-white" />
              </div>
              <span class="text-2xl font-bold">ma santé plus</span>
            </div>
            <p class="text-gray-400 leading-relaxed text-lg">Votre partenaire de confiance pour tous vos besoins de santé et bien-être.</p>
          </div>
          <div>
            <h3 class="font-bold mb-6 text-[#165DFB] text-xl">Produit</h3>
            <ul class="space-y-4 text-gray-400">
              <li><Link href="/login" class="hover:text-white transition-colors hover:translate-x-2 transform duration-300 inline-block text-lg">Fonctionnalités</Link></li>
              <li><Link href="/login" class="hover:text-white transition-colors hover:translate-x-2 transform duration-300 inline-block text-lg">Tarifs</Link></li>
              <li><Link href="/login" class="hover:text-white transition-colors hover:translate-x-2 transform duration-300 inline-block text-lg">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold mb-6 text-sky-400 text-xl">Entreprise</h3>
            <ul class="space-y-4 text-gray-400">
              <li><Link href="/login" class="hover:text-white transition-colors hover:translate-x-2 transform duration-300 inline-block text-lg">À propos</Link></li>
              <li><Link href="/login" class="hover:text-white transition-colors hover:translate-x-2 transform duration-300 inline-block text-lg">Carrières</Link></li>
              <li><Link href="/login" class="hover:text-white transition-colors hover:translate-x-2 transform duration-300 inline-block text-lg">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold mb-6 text-cyan-400 text-xl">Support</h3>
            <ul class="space-y-4 text-gray-400">
              <li><Link href="/login" class="hover:text-white transition-colors hover:translate-x-2 transform duration-300 inline-block text-lg">Centre d'aide</Link></li>
              <li><Link href="/login" class="hover:text-white transition-colors hover:translate-x-2 transform duration-300 inline-block text-lg">Contact</Link></li>
              <li><Link href="/login" class="hover:text-white transition-colors hover:translate-x-2 transform duration-300 inline-block text-lg">Statut</Link></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p class="text-lg">&copy; 2025 ma santé plus. Tous droits réservés.</p>
        </div>
      </div>
    </footer>

    <!-- Welcome Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="closeModal">
        <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-12 max-w-lg mx-4 transform transition-all shadow-2xl border border-white/30" @click.stop>
          <div class="text-center">
            <div class="relative mb-8">
              <div class="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>
              <div class="relative bg-gradient-to-r from-green-100 to-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle class="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h3 class="text-3xl font-bold text-gray-900 mb-6">Bienvenue !</h3>
            <p class="text-gray-600 mb-8 leading-relaxed text-lg">
              Merci de votre intérêt pour ma santé plus. Nous sommes ravis de vous accueillir dans notre communauté !
            </p>
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-[#165DFB] to-cyan-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <button @click="closeModal" class="relative bg-gradient-to-r from-[#165DFB] to-cyan-500 text-white px-10 py-4 rounded-2xl text-xl font-semibold hover:from-[#0F4FD9] hover:to-cyan-600 transition-all duration-300 shadow-xl">
                Parfait !
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Sparkles, Heart, Zap, Shield, Users, CheckCircle } from 'lucide-vue-next'
import { Link } from '@inertiajs/vue3'

const showModal = ref(false)
const animatedUsers = ref(0)
const animatedProjects = ref(0)
const animatedSatisfaction = ref(0)

const startJourney = () => {
  console.log('Starting journey...')
}

const showWelcomeMessage = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const animateNumbers = () => {
  const duration = 2500
  const targetUsers = 15000
  const targetProjects = 8500
  const targetSatisfaction = 98

  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function pour un effet plus fluide
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)

    animatedUsers.value = Math.floor(targetUsers * easeOutQuart)
    animatedProjects.value = Math.floor(targetProjects * easeOutQuart)
    animatedSatisfaction.value = Math.floor(targetSatisfaction * easeOutQuart)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}

onMounted(() => {
  setTimeout(animateNumbers, 800)
})

const showMoreInfo = () => {
  console.log('Show more info...')
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

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 4s ease infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-50px);
}



/* Smooth scrolling */


/* Custom scrollbar avec la couleur principale */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #165DFB, #0ea5e9);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0F4FD9, #0284c7);
}

/* Effet de glow sur les éléments interactifs */
.glow-effect {
  box-shadow: 0 0 20px rgba(22, 93, 251, 0.3);
}

/* Animation pour les cartes */
@keyframes cardHover {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-10px) scale(1.02); }
}

.card-hover:hover {
  animation: cardHover 0.3s ease-out forwards;
}

/* Effet de particules flottantes */
.floating-particles::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, rgba(22, 93, 251, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: float 20s linear infinite;
  pointer-events: none;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .text-5xl { font-size: 2.5rem; }
  .text-7xl { font-size: 3.5rem; }
  .text-4xl { font-size: 2rem; }
  .text-6xl { font-size: 3rem; }
}
</style>
