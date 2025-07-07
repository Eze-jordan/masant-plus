<template>
    <div class="w-80 bg-blue-500 text-white flex flex-col">
      <div class="p-6">
        <div class="flex items-center gap-2 mb-8">
          <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span class="text-blue-500 font-bold text-sm">S</span>
          </div>
          <h1 class="text-xl font-bold">MaSanté</h1>
        </div>
        
        <nav class="space-y-2">
          <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            Dashboard
          </a>
          
          <div :class="{ 'bg-white bg-opacity-20 rounded-lg': activeSection === 'doctors' }">
            <button @click="toggleSection('doctors')" class="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Docteurs
              </div>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': activeSection === 'doctors' }" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </button>
            <div v-if="activeSection === 'doctors'" class="px-4 pb-2 space-y-1">
              <button 
                @click="$emit('navigate', 'doctors-manage')"
                :class="{ 'bg-white text-blue-500': currentPage === 'doctors-manage' }"
                class="w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10 rounded-lg font-medium transition-colors"
              >
                Gérer les docteurs
              </button>
              <button 
                @click="$emit('navigate', 'doctors-requests')"
                :class="{ 'bg-white text-blue-500': currentPage === 'doctors-requests' }"
                class="w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10 rounded-lg font-medium transition-colors"
              >
                Liste des demandes
              </button>
            </div>
          </div>
          
          <div :class="{ 'bg-white bg-opacity-20 rounded-lg': activeSection === 'patients' }">
            <button @click="toggleSection('patients')" class="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
                Patients
              </div>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': activeSection === 'patients' }" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </button>
            <div v-if="activeSection === 'patients'" class="px-4 pb-2">
              <button 
                @click="$emit('navigate', 'patients')"
                :class="{ 'bg-white text-blue-500': currentPage === 'patients' }"
                class="w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10 rounded-lg font-medium transition-colors"
              >
                Gérer les patients
              </button>
            </div>
          </div>
          
          <button class="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
              </svg>
              Urgent
            </div>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </button>
          
          <button class="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h6zM4 14a2 2 0 002 2h8a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2z"/>
              </svg>
              Paiement
            </div>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </button>
          
          <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"/>
            </svg>
            Paramètre
          </a>
        </nav>
      </div>
      
      <div class="mt-auto p-6 border-t border-blue-400">
        <div class="text-sm">
          <div class="font-semibold">Administrateur</div>
          <div class="text-blue-200">Administrateur@gmail.com</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
    props: {
      currentPage: {
        type: String,
        default: ''
      }
    },
    emits: ['navigate'],
    data() {
      return {
        activeSection: null
      }
    },
    methods: {
      toggleSection(section) {
        this.activeSection = this.activeSection === section ? null : section
      }
    },
    mounted() {
      // Auto-expand section based on current page
      if (this.currentPage.includes('doctors')) {
        this.activeSection = 'doctors'
      } else if (this.currentPage.includes('patients')) {
        this.activeSection = 'patients'
      }
    },
    watch: {
      currentPage(newPage) {
        if (newPage.includes('doctors')) {
          this.activeSection = 'doctors'
        } else if (newPage.includes('patients')) {
          this.activeSection = 'patients'
        }
      }
    }
  }
  </script>