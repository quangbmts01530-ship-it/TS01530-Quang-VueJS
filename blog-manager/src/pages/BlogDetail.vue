<template>
  <div class="container mt-4" v-if="blog">
    <h2>{{ blog.title }}</h2>
    <p class="text-muted">{{ blog.date }}</p>
    <p>{{ blog.content }}</p>

    <router-link to="/blogs" class="btn btn-secondary mt-3">
      ← Quay lại
    </router-link>
  </div>

  <div v-else class="container mt-4">
    <h3>Bài viết không tồn tại!</h3>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import blogs from "../store/blogs";

const route = useRoute();
const id = route.params.id;

const blog = blogs.find(b => b.id == id);
</script>
