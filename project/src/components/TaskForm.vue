<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Task } from '../types'

const emit = defineEmits(['submit'])

const initialTask = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: ''
}

const newTask = reactive({ ...initialTask })
const error = ref('')

const submitTask = () => {
  if (!newTask.title.trim()) {
    error.value = 'Title is required'
    return
  }

  error.value = ''
  
  // Create new task with generated ID and default values
  const task: Task = {
    id: Date.now().toString(),
    title: newTask.title.trim(),
    description: newTask.description.trim(),
    priority: newTask.priority as 'low' | 'medium' | 'high',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : ''
  }
  
  emit('submit', task)
  
  // Reset form
  Object.assign(newTask, initialTask)
}
</script>

<template>
  <form @submit.prevent="submitTask" class="task-form">
    <div class="form-group">
      <label for="title">Task Title</label>
      <input 
        type="text" 
        id="title" 
        v-model="newTask.title" 
        placeholder="What needs to be done?"
        :class="{ 'error': error }"
      />
      <p class="error-message" v-if="error">{{ error }}</p>
    </div>
    
    <div class="form-group">
      <label for="description">Description (optional)</label>
      <textarea 
        id="description" 
        v-model="newTask.description" 
        placeholder="Add details about this task"
        rows="3"
      ></textarea>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="priority">Priority</label>
        <select id="priority" v-model="newTask.priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="dueDate">Due Date (optional)</label>
        <input type="date" id="dueDate" v-model="newTask.dueDate" />
      </div>
    </div>
    
    <button type="submit" class="btn">Add Task</button>
  </form>
</template>

<style scoped>
.task-form {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--neutral-200);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: var(--space-6);
}

.dark .task-form {
  background-color: var(--neutral-800);
  border: 1px solid var(--neutral-700);
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-group label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 500;
  color: var(--neutral-700);
}

.dark .form-group label {
  color: var(--neutral-300);
}

.form-row {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: var(--space-4);
  }
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

input.error {
  border-color: var(--error-500);
}

.error-message {
  color: var(--error-500);
  font-size: 0.875rem;
  margin-top: var(--space-1);
}
</style>