<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { usePostStore } from '@/stores/postStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const postStore = usePostStore();
const authStore = useAuthStore();
const router = useRouter();

// State management
const searchQuery = ref('');
const selectedCategory = ref('all');
const sortBy = ref('newest');
const currentPage = ref(1);
const itemsPerPage = ref(12);
const isLoading = ref(true);

// Categories from posts
const categories = computed(() => {
  const cats = new Set(['all']);
  postStore.posts.forEach(post => {
    if (post.category) cats.add(post.category);
  });
  return Array.from(cats);
});

// Filtered and sorted posts
const filteredPosts = computed(() => {
  let posts = [...postStore.posts];
  
  // Apply search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(q))) ||
      (p.author && p.author.toLowerCase().includes(q))
    );
  }
  
  // Apply category filter
  if (selectedCategory.value !== 'all') {
    posts = posts.filter(p => p.category === selectedCategory.value);
  }
  
  // Apply sorting
  switch(sortBy.value) {
    case 'newest':
      posts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      break;
    case 'oldest':
      posts.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      break;
    case 'most-liked':
      posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      break;
    case 'most-commented':
      posts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      break;
    case 'trending':
      posts.sort((a, b) => {
        const scoreA = (b.likes || 0) * 2 + (b.comments?.length || 0) * 3;
        const scoreB = (a.likes || 0) * 2 + (a.comments?.length || 0) * 3;
        return scoreA - scoreB;
      });
      break;
  }
  
  return posts;
});

// Featured posts (with images, sorted by likes)
const featuredPosts = computed(() => {
  return [...postStore.posts]
    .filter(p => p.image && p.isPublished !== false)
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 6);
});

// Hot posts (trending algorithm)
const hotPosts = computed(() => {
  return [...postStore.posts]
    .filter(p => p.isPublished !== false)
    .map(post => {
      const likeScore = (post.likes || 0) * 2;
      const commentScore = (post.comments?.length || 0) * 3;
      const recencyScore = Math.max(0, 100 - (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return {
        ...post,
        trendScore: likeScore + commentScore + recencyScore
      };
    })
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 10);
});

// Recent posts
const recentPosts = computed(() => {
  return [...postStore.posts]
    .filter(p => p.isPublished !== false)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);
});

// Pagination
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredPosts.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / itemsPerPage.value);
});

