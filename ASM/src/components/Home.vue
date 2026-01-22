<template>
  <div class="container py-5">
    <h2 class="text-center fw-bold text-primary mb-5">
      📰 Tin Tức Nổi Bật
    </h2>

    <div class="row g-4">
      <div 
        class="col-md-4"
        v-for="(post, index) in posts"
        :key="index"
      >
        <div class="news-card card border-0 h-100 shadow-sm">
          
          <!-- Ảnh bài viết -->
          <div class="img-wrap">
            <img 
              :src="post.image"
              class="card-img-top"
              alt="Blog Image"
            >
          </div>

          <div class="card-body">
            <h5 class="card-title fw-bold">{{ post.title }}</h5>
            <p class="text-muted small">{{ post.summary }}</p>
          </div>

          <div class="card-footer bg-white border-0">
            <button class="btn btn-primary w-100">
              Xem chi tiết
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import img1 from '../assets/images/img1.jpg'
import img2 from '../assets/images/img2.jpg'
import img3 from '../assets/images/img3.jpg'

const posts = [
  {
    title: '8 loại rau củ quả giàu canxi',
    summary: 'Canxi là khoáng chất cần thiết đối với cơ thể người...',
    image: img1
  },
  {
    title: 'Các loại gia vị tốt cho sức khỏe',
    summary: 'Một số loại gia vị chứa nhiều polyphenol chống oxy hóa...',
    image: img2
  },
  {
    title: '9 loại đậu bổ dưỡng nên dùng',
    summary: 'Đậu lăng, đậu nành và đậu phộng giàu chất xơ, vitamin...',
    image: img3
  }
]
</script>

<style>
.news-card {
  transition: 0.25s ease;
  border-radius: 14px;
  overflow: hidden;
}

.news-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.12);
}

.img-wrap img {
  height: 220px;
  object-fit: cover;
}
</style>
