<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const darkMode = ref(false)
const sidebarOpen = ref(window.innerWidth >= 1024)

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('darkMode', darkMode.value.toString())
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

onMounted(() => {
  // Check for saved dark mode preference
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Or use system preference
    darkMode.value = true
    document.documentElement.classList.add('dark')
  }

  // Handle window resize for responsive sidebar
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      sidebarOpen.value = true
    } else {
      sidebarOpen.value = false
    }
  })
})
</script>

<template>
  <div class="app-container">
    <AppHeader @toggle-sidebar="toggleSidebar" @toggle-dark-mode="toggleDarkMode" :dark-mode="darkMode" />
    
    <div class="app-content">
      <AppSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
      
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-content {
  display: flex;
  flex: 1;
  position: relative;
  height: calc(100vh - 60px);
}

.main-content {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
}

@media (max-width: 640px) {
  .main-content {
    padding: var(--space-4);
  }
}
</style>