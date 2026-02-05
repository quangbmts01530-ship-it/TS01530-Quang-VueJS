<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePostStore } from '@/stores/postStore';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const postStore = usePostStore();
const authStore = useAuthStore();

const post = ref(null);
const comment = ref('');

onMounted(() => {
  post.value = postStore.posts.find(p => p.id === Number(route.params.id));
});

const addComment = () => {
  if (postStore.addComment(post.value.id, comment.value)) {
    comment.value = '';
  }
};
</script>

<template>
  <div class="container mt-5" v-if="post">
    <div class="card">
      <img v-if="post.image" :src="post.image" class="card-img-top">
      <div class="card-body">
        <h2>{{ post.title }}</h2>
        <p class="text-muted">Tác giả: {{ post.authorName }} - {{ post.createdAt }}</p>
        <p>{{ post.content }}</p>
      </div>
    </div>

    <div class="mt-5">
      <h4>Bình luận ({{ post.comments.length }})</h4>
      <div v-if="authStore.isAuthenticated" class="mb-4">
        <textarea v-model="comment" class="form-control" placeholder="Viết bình luận..."></textarea>
        <button @click="addComment" class="btn btn-primary mt-2">Gửi</button>
      </div>
      <div v-for="c in post.comments" :key="c.id" class="border-bottom py-3">
        <strong>{{ c.authorName }}</strong> <small class="text-muted">{{ c.createdAt }}</small>
        <p>{{ c.content }}</p>
      </div>
    </div>
  </div>
</template>