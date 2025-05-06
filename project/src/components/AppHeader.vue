<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps<{
  darkMode: boolean
}>()

const emit = defineEmits(['toggleSidebar', 'toggleDarkMode'])
const router = useRouter()

const handleToggleSidebar = () => {
  emit('toggleSidebar')
}

const handleToggleDarkMode = () => {
  emit('toggleDarkMode')
}

const navigateHome = () => {
  router.push('/')
}
</script>

<template>
  <header class="app-header">
    <div class="container header-container">
      <div class="header-left">
        <button class="menu-button" @click="handleToggleSidebar" aria-label="Toggle Sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="logo" @click="navigateHome">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <span class="logo-text">TaskFlow</span>
        </div>
      </div>
      
      <div class="header-right">
        <button class="theme-toggle" @click="handleToggleDarkMode" aria-label="Toggle Dark Mode">
          <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid var(--neutral-200);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all var(--transition-normal);
}

.dark .app-header {
  background-color: var(--neutral-800);
  border-bottom: 1px solid var(--neutral-700);
}

.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.menu-button {
  background: transparent;
  border: none;
  color: var(--neutral-700);
  padding: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color var(--transition-quick);
}

.dark .menu-button {
  color: var(--neutral-300);
}

.menu-button:hover {
  color: var(--primary-500);
  background-color: transparent;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  color: var(--primary-500);
  font-weight: 600;
  font-size: 1.25rem;
}

.logo svg {
  stroke: var(--primary-500);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.theme-toggle {
  background: transparent;
  border: none;
  color: var(--neutral-700);
  padding: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color var(--transition-quick);
}

.dark .theme-toggle {
  color: var(--neutral-300);
}

.theme-toggle:hover {
  color: var(--primary-500);
  background-color: transparent;
}

@media (max-width: 640px) {
  .logo-text {
    display: none;
  }
}
</style>