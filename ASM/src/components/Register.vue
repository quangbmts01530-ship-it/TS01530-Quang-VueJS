<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-5">

        <div class="card shadow rounded-4">
          <div class="card-header bg-success text-white text-center rounded-top-4 py-3">
            <h4 class="fw-bold">Tạo tài khoản</h4>
          </div>

          <div class="card-body p-4">

            <form>
              <label class="fw-semibold">Họ và tên</label>
              <input type="text" v-model="fullname" class="form-control mb-3 input-box">

              <label class="fw-semibold">Email</label>
              <input type="email" v-model="email" class="form-control mb-3 input-box">

              <label class="fw-semibold">Mật khẩu</label>
              <input type="password" v-model="password" class="form-control mb-4 input-box">

              <button class="btn btn-success w-100 py-2 fw-bold">Đăng ký</button>
            </form>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const fullname = ref("");
const email = ref("");
const password = ref("");
</script>

<style scoped>
.input-box {
  height: 45px;
  border-radius: 10px;
}
</style>
