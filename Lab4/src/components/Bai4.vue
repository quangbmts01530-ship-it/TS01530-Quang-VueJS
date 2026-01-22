<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Kiến thức sức khỏe cộng đồng</h1>
    <div class="row-cols-1 row-cols-md-3 g-1 mb-2 d-flex justify-content-center">
      <div class="col-sm-4 mb-4" v-for="(item, index) in items" :key="index">
        <div class="card h-100 shadow-sm">
          <img :src="item.image" class="card-img-top" alt="Tin tức sức khỏe" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="card-text text-secondary">{{ item.description }}</p>
            <button class="btn btn-info text-white">Xem chi tiết</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Nhớ đổi tên file ảnh trong thư mục images thành img1.jpg, img2.jpg, img3.jpg
import img1 from '../assets/images/img1.jpg';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';

export default {
  name: 'Bai4',
  data() {
    return {
      items: [
        { 
          title: '8 loại rau củ quả giàu canxi', 
          description: 'Canxi là khoáng chất cần thiết đối với cơ thể người. Có nhiều cách để bổ sung canxi, trong đó bổ sung qua đường ăn uống là cách tốt nhất...', 
          image: img1 
        },
        { 
          title: 'Các loại gia vị tốt cho sức khỏe', 
          description: 'Một số loại gia vị cung cấp nhiều polyphenol chống oxy hóa cao hơn các loại gia vị quen thuộc khác. Với một lượng nhỏ các món ăn...', 
          image: img2 
        },
        { 
          title: '9 loại đậu bổ dưỡng nên dùng nhiều', 
          description: 'Đậu lăng, đậu nành, đậu phộng, đậu Hà Lan giàu chất xơ, protein cùng nhiều vitamin và khoáng chất giúp giảm lượng đường trong máu...', 
          image: img3 
        }
      ]
    };
  }
}
</script>