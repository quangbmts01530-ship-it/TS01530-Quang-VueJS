import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import CreatePostView from '../views/CreatePostView.vue';
import EditPostView from '../views/EditPostView.vue';
import PostDetailView from '../views/PostDetailView.vue';
import ProfileView from '../views/ProfileView.vue';
import AdminView from '../views/AdminView.vue';
import AdminSetupView from '../views/AdminSetupView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/create-post', component: CreatePostView, meta: { requiresAuth: true } },
  { path: '/edit-post/:id', component: EditPostView, meta: { requiresAuth: true } },
  { path: '/post/:id', component: PostDetailView },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true } },
  // Route 404 - redirect to home
  { path: '/:pathMatch(.*)*', redirect: '/' },
    { path: '/admin-setup', 
    component: AdminSetupView,
    meta: { guestOnly: true }
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Check if user is authenticated
  const isAuthenticated = authStore.isAuthenticated;
  const user = authStore.user;
  
  // Check for auth required
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }
  
  // Check for admin role required
  if (to.meta.requiresAdmin && (!isAuthenticated || user?.role !== 'admin')) {
    next('/');
    return;
  }
  
  // Check for guest only (login/register pages)
  if (to.meta.guestOnly && isAuthenticated) {
    next('/');
    return;
  }
  
  next();
});

export default router;