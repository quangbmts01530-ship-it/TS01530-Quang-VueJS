<template>
  <div class="container mt-4">
    <div v-if="auth.user">
      <h2>Thông tin tài khoản</h2>
      <p>Email: {{ auth.user.email }}</p>
    </div>

    <div v-else class="text-danger">
      <h3>Bạn chưa đăng nhập!</h3>
      <router-link to="/login" class="btn btn-primary mt-2">
        Đăng nhập lại
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from "../store/auth";
const auth = useAuth();
</script>
