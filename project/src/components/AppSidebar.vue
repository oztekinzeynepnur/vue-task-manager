<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])
const router = useRouter()
const route = useRoute()

const navItems = [
  { 
    name: 'Home', 
    path: '/', 
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
  },
  { 
    name: 'Tasks', 
    path: '/tasks', 
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path><path d="m9 12 2 2 4-4"></path></svg>`
  },
  { 
    name: 'Statistics', 
    path: '/stats', 
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>`
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
  }
]

const isActive = (path: string) => {
  if (path === '/' && route.path === '/') {
    return true
  }
  if (path !== '/' && route.path.startsWith(path)) {
    return true
  }
  return false
}

const handleNavigation = (path: string) => {
  router.push(path)
  if (window.innerWidth < 1024) {
    emit('close')
  }
}

const overlayClass = computed(() => {
  return {
    'sidebar-overlay': true,
    'active': props.isOpen && window.innerWidth < 1024
  }
})

const sidebarClass = computed(() => {
  return {
    'sidebar': true,
    'open': props.isOpen
  }
})
</script>

<template>
  <div class="sidebar-container">
    <div :class="overlayClass" @click="emit('close')"></div>
    <aside :class="sidebarClass">
      <nav class="sidebar-nav">
        <ul>
          <li v-for="item in navItems" :key="item.name">
            <a 
              href="#" 
              @click.prevent="handleNavigation(item.path)" 
              :class="{ active: isActive(item.path) }"
            >
              <span v-html="item.icon" class="nav-icon"></span>
              {{ item.name }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<style scoped>
.sidebar-container {
  position: relative;
  height: 100%;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 90;
  display: none;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.sidebar-overlay.active {
  display: block;
  opacity: 1;
}

.sidebar {
  width: 250px;
  height: 100%;
  background-color: white;
  border-right: 1px solid var(--neutral-200);
  transition: transform var(--transition-normal);
  z-index: 95;
  overflow-y: auto;
}

.dark .sidebar {
  background-color: var(--neutral-800);
  border-right: 1px solid var(--neutral-700);
}

@media (max-width: 1023px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    height: calc(100vh - 60px);
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

.sidebar-nav {
  padding: var(--space-4) 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: var(--space-1);
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  color: var(--neutral-700);
  text-decoration: none;
  transition: all var(--transition-quick);
  border-radius: var(--radius-md);
  margin: 0 var(--space-2);
}

.dark .sidebar-nav a {
  color: var(--neutral-300);
}

.sidebar-nav a:hover {
  background-color: var(--neutral-100);
  color: var(--primary-700);
}

.dark .sidebar-nav a:hover {
  background-color: var(--neutral-700);
  color: var(--primary-300);
}

.sidebar-nav a.active {
  background-color: var(--primary-50);
  color: var(--primary-700);
  font-weight: 500;
}

.dark .sidebar-nav a.active {
  background-color: var(--neutral-700);
  color: var(--primary-300);
}

.nav-icon {
  margin-right: var(--space-3);
  display: flex;
  align-items: center;
}
</style>