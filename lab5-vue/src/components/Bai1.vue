<script setup>
import { ref } from 'vue';
const message = ref('Thông điệp ban đầu');
const updateMessage = () => {
  message.value = 'Thông điệp đã được thay đổi!';
};
</script>

<template>
  <div class="exercise-box">
    <h3>Bài 1: Sự kiện & Binding</h3>
    <p>{{ message }}</p>
    <button @click="updateMessage">Thay đổi thông điệp</button>
  </div>
</template>

<style scoped>
.exercise-box { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
button { background: #333; color: white; padding: 5px 10px; border: none; cursor: pointer; }
</style>