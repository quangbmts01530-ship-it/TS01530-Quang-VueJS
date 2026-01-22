<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-5">

        <div class="profile-card shadow-lg rounded-4 overflow-hidden">
          
          <!-- Header -->
          <div class="bg-gradient-primary text-white text-center py-4">
            <h3 class="fw-bold mb-0">Thông tin cá nhân</h3>
          </div>

          <!-- Body -->
          <div class="p-4 text-center">

            <!-- Avatar -->
            <div class="avatar-wrapper mx-auto mb-4">
              <img 
                :src="userAvatar" 
                class="avatar-img rounded-circle shadow"
                alt="Avatar"
              >
            </div>

            <!-- Form -->
            <form class="text-start">

              <label class="form-label fw-semibold mt-2">Họ và tên</label>
              <input 
                type="text" 
                class="form-control custom-input"
                v-model="userInfo.name"
                placeholder="Nhập họ tên"
              >

              <label class="form-label fw-semibold mt-3">Email</label>
              <input 
                type="email" 
                class="form-control custom-input"
                v-model="userInfo.email"
                placeholder="Email"
              >

              <label class="form-label fw-semibold mt-3">Mật khẩu</label>
              <input 
                type="password" 
                class="form-control custom-input"
                v-model="userInfo.password"
                placeholder="********"
              >

              <button 
                type="button" 
                class="btn btn-primary w-100 mt-4 py-2 fw-bold shadow-sm save-btn"
              >
                LƯU THAY ĐỔI
              </button>

            </form>

          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import userAvatar from '../assets/images/avatar.png';

// Dữ liệu user mẫu
const userInfo = ref({
  name: "Bùi Minh Quang",
  email: "",
  password: "123"
});
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #4c8dff, #005eea);
}
.profile-card {
  border-radius: 18px;
}
.custom-input {
  border-radius: 10px;
  height: 45px;
}
.avatar-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  padding: 5px;
  background: linear-gradient(120deg, #70a5ff, #005eff);
}
.avatar-img {
  border-radius: 50%;
}
</style>

