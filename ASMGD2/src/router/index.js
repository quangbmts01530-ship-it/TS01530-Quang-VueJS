import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import CreatePostView from '../views/CreatePostView.vue';
import EditPostView from '../views/EditPostView.vue';
import PostDetailView from '../views/PostDetailView.vue';
import ProfileView from '../views/ProfileView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/create', component: CreatePostView, meta: { requiresAuth: true } },
  { path: '/edit/:id', component: EditPostView, meta: { requiresAuth: true } },
  { path: '/post/:id', component: PostDetailView },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;