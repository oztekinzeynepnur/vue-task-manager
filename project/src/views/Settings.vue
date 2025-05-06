<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const taskStore = useTaskStore()
const clearConfirm = ref(false)

onMounted(() => {
  if (!taskStore.isLoaded) {
    taskStore.loadTasks()
  }
})

const exportTasks = () => {
  const tasks = taskStore.getAllTasks
  const dataStr = JSON.stringify(tasks, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  
  const exportFileDefaultName = `taskflow-export-${new Date().toISOString().split('T')[0]}.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

const clearAllTasks = () => {
  if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
    // Clear all tasks by replacing with empty array
    taskStore.tasks = []
    localStorage.setItem('tasks', JSON.stringify([]))
    clearConfirm.value = false
  }
}

const restoreDefaultTasks = () => {
  if (confirm('This will replace all your current tasks with sample tasks. Continue?')) {
    // Add sample tasks
    const sampleTasks = [
      {
        id: '1',
        title: 'Complete Vue.js tutorial',
        description: 'Finish the Vue.js documentation and try building a small project',
        priority: 'high',
        completed: false,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString()
      },
      {
        id: '2',
        title: 'Buy groceries',
        description: 'Get milk, eggs, bread, and vegetables',
        priority: 'medium',
        completed: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        dueDate: new Date(Date.now()).toISOString()
      },
      {
        id: '3',
        title: 'Schedule dentist appointment',
        description: '',
        priority: 'low',
        completed: false,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString()
      }
    ]
    
    taskStore.tasks = sampleTasks
    localStorage.setItem('tasks', JSON.stringify(sampleTasks))
  }
}
</script>

<template>
  <div class="container settings-container">
    <h1>Settings</h1>
    
    <div class="settings-section">
      <h2>Data Management</h2>
      
      <div class="settings-card">
        <div class="setting-item">
          <div class="setting-info">
            <h3>Export Tasks</h3>
            <p>Download all your tasks as a JSON file</p>
          </div>
          <button class="btn" @click="exportTasks">Export</button>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3>Clear All Tasks</h3>
            <p>Remove all tasks from the application</p>
          </div>
          <div v-if="!clearConfirm">
            <button class="btn accent" @click="clearConfirm = true">Clear</button>
          </div>
          <div v-else class="confirm-actions">
            <button class="btn ghost" @click="clearConfirm = false">Cancel</button>
            <button class="btn accent" @click="clearAllTasks">Confirm</button>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3>Restore Default Tasks</h3>
            <p>Reset to example tasks</p>
          </div>
          <button class="btn secondary" @click="restoreDefaultTasks">Restore</button>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h2>About TaskFlow</h2>
      
      <div class="settings-card">
        <div class="about-section">
          <div class="app-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="logo-icon">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <h3 class="app-name">TaskFlow</h3>
          </div>
          
          <p class="app-description">
            A beautiful task management application built with Vue.js and TypeScript.
            Organize your tasks, boost your productivity, and stay on top of your to-do list.
          </p>
          
          <div class="version-info">
            <p>Version 0.1.0</p>
            <p>Created with Vue 3 + TypeScript + Vite</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 800px;
  animation: fadeIn 0.5s ease;
}

.settings-section {
  margin-bottom: var(--space-8);
}

.settings-section h2 {
  margin-bottom: var(--space-4);
  color: var(--neutral-700);
}

.dark .settings-section h2 {
  color: var(--neutral-300);
}

.settings-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark .settings-card {
  background-color: var(--neutral-800);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--neutral-200);
}

.dark .setting-item {
  border-bottom-color: var(--neutral-700);
}

.setting-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.setting-info {
  flex: 1;
}

.setting-info h3 {
  margin: 0 0 var(--space-1) 0;
  font-size: 1.1rem;
}

.setting-info p {
  margin: 0;
  color: var(--neutral-600);
  font-size: 0.9rem;
}

.dark .setting-info p {
  color: var(--neutral-400);
}

.confirm-actions {
  display: flex;
  gap: var(--space-2);
}

.about-section {
  text-align: center;
  padding: var(--space-4) 0;
}

.app-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-4);
}

.logo-icon {
  color: var(--primary-500);
  margin-bottom: var(--space-2);
}

.app-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-500);
  margin: 0;
}

.app-description {
  max-width: 500px;
  margin: 0 auto var(--space-6) auto;
  color: var(--neutral-700);
}

.dark .app-description {
  color: var(--neutral-300);
}

.version-info {
  font-size: 0.9rem;
  color: var(--neutral-500);
}

.version-info p {
  margin: 0 0 var(--space-1) 0;
}

.dark .version-info {
  color: var(--neutral-500);
}
</style>