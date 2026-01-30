<template>
  <div class="create-post">
    <h2>Tạo bài viết mới</h2>
    <input v-model="title" placeholder="Tiêu đề bài viết" />
    <input v-model="author" placeholder="Tên tác giả" />
    <textarea v-model="content" placeholder="Nội dung bài viết"></textarea>
    <button @click="submitPost">Đăng bài</button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

// Khai báo emit để gửi sự kiện ra bên ngoài
const emit = defineEmits(['add-post']);

const title = ref('');
const content = ref('');
const author = ref('');

function submitPost() {
  if (title.value && content.value && author.value) {
    const newPost = {
      title: title.value,
      content: content.value,
      author: author.value,
      // Thêm các thuộc tính màu sắc để minh họa cho Bài 4 yêu cầu style binding
      backgroundColor: '#f9f9f9',
      textColor: '#333'
    };
    

    // Gửi sự kiện 'add-post' kèm dữ liệu bài viết
    emit('add-post', newPost);

    // Reset các trường nhập liệu
    title.value = '';
    content.value = '';
    author.value = '';
  } else {
    alert("Vui lòng nhập đầy đủ thông tin!");
  }
}
</script>

<style scoped>
.create-post {
  margin-bottom: 40px;
}



input, textarea {
 
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid #ced4da;
  border-radius: 4px;
  font-size: px;
  box-sizing: border-box; /* Giúp padding không làm tràn chiều rộng */
}

input::placeholder, textarea::placeholder {
  color: #adb5bd;
}

button {
  background-color: #3498db; /* Màu xanh dương như hình */
  color: white;
  padding: 17px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>