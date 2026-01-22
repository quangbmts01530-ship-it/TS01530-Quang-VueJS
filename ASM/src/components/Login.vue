<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-4">

        <div class="card rounded-4 shadow p-4 login-card">
          <h3 class="text-center fw-bold mb-4">Đăng nhập</h3>

          <form @submit.prevent>
            <label class="fw-semibold">Email</label>
            <input type="email" class="form-control mb-3 input-box" v-model="email" placeholder="example@gmail.com">

            <label class="fw-semibold">Mật khẩu</label>
            <input type="password" class="form-control mb-4 input-box" v-model="password">

            <button class="btn btn-primary w-100 py-2 fw-bold">Đăng nhập</button>
          </form>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
</script>

<style scoped>
.login-card {
  border-radius: 18px;
}
.input-box {
  height: 45px;
  border-radius: 10px;
}
</style>
