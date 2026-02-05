<script setup>
import { usePostStore } from '@/stores/postStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const postStore = usePostStore();
const authStore = useAuthStore();
const router = useRouter();
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">Danh sách bài viết</h2>
    <div v-if="postStore.posts.length === 0" class="alert alert-info">Chưa có bài viết nào.</div>
    <div class="row">
      <div v-for="post in postStore.posts" :key="post.id" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img v-if="post.image" :src="post.image" class="card-img-top" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text flex-grow-1">{{ post.content.substring(0, 100) }}...</p>
            <p class="text-muted small">Tác giả: {{ post.authorName }} - {{ post.createdAt }}</p>
            <div>
              <router-link :to="'/post/' + post.id" class="btn btn-primary btn-sm">Xem chi tiết</router-link>
              <template v-if="authStore.isAuthenticated && post.authorId === authStore.user.id">
                <router-link :to="'/edit/' + post.id" class="btn btn-warning btn-sm ms-2">Sửa</router-link>
                <button @click="postStore.deletePost(post.id)" class="btn btn-danger btn-sm ms-2">Xóa</button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>