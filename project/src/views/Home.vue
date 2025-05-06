<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/taskStore'

const router = useRouter()
const taskStore = useTaskStore()

onMounted(() => {
  if (!taskStore.isLoaded) {
    taskStore.loadTasks()
  }
})

const taskStats = computed(() => taskStore.getTaskStats)
const incompleteTasks = computed(() => taskStore.getIncompleteTasks)

const navigateToTasks = () => {
  router.push('/tasks')
}
</script>

<template>
  <div class="container home-container">
    <div class="welcome-section">
      <h1>Welcome to TaskFlow</h1>
      <p class="subtitle">Organize your tasks, boost your productivity</p>
      
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-value">{{ taskStats.total }}</div>
          <div class="stat-label">Total Tasks</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ taskStats.completed }}</div>
          <div class="stat-label">Completed</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ taskStats.incomplete }}</div>
          <div class="stat-label">In Progress</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ taskStats.completionRate }}%</div>
          <div class="stat-label">Completion Rate</div>
        </div>
      </div>
      
      <button class="btn" @click="navigateToTasks">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
          <path d="M12 5v14"></path>
          <path d="m19 12-7 7-7-7"></path>
        </svg>
        Manage Tasks
      </button>
    </div>
    
    <div class="tasks-overview" v-if="incompleteTasks.length > 0">
      <h2>Upcoming Tasks</h2>
      
      <div class="quick-tasks">
        <div class="quick-task" v-for="task in incompleteTasks.slice(0, 3)" :key="task.id" @click="router.push(`/tasks/${task.id}`)">
          <div class="quick-task-priority" :class="`priority-${task.priority}`"></div>
          <div class="quick-task-content">
            <h3>{{ task.title }}</h3>
            <p v-if="task.dueDate" class="task-due-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
              Due {{ new Date(task.dueDate).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 900px;
}

.welcome-section {
  text-align: center;
  margin-bottom: var(--space-10);
  animation: fadeIn 0.5s ease;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--neutral-600);
  margin-bottom: var(--space-8);
}

.dark .subtitle {
  color: var(--neutral-400);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
  margin: var(--space-8) 0;
}

.stat-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all var(--transition-normal);
}

.dark .stat-card {
  background-color: var(--neutral-800);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.dark .stat-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-500);
  margin-bottom: var(--space-2);
}

.stat-label {
  font-size: 1rem;
  color: var(--neutral-600);
  font-weight: 500;
}

.dark .stat-label {
  color: var(--neutral-400);
}

.btn svg {
  margin-right: var(--space-2);
}

.tasks-overview {
  margin-top: var(--space-12);
  animation: slideUp 0.5s ease;
}

.tasks-overview h2 {
  margin-bottom: var(--space-6);
}

.quick-tasks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.quick-task {
  display: flex;
  background-color: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.dark .quick-task {
  background-color: var(--neutral-800);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-task:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.dark .quick-task:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.quick-task-priority {
  width: 8px;
  flex-shrink: 0;
}

.priority-low {
  background-color: var(--success-500);
}

.priority-medium {
  background-color: var(--warning-500);
}

.priority-high {
  background-color: var(--error-500);
}

.quick-task-content {
  padding: var(--space-4);
  flex-grow: 1;
}

.quick-task-content h3 {
  margin-top: 0;
  margin-bottom: var(--space-2);
  font-size: 1.1rem;
}

.task-due-date {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--neutral-600);
  font-size: 0.875rem;
  margin: 0;
}

.dark .task-due-date {
  color: var(--neutral-400);
}
</style>