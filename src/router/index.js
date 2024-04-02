import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LineUpGen from '../views/LineupGen.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/callback',
      name: 'callback',
      component: LineUpGen
    },
  ]
})

export default router
