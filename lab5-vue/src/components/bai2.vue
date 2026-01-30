<script setup>
import { ref } from 'vue';

// 1. Khởi tạo biến phản ứng 'userInput' với giá trị mặc định là 'FPL'
const userInput = ref('FPL');
</script>

<template>
  <div class="container">
    <h3>Demo v-model</h3>

    <input 
      v-model="userInput" 
      type="text" 
      placeholder="Nhập dữ liệu vào đây" 
      class="input-field"
    />

    <p>Giá trị bạn nhập: <b>{{ userInput }}</b></p>
  </div>
</template>

<style scoped>
/* CSS đơn giản để giao diện dễ nhìn hơn */
.container {
  padding: 20px;
  font-family: sans-serif;
}

.input-field {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
  margin-bottom: 10px;
}
</style>