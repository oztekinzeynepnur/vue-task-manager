<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Task } from '../types'
import { format } from 'date-fns'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits(['update:task', 'delete:task'])
const router = useRouter()
const isExpanded = ref(false)

const priorityClasses = {
  low: 'priority-low',
  medium: 'priority-medium',
  high: 'priority-high'
}

const toggleCompleted = () => {
  emit('update:task', {
    ...props.task,
    completed: !props.task.completed
  })
}

const viewTaskDetails = () => {
  router.push(`/tasks/${props.task.id}`)
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const deleteTask = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete:task', props.task.id)
  }
}
</script>

<template>
  <div 
    class="task-item-container"
    :class="{ 
      'completed': task.completed, 
      'expanded': isExpanded 
    }"
  >
    <div class="task-item" @click="toggleExpanded">
      <div class="task-checkbox-title">
        <button class="checkbox" @click.stop="toggleCompleted" :aria-checked="task.completed">
          <svg v-if="task.completed" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </button>
        <div class="task-info">
          <h3 class="task-title">{{ task.title }}</h3>
          <p class="task-date" v-if="task.dueDate">Due {{ formatDate(task.dueDate) }}</p>
        </div>
      </div>
      
      <div class="task-meta">
        <span 
          class="task-priority" 
          :class="priorityClasses[task.priority]"
        >
          {{ task.priority }}
        </span>
        <button class="expand-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{'rotate': isExpanded}">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="task-details" v-if="isExpanded">
      <p v-if="task.description">{{ task.description }}</p>
      <p v-else class="no-description">No description provided</p>
      
      <div class="task-actions">
        <button class="btn ghost" @click="viewTaskDetails">View Details</button>
        <button class="btn accent" @click="deleteTask">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-item-container {
  background-color: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-200);
  margin-bottom: var(--space-3);
  transition: all var(--transition-normal);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.dark .task-item-container {
  background-color: var(--neutral-800);
  border: 1px solid var(--neutral-700);
}

.task-item-container:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.dark .task-item-container:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.task-item-container.completed {
  border-color: var(--neutral-200);
  opacity: 0.7;
}

.task-item {
  padding: var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.task-checkbox-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.checkbox {
  width: 22px;
  height: 22px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--neutral-300);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all var(--transition-quick);
  flex-shrink: 0;
}

.dark .checkbox {
  border-color: var(--neutral-600);
  background-color: var(--neutral-800);
}

.checkbox:hover {
  border-color: var(--primary-500);
  background-color: var(--primary-50);
}

.dark .checkbox:hover {
  border-color: var(--primary-400);
  background-color: rgba(10, 132, 255, 0.1);
}

.completed .checkbox {
  background-color: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.dark .completed .checkbox {
  background-color: var(--primary-600);
  border-color: var(--primary-600);
}

.task-info {
  display: flex;
  flex-direction: column;
}

.task-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--neutral-900);
  transition: all var(--transition-quick);
}

.dark .task-title {
  color: var(--neutral-100);
}

.completed .task-title {
  text-decoration: line-through;
  color: var(--neutral-500);
}

.task-date {
  margin: 0;
  font-size: 0.8rem;
  color: var(--neutral-500);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.task-priority {
  font-size: 0.75rem;
  padding: var(--space-1) var(--space-2);
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

.expand-button {
  background: transparent;
  border: none;
  color: var(--neutral-500);
  padding: var(--space-1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-button svg {
  transition: transform var(--transition-quick);
}

.expand-button svg.rotate {
  transform: rotate(180deg);
}

.task-details {
  padding: 0 var(--space-4) var(--space-4);
  animation: slideDown var(--transition-normal);
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

.no-description {
  font-style: italic;
  color: var(--neutral-500);
}

.task-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.task-actions button {
  padding: var(--space-1) var(--space-3);
  font-size: 0.9rem;
}
</style>