<template>
  <div class="post-list">
    <h2 class="mb-4">Danh sách bài viết</h2>
    <div 
      v-for="(post, index) in posts" 
      :key="index" 
      class="post-item p-3 mb-3 border rounded"
      :class="{ 'highlight-border': post.title.length > 20 }"
    >
      <h3 :style="{ color: '#2e7d32' }">{{ post.title }}</h3>
      <h5 class="text-danger italic">{{ post.author }}</h5>
      <p>{{ post.content }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps(['posts']);
</script>

<style scoped>
.post-item { background-color: #fdfdfd; transition: 0.3s; }
.highlight-border { border: 2px solid #ff9800 !important; background-color: #fff9c4; }
.italic { font-style: italic; }
</style>