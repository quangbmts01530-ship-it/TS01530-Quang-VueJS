<template>
  <div>
    <h2>Danh sách bài viết</h2>
    <div v-for="(post, index) in posts" :key="index" 
         :class="{ 'highlighted': post.title.length > 20 }"
         :style="{ backgroundColor: post.backgroundColor, color: post.textColor }"
         class="post">
      <h3 class="text-success">{{ post.title }}</h3>
      <h4 class="text-danger">{{ post.author }}</h4>
      <p>{{ post.content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostList",
  props: {
    posts: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.post-container {
  margin-top: 20px;
}

.post {
  padding: 25px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6; /* Viền xám nhạt */
  border-radius: 12px;
  background-color: #fff;
}

/* Class đặc biệt khi tiêu đề dài (Class Binding) */
.highlighted {
  border: 2px solid #3498db; 
}

h3.text-success {
  color: #2d8a4e !important; /* Màu xanh lá như hình mẫu */
  font-size: 24px;
  margin-top: 0;
}

h4.text-danger {
  color: #e74c3c !important; /* Màu đỏ cho tên tác giả */
  font-size: 18px;
  margin-bottom: 10px;
}

p {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 0;
}
</style>