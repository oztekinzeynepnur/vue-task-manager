<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import TaskForm from '../components/TaskForm.vue'
import TaskItem from '../components/TaskItem.vue'
import { useTaskStore } from '../stores/taskStore'
import type { Task } from '../types'

const taskStore = useTaskStore()
const showForm = ref(false)
const searchQuery = ref('')
const filterPriority = ref('all')
const filterStatus = ref('all')

onMounted(() => {
  if (!taskStore.isLoaded) {
    taskStore.loadTasks()
  }
})

const toggleForm = () => {
  showForm.value = !showForm.value
}

const handleAddTask = (task: Task) => {
  taskStore.addTask(task)
  showForm.value = false
}

const handleUpdateTask = (updatedTask: Task) => {
  taskStore.updateTask(updatedTask)
}

const handleDeleteTask = (id: string) => {
  taskStore.deleteTask(id)
}

// Filtered tasks based on search, priority, and status
const filteredTasks = computed(() => {
  let result = taskStore.getAllTasks

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(task => 
      task.title.toLowerCase().includes(query) || 
      task.description.toLowerCase().includes(query)
    )
  }

  // Filter by priority
  if (filterPriority.value !== 'all') {
    result = result.filter(task => task.priority === filterPriority.value)
  }

  // Filter by completion status
  if (filterStatus.value === 'completed') {
    result = result.filter(task => task.completed)
  } else if (filterStatus.value === 'incomplete') {
    result = result.filter(task => !task.completed)
  }

  return result
})
</script>

<template>
  <div class="container tasks-container">
    <div class="tasks-header">
      <h1>My Tasks</h1>
      <button class="btn" @click="toggleForm">
        <span v-if="showForm">Cancel</span>
        <span v-else>Add New Task</span>
      </button>
    </div>
    
    <TaskForm v-if="showForm" @submit="handleAddTask" />
    
    <div class="tasks-filters">
      <div class="search-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search tasks..." 
          class="search-input"
        />
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <label for="priorityFilter">Priority:</label>
          <select id="priorityFilter" v-model="filterPriority">
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="statusFilter">Status:</label>
          <select id="statusFilter" v-model="filterStatus">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="tasks-list" v-if="filteredTasks.length > 0">
      <TaskItem 
        v-for="task in filteredTasks" 
        :key="task.id" 
        :task="task"
        @update:task="handleUpdateTask"
        @delete:task="handleDeleteTask"
      />
    </div>
    
    <div class="empty-state" v-else>
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
        <line x1="16" x2="16" y1="2" y2="6"></line>
        <line x1="8" x2="8" y1="2" y2="6"></line>
        <line x1="3" x2="21" y1="10" y2="10"></line>
        <path d="m9 16 2 2 4-4"></path>
      </svg>
      <h3>No tasks found</h3>
      <p>Create a new task or adjust your filters</p>
      <button class="btn" @click="toggleForm" v-if="!showForm">Add Your First Task</button>
    </div>
  </div>
</template>

<style scoped>
.tasks-container {
  max-width: 800px;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.tasks-filters {
  margin-bottom: var(--space-6);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--neutral-500);
}

.search-input {
  padding-left: var(--space-8);
  width: 100%;
}

.filters {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.filter-group label {
  white-space: nowrap;
  font-weight: 500;
  color: var(--neutral-700);
}

.dark .filter-group label {
  color: var(--neutral-300);
}

.filter-group select {
  width: auto;
  min-width: 120px;
}

.tasks-list {
  margin-top: var(--space-6);
  animation: fadeIn 0.5s ease;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) 0;
  color: var(--neutral-500);
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.empty-state svg {
  margin-bottom: var(--space-4);
  color: var(--neutral-400);
}

.empty-state h3 {
  margin-bottom: var(--space-2);
  color: var(--neutral-700);
}

.dark .empty-state h3 {
  color: var(--neutral-300);
}

.empty-state p {
  margin-bottom: var(--space-6);
}

@media (max-width: 640px) {
  .tasks-filters {
    flex-direction: column;
  }
  
  .filters {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-group select {
    flex: 1;
  }
}
</style>