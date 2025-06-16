import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/LoginView.vue') },
    { path: '/chat', component: () => import('../views/ChatView.vue') },
  ],
})

export default router
