<script setup>
import { reactive } from 'vue';

// Sử dụng reactive cho một object gồm nhiều trường thông tin
const userInfo = reactive({
  name: '',
  age: null,
  email: ''
});
</script>

<template>
  <div class="exercise-box col-sm-8">
    <h1>Thông tin cá nhân</h1>
    <form>
      <div class="mb-3">
        <label class="form-label">Họ và Tên:</label>
        <input v-model="userInfo.name" type="text" class="form-control" placeholder="Nhập họ và tên" />
      </div>
      <div class="mb-3">
        <label class="form-label">Tuổi:</label>
        <input v-model="userInfo.age" type="number" class="form-control" placeholder="Nhập tuổi" />
      </div>
      <div class="mb-3">
        <label class="form-label">Email:</label>
        <input v-model="userInfo.email" type="email" class="form-control" placeholder="Nhập email" />
      </div>
    </form>

    <div class="info-display mt-4 p-3 bg-dark text-white rounded">
      <h2>Thông tin đã nhập:</h2>
      <p><strong>Họ và Tên:</strong> {{ userInfo.name }}</p>
      <p><strong>Tuổi:</strong> {{ userInfo.age }}</p>
      <p><strong>Email:</strong> {{ userInfo.email }}</p>
    </div>
  </div>
</template>

<style scoped>
.exercise-box {
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.info-display {
  line-height: 1.6;
}
h2 { color: #fff; border-bottom: 1px solid #555; padding-bottom: 10px; }
</style>