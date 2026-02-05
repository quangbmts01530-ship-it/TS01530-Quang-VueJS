<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/postStore';

const postStore = usePostStore();
const router = useRouter();

const title = ref('');
const content = ref('');
const image = ref('');

const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => image.value = ev.target.result;
    reader.readAsDataURL(file);
  }
};

const submit = () => {
  if (postStore.addPost(title.value, content.value, image.value)) {
    router.push('/');
  }
};
</script>

<template>
  <div class="container mt-5">
    <h2>Tạo bài viết mới</h2>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label>Tiêu đề</label>
        <input v-model="title" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>Nội dung</label>
        <textarea v-model="content" class="form-control" rows="10" required></textarea>
      </div>
      <div class="mb-3">
        <label>Hình ảnh</label>
        <input type="file" accept="image/*" @change="handleImage" class="form-control" />
        <img v-if="image" :src="image" class="img-thumbnail mt-2" style="max-height: 300px;" />
      </div>
      <button type="submit" class="btn btn-success">Đăng bài</button>
    </form>
  </div>
</template>