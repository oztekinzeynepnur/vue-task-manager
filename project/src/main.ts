import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './views/Home.vue'
import Tasks from './views/Tasks.vue'
import TaskDetails from './views/TaskDetails.vue'
import Stats from './views/Stats.vue'
import Settings from './views/Settings.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/tasks', component: Tasks },
  { path: '/tasks/:id', component: TaskDetails, props: true },
  { path: '/stats', component: Stats },
  { path: '/settings', component: Settings }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')