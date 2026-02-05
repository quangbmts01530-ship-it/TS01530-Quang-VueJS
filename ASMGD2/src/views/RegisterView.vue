<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const message = ref('');

const handleRegister = () => {
  const result = authStore.register(name.value, email.value, password.value);
  message.value = result.message;
  if (result.success) {
    setTimeout(() => router.push('/'), 1000);
  }
};

const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Lưu avatar base64 nếu muốn (ở đây bỏ qua để đơn giản, bạn có thể thêm)
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h3>Đăng ký</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label">Tên</label>
                <input v-model="name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu</label>
                <input v-model="password" type="password" class="form-control" minlength="6" required />
              </div>
              <button type="submit" class="btn btn-primary w-100">Đăng ký</button>
            </form>
            <div v-if="message" :class="{'text-success': message.includes('thành công'), 'text-danger': !message.includes('thành công')}" class="mt-3 text-center">
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>