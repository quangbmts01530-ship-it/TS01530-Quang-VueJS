<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const message = ref('');

const handleLogin = () => {
  const result = authStore.login(email.value, password.value);
  message.value = result.message;
  if (result.success) {
    setTimeout(() => router.push('/'), 1000);
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white"><h3>Đăng nhập</h3></div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label>Email</label>
                <input v-model="email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label>Mật khẩu</label>
                <input v-model="password" type="password" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
            </form>
            <div v-if="message" class="mt-3 text-center text-danger">{{ message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>