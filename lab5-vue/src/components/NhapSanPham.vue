
<template>
  <div class="card-custom">
    <h2>Thêm sản phẩm mới</h2>
    <div class="form-group">
      <input v-model="product.name" type="text" placeholder="Tên sản phẩm (VD: CPU AMD...)" />
      <textarea v-model="product.description" placeholder="Mô tả chi tiết sản phẩm..."></textarea>
      <input v-model.number="product.price" type="number" placeholder="Giá sản phẩm (VNĐ)" />
      <button @click="submitForm">Thêm vào danh sách</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineEmits } from 'vue';

const emit = defineEmits(['add-product']);

const product = reactive({
  name: '',
  description: '',
  price: null
});

const submitForm = () => {
  if (product.name && product.description && product.price) {
    // Gửi bản sao của object product để tránh tham chiếu
    emit('add-product', { ...product });
    
    // Reset form sau khi nhập
    product.name = '';
    product.description = '';
    product.price = null;
  } else {
    alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
  }
};
</script>
<style scoped>
.card-custom {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  margin-bottom: 30px;
}
input, textarea {
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  background-color: #3498db;
  
}
button:hover { background-color: #2980b9; }
</style>