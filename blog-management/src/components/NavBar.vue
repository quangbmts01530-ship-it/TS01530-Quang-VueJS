<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { usePostStore } from '@/stores/postStore';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const postStore = usePostStore();
const router = useRouter();

// Search functionality
const searchQuery = ref('');
const showMobileSearch = ref(false);
const notifications = ref([]);
const unreadNotificationCount = computed(() => 
  notifications.value.filter(n => !n.read).length
);

// Check if user is admin
const isAdmin = computed(() => {
  return authStore.user?.role === 'admin';
});

// User stats
const userStats = computed(() => {
  if (!authStore.user) return null;
  
  const userPosts = postStore.getUserPosts(authStore.user.id);
  return {
    postCount: userPosts.length,
    likeCount: userPosts.reduce((sum, post) => sum + (post.likes || 0), 0),
    commentCount: userPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)
  };
});

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`);
    searchQuery.value = '';
  }
};

const handleLogout = () => {
  authStore.logout();
  showNotification('Đăng xuất', 'Bạn đã đăng xuất thành công.', 'success');
  router.push('/login');
};

const goToProfile = () => {
  router.push('/profile');
};

const goToAdmin = () => {
  router.push('/admin');
};

const goToCreatePost = () => {
  router.push('/create-post');
};

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value;
  if (showMobileSearch.value) {
    setTimeout(() => {
      document.getElementById('mobileSearchInput')?.focus();
    }, 100);
  }
};

const showNotification = (title, message, type = 'info') => {
  // Implementation for showing notifications
  console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
};

// Fetch notifications (simulated)
const fetchNotifications = () => {
  notifications.value = [
    { id: 1, title: 'Bài viết mới', message: 'Có bài viết mới trong chuyên mục bạn theo dõi', read: false, time: '5 phút trước', type: 'post' },
    { id: 2, title: 'Bình luận mới', message: 'Ai đó đã bình luận bài viết của bạn', read: false, time: '1 giờ trước', type: 'comment' },
    { id: 3, title: 'Lượt thích', message: 'Bài viết của bạn nhận được 10 lượt thích', read: true, time: '2 giờ trước', type: 'like' }
  ];
};

// Initialize
onMounted(() => {
  fetchNotifications();
});
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
    <div class="container-fluid container-lg">
      <!-- Brand Logo -->
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <div class="brand-logo">
          <i class="bi bi-journal-bookmark-fill"></i>
        </div>
        <div class="ms-3">
          <span class="fw-bold fs-4">BlogSpace</span>
          <small class="d-block text-light opacity-75" style="font-size: 0.7rem;">FPT Polytechnic</small>
        </div>
      </router-link>

      <!-- Mobile Search Toggle -->
      <button 
        v-if="authStore.isAuthenticated"
        @click="toggleMobileSearch"
        class="btn btn-link text-white d-lg-none me-2"
      >
        <i class="bi bi-search fs-5"></i>
      </button>

      <!-- Mobile Toggler -->
      <button 
        class="navbar-toggler border-0" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Mobile Search -->
      <div v-if="showMobileSearch" class="mobile-search d-lg-none w-100 py-2">
        <div class="input-group">
          <input
            id="mobileSearchInput"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            class="form-control"
            placeholder="Tìm kiếm bài viết..."
          >
          <button @click="handleSearch" class="btn btn-primary">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>

      <!-- Navbar Content -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <!-- Search Bar (Desktop) -->
        <div v-if="authStore.isAuthenticated" class="navbar-search me-auto ms-4" style="max-width: 400px;">
          <div class="input-group">
            <span class="input-group-text bg-dark border-end-0">
              <i class="bi bi-search text-light"></i>
            </span>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              class="form-control bg-dark border-start-0 text-light"
              placeholder="Tìm kiếm bài viết, tác giả..."
            >
            <button @click="handleSearch" class="btn btn-primary">
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Navigation Links -->
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <!-- Home -->
          <li class="nav-item">
            <router-link 
              to="/" 
              class="nav-link d-flex align-items-center"
              :class="{ active: $route.path === '/' }"
            >
              <i class="bi bi-house-door me-2"></i>
              <span class="d-lg-none d-xl-inline">Trang chủ</span>
            </router-link>
          </li>

          <!-- Create Post (Authenticated only) -->
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <button 
              @click="goToCreatePost"
              class="nav-link d-flex align-items-center btn-create-post"
            >
              <i class="bi bi-plus-circle me-2"></i>
              <span class="d-lg-none d-xl-inline">Viết bài</span>
            </button>
          </li>

          <!-- Admin Link (Admin only) -->
          <li v-if="isAdmin" class="nav-item">
            <router-link 
              to="/admin" 
              class="nav-link d-flex align-items-center"
              :class="{ active: $route.path.startsWith('/admin') }"
            >
              <i class="bi bi-shield-lock me-2"></i>
              <span class="d-lg-none d-xl-inline">Quản trị</span>
            </router-link>
          </li>

          <!-- User Menu (Authenticated) -->
          <li v-if="authStore.isAuthenticated" class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle d-flex align-items-center"
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <!-- Notification Badge -->
              <div class="position-relative me-3">
                <i class="bi bi-bell fs-5"></i>
                <span 
                  v-if="unreadNotificationCount > 0"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style="font-size: 0.6rem;"
                >
                  {{ unreadNotificationCount }}
                </span>
              </div>

              <!-- User Avatar -->
              <div class="user-avatar me-2">
                <img 
                  v-if="authStore.user?.avatar"
                  :src="authStore.user.avatar" 
                  class="rounded-circle"
                  alt="Avatar"
                >
                <div v-else class="avatar-placeholder rounded-circle">
                  <i class="bi bi-person-fill"></i>
                </div>
              </div>

              <!-- User Info -->
              <div class="d-none d-xl-block text-start">
                <div class="fw-semibold">{{ authStore.user?.name }}</div>
                <small class="text-light opacity-75">
                  {{ userStats ? `${userStats.postCount} bài viết` : '' }}
                </small>
              </div>
            </a>

            <!-- Dropdown Menu -->
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <!-- User Header -->
              <li class="dropdown-header py-3">
                <div class="d-flex align-items-center">
                  <div class="user-avatar-lg me-3">
                    <img 
                      v-if="authStore.user?.avatar"
                      :src="authStore.user.avatar" 
                      class="rounded-circle"
                      alt="Avatar"
                    >
                    <div v-else class="avatar-placeholder-lg rounded-circle">
                      <i class="bi bi-person-fill"></i>
                    </div>
                  </div>
                  <div>
                    <h6 class="mb-0">{{ authStore.user?.name }}</h6>
                    <small class="text-muted">{{ authStore.user?.email }}</small>
                    <div v-if="isAdmin" class="mt-1">
                      <span class="badge bg-danger">Admin</span>
                    </div>
                  </div>
                </div>
              </li>

              <li><hr class="dropdown-divider"></li>

              <!-- User Links -->
              <li>
                <router-link to="/profile" class="dropdown-item py-3">
                  <i class="bi bi-person me-3"></i>
                  <div>
                    <div class="fw-semibold">Hồ sơ cá nhân</div>
                    <small class="text-muted">Quản lý thông tin tài khoản</small>
                  </div>
                </router-link>
              </li>

              <li>
                <router-link to="/my-posts" class="dropdown-item py-3">
                  <i class="bi bi-journal-text me-3"></i>
                  <div>
                    <div class="fw-semibold">Bài viết của tôi</div>
                    <small class="text-muted">{{ userStats?.postCount }} bài viết</small>
                  </div>
                </router-link>
              </li>

              <li>
                <router-link to="/notifications" class="dropdown-item py-3">
                  <i class="bi bi-bell me-3"></i>
                  <div>
                    <div class="fw-semibold">Thông báo</div>
                    <small class="text-muted">{{ unreadNotificationCount }} chưa đọc</small>
                  </div>
                </router-link>
              </li>

              <!-- Admin Section -->
              <li v-if="isAdmin">
                <hr class="dropdown-divider">
                <div class="dropdown-header small text-uppercase text-primary">
                  <i class="bi bi-shield-lock me-2"></i>Quản trị viên
                </div>
                <router-link to="/admin/users" class="dropdown-item">
                  <i class="bi bi-people me-2"></i>Quản lý người dùng
                </router-link>
                <router-link to="/admin/posts" class="dropdown-item">
                  <i class="bi bi-file-text me-2"></i>Quản lý bài viết
                </router-link>
                <router-link to="/admin/reports" class="dropdown-item">
                  <i class="bi bi-flag me-2"></i>Báo cáo vi phạm
                </router-link>
              </li>

              <li><hr class="dropdown-divider"></li>

              <!-- Logout -->
              <li>
                <button @click="handleLogout" class="dropdown-item text-danger py-3">
                  <i class="bi bi-box-arrow-right me-3"></i>
                  <div>
                    <div class="fw-semibold">Đăng xuất</div>
                    <small class="text-muted">Kết thúc phiên làm việc</small>
                  </div>
                </button>
              </li>
            </ul>
          </li>

          <!-- Auth Buttons (Not Authenticated) -->
          <li v-else class="nav-item">
            <div class="d-flex gap-2">
              <router-link to="/login" class="btn btn-outline-light">
                <i class="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
              </router-link>
              <router-link to="/register" class="btn btn-primary">
                <i class="bi bi-person-plus me-2"></i>Đăng ký
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 0;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  padding: 0.5rem 0;
  background: rgba(26, 26, 46, 0.98);
}

.brand-logo {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo i {
  font-size: 1.5rem;
  color: white;
}

.navbar-brand {
  color: white;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.navbar-brand:hover {
  transform: translateY(-2px);
}

.nav-link {
  color: rgba(255, 255, 255, 0.8) !important;
  padding: 0.75rem 1rem !important;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin: 0 0.25rem;
}

.nav-link:hover,
.nav-link.active {
  color: white !important;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.btn-create-post {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  border: none;
  padding: 0.5rem 1.5rem !important;
  margin-left: 0.5rem;
}

.btn-create-post:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.user-avatar {
  width: 36px;
  height: 36px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-avatar-lg {
  width: 60px;
  height: 60px;
}

.user-avatar-lg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 3px solid #667eea;
}

.avatar-placeholder-lg {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.dropdown-menu {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  min-width: 300px;
  margin-top: 0.5rem;
}

.dropdown-item {
  color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  margin: 0.25rem 0.5rem;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: rgba(102, 126, 234, 0.1);
  color: white;
  transform: translateX(5px);
}

.dropdown-header {
  color: white;
  font-weight: 600;
}

.input-group {
  border-radius: 8px;
  overflow: hidden;
}

.input-group .form-control {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.input-group .form-control:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
  color: white;
}

.input-group .form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input-group-text {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.mobile-search {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.5);
}

.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

@media (max-width: 992px) {
  .navbar-search {
    margin: 1rem 0;
    max-width: 100% !important;
  }
  
  .nav-link {
    margin: 0.25rem 0;
    text-align: center;
  }
  
  .btn-create-post {
    margin: 0.5rem 0;
    width: 100%;
  }
  
  .dropdown-menu {
    margin: 0.5rem;
    min-width: calc(100vw - 1rem);
  }
}

@media (max-width: 576px) {
  .navbar-brand span {
    font-size: 1rem;
  }
  
  .brand-logo {
    width: 32px;
    height: 32px;
  }
  
  .brand-logo i {
    font-size: 1.2rem;
  }
}
</style>