const pageNumbers = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;
  
  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  sortBy.value = 'newest';
  currentPage.value = 1;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getReadingTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} phút đọc`;
};

// Initialize
onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
});

// Watch filters to reset page
watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div v-if="!isLoading && featuredPosts.length > 0" class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="hero-content">
              <h1 class="display-4 fw-bold mb-4 text-white">
                Chia sẻ & Khám phá tri thức
              </h1>
              <p class="lead text-light mb-4">
                Nơi kết nối những tâm hồn yêu thích viết lách và chia sẻ kiến thức
              </p>
              <div class="d-flex gap-3">
                <button 
                  v-if="authStore.user"
                  @click="router.push('/create-post')"
                  class="btn btn-light btn-lg px-4"
                >
                  <i class="bi bi-pencil-square me-2"></i>Viết bài mới
                </button>
                <router-link to="/posts" class="btn btn-outline-light btn-lg px-4">
                  <i class="bi bi-compass me-2"></i>Khám phá
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-carousel">
              <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                  <button 
                    v-for="(_, index) in featuredPosts.slice(0, 3)" 
                    :key="index"
                    type="button" 
                    data-bs-target="#heroCarousel" 
                    :data-bs-slide-to="index"
                    :class="{ active: index === 0 }"
                  ></button>
                </div>
                <div class="carousel-inner rounded-4 shadow-lg overflow-hidden">
                  <div 
                    v-for="(post, index) in featuredPosts.slice(0, 3)" 
                    :key="post.id"
                    :class="['carousel-item', { active: index === 0 }]"
                    @click="router.push(`/post/${post.id}`)"
                    style="cursor: pointer;"
                  >
                    <div class="position-relative">
                      <img 
                        :src="post.image" 
                        class="d-block w-100 hero-img"
                        :alt="post.title"
                      >
                      <div class="carousel-overlay">
                        <div class="carousel-caption text-start">
                          <div class="category-badge mb-2">
                            <span class="badge bg-primary">{{ post.category || 'Chung' }}</span>
                          </div>
                          <h3 class="display-6 fw-bold">{{ post.title }}</h3>
                          <div class="post-meta d-flex align-items-center gap-3 mt-3">
                            <span class="text-light">
                              <i class="bi bi-person-circle me-1"></i>
                              {{ post.author }}
                            </span>
                            <span class="text-light">
                              <i class="bi bi-calendar3 me-1"></i>
                              {{ formatDate(post.createdAt) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                  <span class="carousel-control-next-icon"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar py-4 bg-light border-bottom">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3 col-6 mb-3 mb-md-0">
            <div class="stat-item">
              <i class="bi bi-newspaper display-6 text-primary mb-2"></i>
              <h3 class="fw-bold mb-1">{{ postStore.posts.length }}</h3>
              <p class="text-muted mb-0">Bài viết</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3 mb-md-0">
            <div class="stat-item">
              <i class="bi bi-chat-dots display-6 text-success mb-2"></i>
              <h3 class="fw-bold mb-1">{{ postStore.totalComments }}</h3>
              <p class="text-muted mb-0">Bình luận</p>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-item">
              <i class="bi bi-heart display-6 text-danger mb-2"></i>
              <h3 class="fw-bold mb-1">{{ postStore.totalLikes }}</h3>
              <p class="text-muted mb-0">Lượt thích</p>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-item">
              <i class="bi bi-people display-6 text-warning mb-2"></i>
              <h3 class="fw-bold mb-1">{{ postStore.totalAuthors }}</h3>
              <p class="text-muted mb-0">Tác giả</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-5">
      <!-- Search and Filters -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card shadow border-0">
            <div class="card-body p-4">
              <div class="row g-3">
                <!-- Search -->
                <div class="col-lg-4">
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-search text-muted"></i>
                    </span>
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="form-control border-start-0"
                      placeholder="Tìm kiếm bài viết, tác giả, hoặc tag..."
                    >
                    <button 
                      v-if="searchQuery"
                      @click="searchQuery = ''"
                      class="btn btn-outline-secondary border-start-0"
                      type="button"
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>

                <!-- Category Filter -->
                <div class="col-lg-3">
                  <select v-model="selectedCategory" class="form-select">
                    <option value="all">Tất cả chuyên mục</option>
                    <option v-for="cat in categories.filter(c => c !== 'all')" :key="cat" :value="cat">
                      {{ cat }}
                    </option>
                  </select>
                </div>

                <!-- Sort By -->
                <div class="col-lg-3">
                  <select v-model="sortBy" class="form-select">
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="most-liked">Nhiều like nhất</option>
                    <option value="most-commented">Nhiều bình luận nhất</option>
                    <option value="trending">Xu hướng</option>
                  </select>
                </div>

                <!-- Items Per Page -->
                <div class="col-lg-2">
                  <select v-model="itemsPerPage" class="form-select">
                    <option value="8">8 bài/trang</option>
                    <option value="12">12 bài/trang</option>
                    <option value="16">16 bài/trang</option>
                    <option value="24">24 bài/trang</option>
                  </select>
                </div>
              </div>

              <!-- Active Filters -->
              <div v-if="searchQuery || selectedCategory !== 'all'" class="mt-3">
                <div class="d-flex align-items-center gap-2">
                  <small class="text-muted">Bộ lọc đang áp dụng:</small>
                  <span v-if="searchQuery" class="badge bg-primary">
                    Tìm: "{{ searchQuery }}"
                    <button @click="searchQuery = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                  </span>
                  <span v-if="selectedCategory !== 'all'" class="badge bg-success">
                    Chuyên mục: {{ selectedCategory }}
                    <button @click="selectedCategory = 'all'" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                  </span>
                  <button @click="clearFilters" class="btn btn-sm btn-outline-secondary ms-auto">
                    <i class="bi bi-x-circle me-1"></i>Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Main Posts Grid -->
        <div class="col-lg-8">
          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-3 text-muted">Đang tải bài viết...</p>
          </div>

          <!-- No Results -->
          <div v-else-if="filteredPosts.length === 0" class="text-center py-5">
            <i class="bi bi-search display-1 text-muted"></i>
            <h4 class="mt-3">Không tìm thấy bài viết nào</h4>
            <p class="text-muted">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            <button @click="clearFilters" class="btn btn-primary">
              <i class="bi bi-arrow-clockwise me-2"></i>Xóa tìm kiếm
            </button>
          </div>

          <!-- Posts Grid -->
          <div v-else class="row g-4">
            <div 
              v-for="post in paginatedPosts" 
              :key="post.id"
              class="col-md-6 col-lg-6"
            >
              <div class="card h-100 shadow-sm border-0 hover-card">
                <!-- Post Image -->
                <div 
                  v-if="post.image"
                  class="card-img-top position-relative"
                  @click="router.push(`/post/${post.id}`)"
                  style="cursor: pointer;"
                >
                  <img 
                    :src="post.image" 
                    class="w-100 post-image"
                    :alt="post.title"
                  >
                  <div class="category-overlay">
                    <span class="badge bg-primary">{{ post.category || 'Chung' }}</span>
                  </div>
                  <div class="image-overlay"></div>
                </div>

                <div class="card-body d-flex flex-column">
                  <!-- Title -->
                  <h5 class="card-title post-title" @click="router.push(`/post/${post.id}`)" style="cursor: pointer;">
                    {{ post.title }}
                  </h5>

                  <!-- Excerpt -->
                  <p class="card-text text-muted flex-grow-1">
                    {{ post.content.substring(0, 100) }}...
                  </p>

                  <!-- Meta Info -->
                  <div class="post-meta mb-3">
                    <div class="d-flex align-items-center">
                      <div class="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2">
                        <i class="bi bi-person-fill text-primary"></i>
                      </div>
                      <div class="me-3">
                        <small class="text-muted">Tác giả</small>
                        <div class="fw-semibold">{{ post.author || 'Anonymous' }}</div>
                      </div>
                      <div class="border-start ps-3 me-3">
                        <small class="text-muted">Đăng lúc</small>
                        <div class="fw-semibold">{{ formatDate(post.createdAt) }}</div>
                      </div>
                      <div class="border-start ps-3">
                        <small class="text-muted">Thời gian đọc</small>
                        <div class="fw-semibold">{{ getReadingTime(post.content) }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Stats and Actions -->
                  <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                    <div class="post-stats d-flex gap-3">
                      <span class="text-danger">
                        <i class="bi bi-heart-fill me-1"></i>
                        {{ post.likes || 0 }}
                      </span>
                      <span class="text-primary">
                        <i class="bi bi-chat-dots me-1"></i>
                        {{ post.comments?.length || 0 }}
                      </span>
                      <span class="text-muted">
                        <i class="bi bi-eye me-1"></i>
                        {{ post.views || 0 }}
                      </span>
                    </div>
                    <button 
                      @click="router.push(`/post/${post.id}`)"
                      class="btn btn-sm btn-primary"
                    >
                      <i class="bi bi-arrow-right me-1"></i>Đọc tiếp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1 && !isLoading" class="mt-5">
            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-center">
                <!-- First Page -->
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="goToPage(1)" :disabled="currentPage === 1">
                    <i class="bi bi-chevron-double-left"></i>
                  </button>
                </li>
                
                <!-- Previous Page -->
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>
                
                <!-- Page Numbers -->
                <li 
                  v-for="page in pageNumbers" 
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <button class="page-link" @click="goToPage(page)">
                    {{ page }}
                  </button>
                </li>
                
                <!-- Next Page -->
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
                
                <!-- Last Page -->
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="goToPage(totalPages)" :disabled="currentPage === totalPages">
                    <i class="bi bi-chevron-double-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
            <div class="text-center text-muted mt-2">
              Hiển thị {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredPosts.length) }} 
              đến {{ Math.min(currentPage * itemsPerPage, filteredPosts.length) }} 
              của {{ filteredPosts.length }} bài viết
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <div class="sticky-sidebar">
            <!-- Hot Posts -->
            <div class="card shadow border-0 mb-4">
              <div class="card-header bg-gradient-danger text-white border-0">
                <div class="d-flex align-items-center">
                  <i class="bi bi-fire display-6 me-3"></i>
                  <div>
                    <h5 class="mb-0">Bài viết HOT</h5>
                    <small class="opacity-75">Đang được quan tâm nhất</small>
                  </div>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <router-link 
                    v-for="(post, index) in hotPosts" 
                    :key="post.id"
                    :to="`/post/${post.id}`"
                    class="list-group-item list-group-item-action border-0 py-3 px-4"
                  >
                    <div class="d-flex align-items-start">
                      <span class="badge bg-danger me-3">{{ index + 1 }}</span>
                      <div class="flex-grow-1">
                        <h6 class="mb-1">{{ post.title.substring(0, 60) }}...</h6>
                        <div class="small text-muted d-flex align-items-center gap-2">
                          <span>
                            <i class="bi bi-heart-fill me-1"></i>
                            {{ post.likes || 0 }}
                          </span>
                          <span>
                            <i class="bi bi-chat-dots me-1"></i>
                            {{ post.comments?.length || 0 }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Recent Posts -->
            <div class="card shadow border-0 mb-4">
              <div class="card-header bg-gradient-primary text-white border-0">
                <div class="d-flex align-items-center">
                  <i class="bi bi-clock-history display-6 me-3"></i>
                  <div>
                    <h5 class="mb-0">Bài viết mới nhất</h5>
                    <small class="opacity-75">Vừa được đăng gần đây</small>
                  </div>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <router-link 
                    v-for="post in recentPosts" 
                    :key="post.id"
                    :to="`/post/${post.id}`"
                    class="list-group-item list-group-item-action border-0 py-3 px-4"
                  >
                    <div class="d-flex">
                      <img 
                        v-if="post.image" 
                        :src="post.image" 
                        class="rounded me-3"
                        style="width: 60px; height: 60px; object-fit: cover;"
                        :alt="post.title"
                      >
                      <div class="flex-grow-1">
                        <h6 class="mb-1">{{ post.title.substring(0, 50) }}...</h6>
                        <small class="text-muted">{{ formatDate(post.createdAt) }}</small>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Categories -->
            <div class="card shadow border-0">
              <div class="card-header bg-gradient-success text-white border-0">
                <div class="d-flex align-items-center">
                  <i class="bi bi-tags display-6 me-3"></i>
                  <div>
                    <h5 class="mb-0">Chuyên mục</h5>
                    <small class="opacity-75">Khám phá theo danh mục</small>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex flex-wrap gap-2">
                  <button
                    v-for="cat in categories.filter(c => c !== 'all')"
                    :key="cat"
                    @click="selectedCategory = cat"
                    class="btn btn-outline-success"
                    :class="{ 'btn-success text-white': selectedCategory === cat }"
                  >
                    {{ cat }}
                    <span class="badge bg-light text-dark ms-1">
                      {{ postStore.posts.filter(p => p.category === cat).length }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div v-if="authStore.user" class="cta-section py-5 bg-primary bg-gradient">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h2 class="display-5 fw-bold text-white mb-3">Sẵn sàng chia sẻ câu chuyện của bạn?</h2>
            <p class="lead text-light mb-0">
              Viết bài ngay hôm nay và kết nối với cộng đồng yêu thích viết lách.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <router-link to="/create-post" class="btn btn-light btn-lg px-5">
              <i class="bi bi-pencil-square me-2"></i>Viết bài mới
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100px 0;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
  background-size: cover;
  background-position: bottom;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-img {
  height: 400px;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3));
  display: flex;
  align-items: center;
}

.carousel-caption {
  position: relative;
  text-align: left;
  padding: 2rem;
  max-width: 600px;
}

.stats-bar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.stat-item {
  padding: 1rem;
}

.stat-item i {
  font-size: 2.5rem;
}

.hover-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.1);
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
  border-color: #0d6efd;
}

.post-image {
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem 0.5rem 0 0;
}

.category-overlay {
  position: absolute;
  top: 15px;
  left: 15px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent);
}

.post-title {
  color: #2c3e50;
  transition: color 0.2s ease;
  font-weight: 600;
}

.post-title:hover {
  color: #0d6efd;
}

.post-meta {
  font-size: 0.85rem;
}

.post-stats {
  font-size: 0.9rem;
  font-weight: 500;
}

.sticky-sidebar {
  position: sticky;
  top: 100px;
}

.list-group-item {
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.list-group-item:hover {
  background-color: rgba(13, 110, 253, 0.05);
  border-left-color: #0d6efd;
}

.bg-gradient-danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.bg-gradient-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
}

.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-top: 4rem;
}

.avatar-sm {
  width: 36px;
  height: 36px;
}

.page-link {
  cursor: pointer;
  border-radius: 8px !important;
  margin: 0 2px;
  border: none;
  color: #495057;
  font-weight: 500;
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.card {
  border-radius: 12px;
  border: none;
  overflow: hidden;
}

.form-control, .form-select, .input-group-text {
  border-radius: 8px;
}

.form-control:focus, .form-select:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}

.text-muted {
  color: #6c757d !important;
}

.text-primary {
  color: #0d6efd !important;
}

.text-success {
  color: #198754 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-warning {
  color: #ffc107 !important;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0;
  }
  
  .hero-img {
    height: 250px;
  }
  
  .carousel-caption h3 {
    font-size: 1.25rem;
  }
  
  .sticky-sidebar {
    position: static;
  }
}
</style>