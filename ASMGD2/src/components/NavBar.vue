<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">Blog Management</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <router-link class="nav-link" to="/create">Tạo bài viết</router-link>
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <router-link class="nav-link" to="/profile">Profile</router-link>
          </li>
        </ul>
        <div v-if="authStore.isAuthenticated" class="d-flex align-items-center text-white">
          <span class="me-3">Xin chào, {{ authStore.user.name }}</span>
          <button class="btn btn-outline-light" @click="logout">Logout</button>
        </div>
        <div v-else>
          <router-link to="/login" class="btn btn-outline-light me-2">Login</router-link>
          <router-link to="/register" class="btn btn-light">Register</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>