<template>
  <div class="container mt-4">
    <h2 class="mb-3">Danh sách Blog</h2>

    <div v-for="blog in blogs" :key="blog.id" class="card my-3 p-3">
      <h4>{{ blog.title }}</h4>
      <p>{{ blog.summary }}</p>
      <router-link :to="'/blogs/' + blog.id" class="btn btn-primary">
        Xem chi tiết
      </router-link>
    </div>
  </div>
</template>

<script setup>
import blogs from "../store/blogs";
</script>
