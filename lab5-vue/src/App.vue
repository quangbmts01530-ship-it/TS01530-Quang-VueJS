<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <CreatePost @add-post="handleNewPost" />
        <hr class="my-5">
        <PostList :posts="posts" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CreatePost from './components/CreatePost.vue';
import PostList from './components/PostList.vue';

const posts = ref([
  { 
    title: 'Bật Mí 8 Nguyên Tắc Phối Màu Quần Áo', 
    author: 'Nguyễn Văn Tèo', 
    content: 'Bạn có thể phối màu theo nguyên tắc tam giác...' 
  }
]);

const handleNewPost = (newPost) => {
  posts.value.unshift(newPost); // Thêm vào đầu danh sách cho dễ nhìn
};
</script>