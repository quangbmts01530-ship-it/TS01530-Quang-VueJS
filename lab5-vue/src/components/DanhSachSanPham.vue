<template>
  <div class="list-container">
    <h2>Danh sách phần cứng cao cấp</h2>
    <div v-for="(item, index) in items" :key="index" class="product-item">
      <h3 class="product-name">{{ item.name }}</h3>
      <p class="product-desc">{{ item.description }}</p>
      <p class="product-price">Giá: <span>{{ formatPrice(item.price) }}</span></p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Nhận mảng hardwareList từ cha
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

// Hàm định dạng tiền tệ VNĐ
const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>

<style scoped>
.product-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 10px;
  background-color: #fff;
  transition: transform 0.2s;
}
.product-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.product-name {
  color: #2d8a4e; /* Màu xanh lá như hình bạn muốn */
  margin: 0 0 10px 0;
}
.product-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}
.product-price span {
  color: #e74c3c; /* Màu đỏ nổi bật cho giá */
  font-weight: bold;
}
</style>