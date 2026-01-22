<template>
  <nav class="navbar navbar-dark bg-dark px-4">
    <router-link to="/" class="navbar-brand">My Blog</router-link>

    <div>
      <!-- Nếu CHƯA đăng nhập -->
      <template v-if="!auth.isLoggedIn">
        <router-link class="btn btn-outline-light me-2" to="/login">Đăng nhập</router-link>
        <router-link class="btn btn-warning" to="/register">Đăng ký</router-link>
      </template>

      <!-- Nếu ĐÃ đăng nhập -->
      <template v-else>
        <router-link class="btn btn-info me-2" to="/profile">
          👤 {{ auth.user.email }}
        </router-link>

        <button class="btn btn-danger" @click="handleLogout">
          Đăng xuất
        </button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from "../store/auth";
import { useRouter } from "vue-router";

const auth = useAuth();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push("/");
};
</script>
<style scoped></style>