import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '../types'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const isLoaded = ref(false)

  // Get all tasks
  const getAllTasks = computed(() => tasks.value)
  
  // Get incomplete tasks
  const getIncompleteTasks = computed(() => 
    tasks.value.filter(task => !task.completed)
  )
  
  // Get completed tasks
  const getCompletedTasks = computed(() => 
    tasks.value.filter(task => task.completed)
  )
  
  // Get task by id
  const getTaskById = (id: string) => {
    return tasks.value.find(task => task.id === id)
  }
  
  // Add new task
  const addTask = (task: Task) => {
    tasks.value.push(task)
    saveTasks()
  }
  
  // Update task
  const updateTask = (updatedTask: Task) => {
    const index = tasks.value.findIndex(task => task.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
      saveTasks()
    }
  }
  
  // Delete task
  const deleteTask = (id: string) => {
    tasks.value = tasks.value.filter(task => task.id !== id)
    saveTasks()
  }
  
  // Filter tasks by priority
  const getTasksByPriority = (priority: 'low' | 'medium' | 'high') => {
    return tasks.value.filter(task => task.priority === priority)
  }
  
  // Get task statistics
  const getTaskStats = computed(() => {
    const total = tasks.value.length
    const completed = getCompletedTasks.value.length
    const incomplete = getIncompleteTasks.value.length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    const priorityCounts = {
      low: getTasksByPriority('low').length,
      medium: getTasksByPriority('medium').length,
      high: getTasksByPriority('high').length
    }
    
    return {
      total,
      completed,
      incomplete,
      completionRate,
      priorityCounts
    }
  })
  
  // Save tasks to localStorage
  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }
  
  // Load tasks from localStorage
  const loadTasks = () => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      tasks.value = JSON.parse(savedTasks)
    } else {
      // Add sample tasks if none exist
      tasks.value = [
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
      saveTasks()
    }
    isLoaded.value = true
  }

  return {
    tasks,
    isLoaded,
    getAllTasks,
    getIncompleteTasks,
    getCompletedTasks,
    getTaskById,
    addTask,
    updateTask,
    deleteTask,
    getTasksByPriority,
    getTaskStats,
    loadTasks
  }
})