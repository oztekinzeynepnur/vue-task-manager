<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const taskStore = useTaskStore()

onMounted(() => {
  if (!taskStore.isLoaded) {
    taskStore.loadTasks()
  }
})

const taskStats = computed(() => taskStore.getTaskStats)

// Calculate width percentage for progress bars
const completionWidth = computed(() => `${taskStats.value.completionRate}%`)
const lowPriorityWidth = computed(() => {
  const total = taskStats.value.total || 1 // Avoid division by zero
  return `${(taskStats.value.priorityCounts.low / total) * 100}%`
})
const mediumPriorityWidth = computed(() => {
  const total = taskStats.value.total || 1
  return `${(taskStats.value.priorityCounts.medium / total) * 100}%`
})
const highPriorityWidth = computed(() => {
  const total = taskStats.value.total || 1
  return `${(taskStats.value.priorityCounts.high / total) * 100}%`
})
</script>

<template>
  <div class="container stats-container">
    <h1>Task Statistics</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Task Overview</h3>
        <div class="overview-stats">
          <div class="overview-stat">
            <div class="stat-value">{{ taskStats.total }}</div>
            <div class="stat-label">Total Tasks</div>
          </div>
          
          <div class="overview-stat">
            <div class="stat-value">{{ taskStats.completed }}</div>
            <div class="stat-label">Completed</div>
          </div>
          
          <div class="overview-stat">
            <div class="stat-value">{{ taskStats.incomplete }}</div>
            <div class="stat-label">In Progress</div>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <h3>Completion Rate</h3>
        <div class="stat-value large">{{ taskStats.completionRate }}%</div>
        <div class="progress-container">
          <div 
            class="progress-bar" 
            :style="{ width: completionWidth }"
            :class="{ 
              'progress-low': taskStats.completionRate < 30,
              'progress-medium': taskStats.completionRate >= 30 && taskStats.completionRate < 70,
              'progress-high': taskStats.completionRate >= 70
            }"
          ></div>
        </div>
      </div>
      
      <div class="stat-card">
        <h3>Priority Distribution</h3>
        <div class="priority-stats">
          <div class="priority-stat">
            <div class="priority-stat-header">
              <div class="priority-label">
                <span class="priority-dot low"></span>
                <span>Low</span>
              </div>
              <div class="priority-count">{{ taskStats.priorityCounts.low }}</div>
            </div>
            <div class="progress-container">
              <div class="progress-bar progress-low" :style="{ width: lowPriorityWidth }"></div>
            </div>
          </div>
          
          <div class="priority-stat">
            <div class="priority-stat-header">
              <div class="priority-label">
                <span class="priority-dot medium"></span>
                <span>Medium</span>
              </div>
              <div class="priority-count">{{ taskStats.priorityCounts.medium }}</div>
            </div>
            <div class="progress-container">
              <div class="progress-bar progress-medium" :style="{ width: mediumPriorityWidth }"></div>
            </div>
          </div>
          
          <div class="priority-stat">
            <div class="priority-stat-header">
              <div class="priority-label">
                <span class="priority-dot high"></span>
                <span>High</span>
              </div>
              <div class="priority-count">{{ taskStats.priorityCounts.high }}</div>
            </div>
            <div class="progress-container">
              <div class="progress-bar progress-high" :style="{ width: highPriorityWidth }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="stat-card tips-card">
        <h3>Productivity Tips</h3>
        <ul class="tips-list">
          <li>Focus on high-priority tasks first</li>
          <li>Break down large tasks into smaller steps</li>
          <li>Use the "2-minute rule" - if it takes less than 2 minutes, do it now</li>
          <li>Schedule specific time blocks for focused work</li>
          <li>Review and adjust your task list at the end of each day</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  max-width: 1000px;
  animation: fadeIn 0.5s ease;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-6);
}

.stat-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark .stat-card {
  background-color: var(--neutral-800);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin-top: 0;
  margin-bottom: var(--space-4);
  color: var(--neutral-700);
  font-size: 1.25rem;
  border-bottom: 1px solid var(--neutral-200);
  padding-bottom: var(--space-3);
}

.dark .stat-card h3 {
  color: var(--neutral-300);
  border-bottom-color: var(--neutral-700);
}

.overview-stats {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.overview-stat {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-500);
  margin-bottom: var(--space-1);
}

.stat-value.large {
  font-size: 3rem;
  text-align: center;
  margin-bottom: var(--space-4);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--neutral-600);
}

.dark .stat-label {
  color: var(--neutral-400);
}

.progress-container {
  width: 100%;
  height: 8px;
  background-color: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: var(--space-2);
}

.dark .progress-container {
  background-color: var(--neutral-700);
}

.progress-bar {
  height: 100%;
  transition: width 1s ease;
}

.progress-low {
  background-color: var(--success-500);
}

.progress-medium {
  background-color: var(--warning-500);
}

.progress-high {
  background-color: var(--error-500);
}

.priority-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.priority-stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-1);
}

.priority-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 500;
}

.priority-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.priority-dot.low {
  background-color: var(--success-500);
}

.priority-dot.medium {
  background-color: var(--warning-500);
}

.priority-dot.high {
  background-color: var(--error-500);
}

.priority-count {
  font-weight: 600;
  color: var(--neutral-700);
}

.dark .priority-count {
  color: var(--neutral-300);
}

.tips-card {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .tips-card {
    grid-column: auto;
  }
}

.tips-list {
  padding-left: var(--space-4);
  margin: 0;
}

.tips-list li {
  margin-bottom: var(--space-3);
  color: var(--neutral-700);
}

.dark .tips-list li {
  color: var(--neutral-300);
}
</style>