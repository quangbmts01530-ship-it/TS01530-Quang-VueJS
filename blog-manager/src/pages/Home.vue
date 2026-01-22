<template>
  <div class="home container mt-4">
    <h1 class="text-primary">Welcome to the Blog Manager</h1>

    <p class="lead">
      Đây là trang Home. Bạn có thể điều hướng đến các trang khác bằng menu.
    </p>

    <router-link to="/blogs" class="btn btn-success me-2">📘 Xem danh sách Blog</router-link>
    <router-link to="/login" class="btn btn-outline-primary">🔑 Đăng nhập</router-link>
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>
