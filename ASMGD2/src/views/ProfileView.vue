<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const name = ref(authStore.user.name);
const email = ref(authStore.user.email);
const password = ref('');
const avatar = ref(authStore.user.avatar || '');

const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => avatar.value = ev.target.result;
    reader.readAsDataURL(file);
  }
};

const update = () => {
  authStore.updateProfile(name.value, email.value, password.value || undefined, avatar.value);
};
</script>

<template>
  <div class="container mt-5">
    <h2>Thông tin cá nhân</h2>
    <div class="row">
      <div class="col-md-4 text-center">
        <img :src="avatar || 'https://via.placeholder.com/150'" class="rounded-circle" style="width: 150px; height: 150px; object-fit: cover;">
        <input type="file" accept="image/*" @change="handleImage" class="form-control mt-3" />
      </div>
      <div class="col-md-8">
        <form @submit.prevent="update">
          <div class="mb-3">
            <label>Tên</label>
            <input v-model="name" class="form-control" />
          </div>
          <div class="mb-3">
            <label>Email</label>
            <input v-model="email" type="email" class="form-control" />
          </div>
          <div class="mb-3">
            <label>Mật khẩu mới (để trống nếu không đổi)</label>
            <input v-model="password" type="password" class="form-control" />
          </div>
          <button type="submit" class="btn btn-primary">Cập nhật</button>
        </form>
      </div>
    </div>
  </div>
</template>