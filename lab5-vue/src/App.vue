<script setup>
import { ref } from 'vue';
import NhapSanPham from './components/CreatePost.vue';
import DanhSachSanPham from './components/PostList.vue';
const hardwareList = ref([]);

// Hàm xử lý khi con (NhapSanPham) gửi dữ liệu lên
const handleAddProduct = (newProduct) => {
  hardwareList.value.unshift(newProduct); // Thêm lên đầu danh sách
};
</script>

<template>
  <div class="main-layout">
    <h1 class="title">Bai4 Lab5</h1>

    <NhapSanPham @add-product="handleAddProduct" />

    <DanhSachSanPham :items="hardwareList" />
  </div>
</template>

<style>
/* Đảm bảo toàn trang trắng sạch */
body {
  background-color: #f8f9fa;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
}
</style>