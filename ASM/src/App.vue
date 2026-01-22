<script setup>
import { ref } from 'vue';
// Import các component đã tạo
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Profile from './components/Profile.vue';

const currentPage = ref('home');

// Hàm xử lý chuyển trang khi click menu
const goToPage = (page) => {
  currentPage.value = page;
};
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100 bg-light">
    
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold text-info" @click.prevent="goToPage('home')" href="#">VUE BLOG SỨC KHỎE</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" :class="{active: currentPage === 'home'}" @click.prevent="goToPage('home')" href="#">Trang chủ</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{active: currentPage === 'login'}" @click.prevent="goToPage('login')" href="#">Đăng nhập</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{active: currentPage === 'register'}" @click.prevent="goToPage('register')" href="#">Đăng ký</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-warning fw-bold" :class="{active: currentPage === 'profile'}" @click.prevent="goToPage('profile')" href="#">Cá nhân</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container py-5 flex-grow-1">
      <Home v-if="currentPage === 'home'" />
      <Login v-else-if="currentPage === 'login'" />
      <Register v-else-if="currentPage === 'register'" />
      <Profile v-else-if="currentPage === 'profile'" />
    </main>

    <footer class="bg-white text-center py-4 border-top mt-auto shadow-sm">
      <p class="text-muted mb-0">&copy; 2026 SOF308 Assignment 1 - Sinh viên: <strong>Bui Minh Quang</strong></p>
      <small class="text-secondary">Yêu cầu Y1: Tổ chức dự án và Xây dựng giao diện</small>
    </footer>

  </div>
</template>

<style scoped>
.nav-link, .navbar-brand {
  cursor: pointer;
}
#app {
  min-height: 100vh;
}
</style>