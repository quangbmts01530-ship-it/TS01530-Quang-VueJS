<template>
  <div class="card p-4 mb-4 shadow-sm">
    <h2 class="text-primary mb-3">Tạo bài viết mới</h2>
    <div class="mb-3">
      <input v-model="title" type="text" class="form-control" placeholder="Tiêu đề bài viết" />
    </div>
    <div class="mb-3">
      <input v-model="author" type="text" class="form-control" placeholder="Tên tác giả" />
    </div>
    <div class="mb-3">
      <textarea v-model="content" class="form-control" placeholder="Nội dung bài viết" rows="3"></textarea>
    </div>
    <button @click="submitPost" class="btn btn-primary w-100">Đăng bài</button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['add-post']);
const title = ref('');
const author = ref('');
const content = ref('');

function submitPost() {
  if (!title.value || !author.value || !content.value) {
    alert("Vui lòng điền đủ thông tin!");
    return;
  }
  
  // Gửi dữ liệu ra component cha
  emit('add-post', {
    title: title.value,
    author: author.value,
    content: content.value
  });

  // Reset form
  title.value = ''; author.value = ''; content.value = '';
}
</script>