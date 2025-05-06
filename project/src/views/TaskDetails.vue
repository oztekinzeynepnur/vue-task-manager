<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../stores/taskStore'
import { format } from 'date-fns'
import type { Task } from '../types'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const isEditing = ref(false)

const editableTask = ref<Task | null>(null)

onMounted(() => {
  if (!taskStore.isLoaded) {
    taskStore.loadTasks()
  }
  loadTask()
})

const task = computed(() => {
  const id = route.params.id as string
  return taskStore.getTaskById(id)
})

const loadTask = () => {
  if (task.value) {
    editableTask.value = { ...task.value }
  } else {
    router.push('/tasks')
  }
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMMM d, yyyy')
}

const toggleEditMode = () => {
  if (isEditing.value) {
    // Cancel editing
    loadTask()
  }
  isEditing.value = !isEditing.value
}

const saveTask = () => {
  if (editableTask.value) {
    taskStore.updateTask(editableTask.value)
    isEditing.value = false
  }
}

const deleteTask = () => {
  if (task.value && confirm('Are you sure you want to delete this task?')) {
    taskStore.deleteTask(task.value.id)
    router.push('/tasks')
  }
}

const goBack = () => {
  router.back()
}

const toggleCompleted = () => {
  if (task.value) {
    const updatedTask = { ...task.value, completed: !task.value.completed }
    taskStore.updateTask(updatedTask)
  }
}
</script>

<template>
  <div class="container task-details-container" v-if="task">
    <div class="task-details-header">
      <button class="btn ghost back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"></path>
        </svg>
        Back
      </button>
      
      <div class="header-actions">
        <button class="btn ghost" @click="toggleEditMode">
          <span v-if="isEditing">Cancel</span>
          <span v-else>Edit</span>
        </button>
        <button class="btn accent" @click="deleteTask">Delete</button>
      </div>
    </div>
    
    <div class="task-details-card">
      <div v-if="!isEditing" class="view-mode">
        <div class="task-header">
          <div class="task-status">
            <button 
              class="checkbox large" 
              @click="toggleCompleted" 
              :class="{ completed: task.completed }"
            >
              <svg v-if="task.completed" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </button>
            <span class="status-text">{{ task.completed ? 'Completed' : 'In Progress' }}</span>
          </div>
          
          <div 
            class="priority-badge"
            :class="`priority-${task.priority}`"
          >
            {{ task.priority }}
          </div>
        </div>
        
        <h1 class="task-title" :class="{ completed: task.completed }">{{ task.title }}</h1>
        
        <div class="task-dates">
          <div class="date-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
            <span>Created: {{ formatDate(task.createdAt) }}</span>
          </div>
          
          <div class="date-item" v-if="task.dueDate">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
              <path d="M16 16l-4-4l4-4"></path>
            </svg>
            <span>Due: {{ formatDate(task.dueDate) }}</span>
          </div>
        </div>
        
        <div class="task-description">
          <h3>Description</h3>
          <p v-if="task.description">{{ task.description }}</p>
          <p v-else class="no-description">No description provided</p>
        </div>
      </div>
      
      <div v-else class="edit-mode">
        <form @submit.prevent="saveTask">
          <div class="form-group">
            <label for="title">Task Title</label>
            <input type="text" id="title" v-model="editableTask.title" required />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="editableTask.description" rows="4"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" v-model="editableTask.priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="dueDate">Due Date</label>
              <input 
                type="date" 
                id="dueDate" 
                v-model="editableTask.dueDate"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="editableTask.completed" />
              <span>Mark as completed</span>
            </label>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn ghost" @click="toggleEditMode">Cancel</button>
            <button type="submit" class="btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-details-container {
  max-width: 800px;
  animation: fadeIn 0.3s ease;
}

.task-details-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.back-button {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.header-actions {
  display: flex;
  gap: var(--space-2);
}

.task-details-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark .task-details-card {
  background-color: var(--neutral-800);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.task-status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.checkbox.large {
  width: 28px;
  height: 28px;
}

.status-text {
  font-weight: 500;
  color: var(--neutral-600);
}

.dark .status-text {
  color: var(--neutral-400);
}

.checkbox.completed {
  background-color: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.dark .checkbox.completed {
  background-color: var(--primary-600);
  border-color: var(--primary-600);
}

.priority-badge {
  font-size: 0.85rem;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: 500;
  text-transform: capitalize;
}

.priority-low {
  background-color: var(--success-500);
  color: white;
}

.priority-medium {
  background-color: var(--warning-500);
  color: white;
}

.priority-high {
  background-color: var(--error-500);
  color: white;
}

.task-title {
  font-size: 1.8rem;
  margin-bottom: var(--space-6);
}

.task-title.completed {
  text-decoration: line-through;
  color: var(--neutral-500);
}

.task-dates {
  display: flex;
  gap: var(--space-6);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}

.date-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--neutral-600);
  font-size: 0.9rem;
}

.dark .date-item {
  color: var(--neutral-400);
}

.task-description {
  border-top: 1px solid var(--neutral-200);
  padding-top: var(--space-4);
}

.dark .task-description {
  border-top-color: var(--neutral-700);
}

.task-description h3 {
  font-size: 1.2rem;
  margin-bottom: var(--space-3);
  color: var(--neutral-700);
}

.dark .task-description h3 {
  color: var(--neutral-300);
}

.no-description {
  font-style: italic;
  color: var(--neutral-500);
}

.edit-mode {
  animation: fadeIn 0.3s ease;
}

.form-row {
  display: flex;
  gap: var(--space-4);
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
  }
  
  .task-dates {
    flex-direction: column;
    gap: var(--space-2);
  }
}

.form-group {
  margin-bottom: var(--space-4);
  width: 100%;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-4);
}
</style>