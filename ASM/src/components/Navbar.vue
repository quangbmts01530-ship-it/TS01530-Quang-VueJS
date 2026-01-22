<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
    <div class="container">

      <router-link to="/" class="navbar-brand fw-bold fs-4">🌐 VUE BLOG</router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMenu">

        <ul class="navbar-nav ms-3 me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Trang chủ</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/posts" class="nav-link">Bài viết</router-link>
          </li>
        </ul>

        <div>
          <template v-if="!auth.user">
            <router-link to="/login" class="btn btn-outline-light me-2">Đăng nhập</router-link>
            <router-link to="/register" class="btn btn-warning">Đăng ký</router-link>
          </template>

          <template v-else>
            <router-link to="/profile" class="btn btn-info me-2">
              👤 {{ auth.user.email }}
            </router-link>
            <button class="btn btn-danger" @click="handleLogout">Đăng xuất</button>
          </template>
        </div>

      </div>

    </div>
  </nav>
</template>

<script setup>
import { useAuth } from "../store/auth"
const auth = useAuth()

const handleLogout = () => {
  auth.logout()
  window.location.href = "/"
}
</script>

<style scoped>
.nav-link {
  padding: 8px 16px !important;
  font-weight: 500;
  transition: .25s;
}
.nav-link:hover {
  color: #0d6efd !important;
  transform: translateY(-2px);
}
</style>
