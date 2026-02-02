<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { usePostStore } from '@/stores/postStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const postStore = usePostStore();
const router = useRouter();

// Form state
const name = ref(authStore.user?.name || '');
const email = ref(authStore.user?.email || '');
const password = ref('');
const confirmPassword = ref('');
const avatar = ref(authStore.user?.avatar || '');
const bio = ref(authStore.user?.bio || '');
const website = ref(authStore.user?.website || '');
const location = ref(authStore.user?.location || '');
const socialLinks = ref(authStore.user?.socialLinks || {
  facebook: '',
  twitter: '',
  github: '',
  linkedin: ''
});

// UI state
const isLoading = ref(false);
const activeTab = ref('profile');
const validationErrors = ref({});
const successMessage = ref('');
const errorMessage = ref('');

// Computed properties
const userPosts = computed(() => {
  return postStore.posts.filter(post => post.authorId === authStore.user?.id);
});

const userStats = computed(() => {
  const posts = userPosts.value;
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  
  return {
    totalPosts: posts.length,
    totalLikes,
    totalComments,
    totalViews
  };
});

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'Chưa cập nhật';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Image handling
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate image
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!validTypes.includes(file.type)) {
    errorMessage.value = 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)';
    e.target.value = '';
    return;
  }

  if (file.size > maxSize) {
    errorMessage.value = 'Kích thước ảnh không được vượt quá 2MB';
    e.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    avatar.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const removeAvatar = () => {
  avatar.value = '';
  document.getElementById('avatarUpload').value = '';
};

// Form validation
const validateForm = () => {
  const errors = {};
  
  if (!name.value.trim()) {
    errors.name = 'Tên không được để trống';
  } else if (name.value.trim().length < 2) {
    errors.name = 'Tên phải có ít nhất 2 ký tự';
  }
  
  if (!email.value.trim()) {
    errors.email = 'Email không được để trống';
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.email = 'Email không hợp lệ';
  }
  
  if (password.value) {
    if (password.value.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (password.value !== confirmPassword.value) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
  }
  
  if (bio.value && bio.value.length > 500) {
    errors.bio = 'Tiểu sử không được vượt quá 500 ký tự';
  }
  
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Update profile
const updateProfile = async () => {
  successMessage.value = '';
  errorMessage.value = '';
  validationErrors.value = {};
  
  if (!validateForm()) {
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Prepare update data
    const updateData = {
      name: name.value.trim(),
      email: email.value.trim(),
      avatar: avatar.value,
      bio: bio.value.trim(),
      website: website.value.trim(),
      location: location.value.trim(),
      socialLinks: socialLinks.value,
      updatedAt: new Date().toISOString()
    };
    
    // Add password if provided
    if (password.value) {
      updateData.password = password.value;
    }
    
    // Update profile
    const result = await authStore.updateProfile(updateData);
    
    if (result.success) {
      successMessage.value = 'Cập nhật thông tin thành công!';
      
      // Reset password fields
      password.value = '';
      confirmPassword.value = '';
    } else {
      errorMessage.value = result.message || 'Có lỗi xảy ra khi cập nhật thông tin';
    }
  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    console.error('Update profile error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Delete account
const deleteAccount = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tài khoản? Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục.')) {
    // Implementation depends on your auth store
    console.log('Delete account');
  }
};

// Navigate to post
const goToPost = (postId) => {
  router.push(`/post/${postId}`);
};

// Load user data
const loadUserData = () => {
  const user = authStore.user;
  if (user) {
    name.value = user.name || '';
    email.value = user.email || '';
    avatar.value = user.avatar || '';
    bio.value = user.bio || '';
    website.value = user.website || '';
    location.value = user.location || '';
    socialLinks.value = user.socialLinks || {
      facebook: '',
      twitter: '',
      github: '',
      linkedin: ''
    };
  }
};

// Initialize
onMounted(() => {
  loadUserData();
});
</script>

<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="profile-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div class="d-flex align-items-center">
              <!-- Avatar -->
              <div class="position-relative me-4">
                <div class="avatar-xxl">
                  <img 
                    :src="avatar || 'https://ui-avatars.com/api/?name=' + name + '&background=667eea&color=fff&size=200'"
                    class="rounded-circle border border-4 border-white shadow"
                    alt="Avatar"
                  >
                </div>
                <label for="avatarUpload" class="avatar-upload-btn">
                  <i class="bi bi-camera-fill"></i>
                  <input 
                    id="avatarUpload"
                    type="file" 
                    accept="image/*" 
                    @change="handleImageUpload" 
                    class="d-none"
                  />
                </label>
              </div>

              <!-- User Info -->
              <div class="flex-grow-1">
                <h1 class="display-6 fw-bold text-white mb-2">{{ name }}</h1>
                <p class="text-light mb-3">
                  <i class="bi bi-envelope me-2"></i>{{ email }}
                </p>
                <div v-if="bio" class="text-light mb-3">
                  <i class="bi bi-person-lines-fill me-2"></i>{{ bio }}
                </div>
                <div class="d-flex gap-3">
                  <div class="text-light">
                    <i class="bi bi-geo-alt me-2"></i>{{ location || 'Chưa cập nhật' }}
                  </div>
                  <div v-if="website" class="text-light">
                    <i class="bi bi-link-45deg me-2"></i>
                    <a :href="website" target="_blank" class="text-light text-decoration-none">Website</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar py-4 bg-white border-bottom shadow-sm">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3 col-6 mb-3 mb-md-0">
            <div class="stat-item">
              <div class="stat-number text-primary">{{ userStats.totalPosts }}</div>
              <p class="text-muted mb-0">Bài viết</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3 mb-md-0">
            <div class="stat-item">
              <div class="stat-number text-success">{{ userStats.totalLikes }}</div>
              <p class="text-muted mb-0">Lượt thích</p>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-item">
              <div class="stat-number text-warning">{{ userStats.totalComments }}</div>
              <p class="text-muted mb-0">Bình luận</p>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-item">
              <div class="stat-number text-info">{{ userStats.totalViews }}</div>
              <p class="text-muted mb-0">Lượt xem</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-5">
      <div class="row">
        <!-- Left Column: Tabs -->
        <div class="col-lg-3">
          <div class="card shadow border-0 mb-4">
            <div class="card-body">
              <!-- Navigation Tabs -->
              <div class="nav flex-column nav-pills">
                <button 
                  @click="activeTab = 'profile'"
                  :class="['nav-link', 'text-start', { active: activeTab === 'profile' }]"
                >
                  <i class="bi bi-person-circle me-2"></i>
                  Thông tin cá nhân
                </button>
                <button 
                  @click="activeTab = 'posts'"
                  :class="['nav-link', 'text-start', { active: activeTab === 'posts' }]"
                >
                  <i class="bi bi-journal-text me-2"></i>
                  Bài viết của tôi
                  <span class="badge bg-primary ms-auto">{{ userPosts.length }}</span>
                </button>
                <button 
                  @click="activeTab = 'social'"
                  :class="['nav-link', 'text-start', { active: activeTab === 'social' }]"
                >
                  <i class="bi bi-link-45deg me-2"></i>
                  Mạng xã hội
                </button>
                <button 
                  @click="activeTab = 'security'"
                  :class="['nav-link', 'text-start', { active: activeTab === 'security' }]"
                >
                  <i class="bi bi-shield-lock me-2"></i>
                  Bảo mật
                </button>
                <button 
                  @click="activeTab = 'danger'"
                  :class="['nav-link', 'text-start', 'text-danger', { active: activeTab === 'danger' }]"
                >
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  Vùng nguy hiểm
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Content -->
        <div class="col-lg-9">
          <!-- Messages -->
          <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ successMessage }}
            <button type="button" class="btn-close" @click="successMessage = ''"></button>
          </div>

          <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
            <button type="button" class="btn-close" @click="errorMessage = ''"></button>
          </div>

          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="card shadow border-0">
            <div class="card-body">
              <h4 class="card-title mb-4">
                <i class="bi bi-person-circle me-2"></i>Chỉnh sửa thông tin cá nhân
              </h4>
              
              <form @submit.prevent="updateProfile" novalidate>
                <div class="row">
                  <!-- Left Column -->
                  <div class="col-md-6">
                    <!-- Name -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">
                        <i class="bi bi-person me-2"></i>Tên hiển thị
                      </label>
                      <input
                        v-model="name"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': validationErrors.name }"
                        placeholder="Nhập tên của bạn"
                      />
                      <div v-if="validationErrors.name" class="invalid-feedback d-block">
                        {{ validationErrors.name }}
                      </div>
                    </div>

                    <!-- Email -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">
                        <i class="bi bi-envelope me-2"></i>Email
                      </label>
                      <input
                        v-model="email"
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': validationErrors.email }"
                        placeholder="Nhập email của bạn"
                      />
                      <div v-if="validationErrors.email" class="invalid-feedback d-block">
                        {{ validationErrors.email }}
                      </div>
                    </div>

                    <!-- Location -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">
                        <i class="bi bi-geo-alt me-2"></i>Địa điểm
                      </label>
                      <input
                        v-model="location"
                        type="text"
                        class="form-control"
                        placeholder="Ví dụ: Hà Nội, Việt Nam"
                      />
                    </div>

                    <!-- Website -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">
                        <i class="bi bi-link-45deg me-2"></i>Website
                      </label>
                      <input
                        v-model="website"
                        type="url"
                        class="form-control"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="col-md-6">
                    <!-- Bio -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">
                        <i class="bi bi-person-lines-fill me-2"></i>Tiểu sử
                        <span class="text-muted small">(Tối đa 500 ký tự)</span>
                      </label>
                      <textarea
                        v-model="bio"
                        class="form-control"
                        rows="4"
                        :class="{ 'is-invalid': validationErrors.bio }"
                        placeholder="Giới thiệu ngắn gọn về bản thân..."
                      ></textarea>
                      <div class="d-flex justify-content-between mt-1">
                        <small class="text-muted">Để trống nếu không muốn hiển thị</small>
                        <small :class="bio.length > 500 ? 'text-danger' : 'text-muted'">
                          {{ bio.length }}/500
                        </small>
                      </div>
                      <div v-if="validationErrors.bio" class="invalid-feedback d-block">
                        {{ validationErrors.bio }}
                      </div>
                    </div>

                    <!-- Avatar Upload -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">
                        <i class="bi bi-image me-2"></i>Ảnh đại diện
                      </label>
                      <div class="d-flex align-items-center gap-3">
                        <div class="avatar-sm">
                          <img 
                            :src="avatar || 'https://ui-avatars.com/api/?name=' + name + '&background=667eea&color=fff&size=200'"
                            class="rounded-circle"
                            alt="Avatar preview"
                          >
                        </div>
                        <div class="flex-grow-1">
                          <input 
                            type="file" 
                            accept="image/*" 
                            @change="handleImageUpload" 
                            class="form-control"
                          />
                          <small class="text-muted">JPG, PNG, GIF tối đa 2MB</small>
                        </div>
                        <button 
                          v-if="avatar" 
                          @click="removeAvatar"
                          type="button" 
                          class="btn btn-outline-danger btn-sm"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="mt-4 pt-3 border-top">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg px-4"
                    :disabled="isLoading"
                  >
                    <template v-if="isLoading">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Đang lưu...
                    </template>
                    <template v-else>
                      <i class="bi bi-save me-2"></i>
                      Lưu thay đổi
                    </template>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Posts Tab -->
          <div v-if="activeTab === 'posts'" class="card shadow border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="card-title mb-0">
                  <i class="bi bi-journal-text me-2"></i>Bài viết của tôi
                </h4>
                <router-link to="/create-post" class="btn btn-primary">
                  <i class="bi bi-plus-circle me-2"></i>Viết bài mới
                </router-link>
              </div>

              <!-- Posts List -->
              <div v-if="userPosts.length > 0" class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>Tiêu đề</th>
                      <th>Lượt xem</th>
                      <th>Lượt thích</th>
                      <th>Bình luận</th>
                      <th>Ngày đăng</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="post in userPosts" :key="post.id">
                      <td>
                        <div class="d-flex align-items-center">
                          <img 
                            v-if="post.image" 
                            :src="post.image" 
                            class="rounded me-3"
                            style="width: 60px; height: 40px; object-fit: cover;"
                            :alt="post.title"
                          >
                          <div>
                            <strong>{{ post.title.substring(0, 50) }}{{ post.title.length > 50 ? '...' : '' }}</strong>
                            <div class="small text-muted">
                              {{ post.category || 'Không có chuyên mục' }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{{ post.views || 0 }}</td>
                      <td>{{ post.likes || 0 }}</td>
                      <td>{{ post.comments?.length || 0 }}</td>
                      <td>{{ formatDate(post.createdAt) }}</td>
                      <td>
                        <div class="d-flex gap-2">
                          <button 
                            @click="goToPost(post.id)"
                            class="btn btn-sm btn-outline-primary"
                            title="Xem bài viết"
                          >
                            <i class="bi bi-eye"></i>
                          </button>
                          <router-link 
                            :to="'/edit-post/' + post.id"
                            class="btn btn-sm btn-outline-warning"
                            title="Sửa bài viết"
                          >
                            <i class="bi bi-pencil"></i>
                          </router-link>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- No Posts -->
              <div v-else class="text-center py-5">
                <i class="bi bi-journal-x display-4 text-muted mb-3"></i>
                <h5 class="text-muted">Bạn chưa có bài viết nào</h5>
                <p class="text-muted mb-4">Hãy viết bài đầu tiên để chia sẻ kiến thức của bạn</p>
                <router-link to="/create-post" class="btn btn-primary">
                  <i class="bi bi-plus-circle me-2"></i>Viết bài ngay
                </router-link>
              </div>
            </div>
          </div>

          <!-- Social Tab -->
          <div v-if="activeTab === 'social'" class="card shadow border-0">
            <div class="card-body">
              <h4 class="card-title mb-4">
                <i class="bi bi-link-45deg me-2"></i>Liên kết mạng xã hội
              </h4>
              
              <form @submit.prevent="updateProfile" novalidate>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">
                      <i class="bi bi-facebook text-primary me-2"></i>Facebook
                    </label>
                    <input
                      v-model="socialLinks.facebook"
                      type="url"
                      class="form-control"
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">
                      <i class="bi bi-twitter text-info me-2"></i>Twitter
                    </label>
                    <input
                      v-model="socialLinks.twitter"
                      type="url"
                      class="form-control"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">
                      <i class="bi bi-github text-dark me-2"></i>GitHub
                    </label>
                    <input
                      v-model="socialLinks.github"
                      type="url"
                      class="form-control"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">
                      <i class="bi bi-linkedin text-primary me-2"></i>LinkedIn
                    </label>
                    <input
                      v-model="socialLinks.linkedin"
                      type="url"
                      class="form-control"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div class="mt-4 pt-3 border-top">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg px-4"
                    :disabled="isLoading"
                  >
                    <i class="bi bi-save me-2"></i>
                    Lưu liên kết
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="card shadow border-0">
            <div class="card-body">
              <h4 class="card-title mb-4">
                <i class="bi bi-shield-lock me-2"></i>Thay đổi mật khẩu
              </h4>
              
              <form @submit.prevent="updateProfile" novalidate>
                <div class="row">
                  <div class="col-md-8">
                    <!-- New Password -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Mật khẩu mới</label>
                      <input
                        v-model="password"
                        type="password"
                        class="form-control"
                        :class="{ 'is-invalid': validationErrors.password }"
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      />
                      <div v-if="validationErrors.password" class="invalid-feedback d-block">
                        {{ validationErrors.password }}
                      </div>
                    </div>

                    <!-- Confirm Password -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Xác nhận mật khẩu</label>
                      <input
                        v-model="confirmPassword"
                        type="password"
                        class="form-control"
                        :class="{ 'is-invalid': validationErrors.confirmPassword }"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <div v-if="validationErrors.confirmPassword" class="invalid-feedback d-block">
                        {{ validationErrors.confirmPassword }}
                      </div>
                    </div>

                    <!-- Security Tips -->
                    <div class="alert alert-info">
                      <div class="d-flex align-items-center">
                        <i class="bi bi-info-circle me-3"></i>
                        <div>
                          <strong>Mẹo bảo mật:</strong>
                          <ul class="mb-0 mt-2">
                            <li>Sử dụng mật khẩu dài ít nhất 6 ký tự</li>
                            <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                            <li>Không sử dụng mật khẩu dễ đoán</li>
                            <li>Không chia sẻ mật khẩu với bất kỳ ai</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-4 pt-3 border-top">
                      <button 
                        type="submit" 
                        class="btn btn-primary btn-lg px-4"
                        :disabled="isLoading"
                      >
                        <i class="bi bi-key me-2"></i>
                        Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Danger Zone Tab -->
          <div v-if="activeTab === 'danger'" class="card shadow border-0">
            <div class="card-body">
              <h4 class="card-title mb-4 text-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>Vùng nguy hiểm
              </h4>
              
              <div class="alert alert-danger">
                <div class="d-flex align-items-center">
                  <i class="bi bi-exclamation-triangle-fill display-6 me-3"></i>
                  <div>
                    <h5 class="alert-heading mb-2">Cảnh báo!</h5>
                    <p class="mb-0">Các hành động trong vùng này có thể gây mất dữ liệu vĩnh viễn và không thể khôi phục.</p>
                  </div>
                </div>
              </div>

              <!-- Delete Account -->
              <div class="card border-danger">
                <div class="card-body">
                  <h5 class="card-title text-danger mb-3">
                    <i class="bi bi-trash me-2"></i>Xóa tài khoản
                  </h5>
                  <p class="card-text">
                    Khi xóa tài khoản, tất cả dữ liệu của bạn bao gồm bài viết, bình luận và thông tin cá nhân sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                  </p>
                  <button 
                    @click="deleteAccount"
                    class="btn btn-outline-danger"
                  >
                    <i class="bi bi-trash me-2"></i>Xóa tài khoản
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 0 40px;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
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

.avatar-xxl {
  width: 150px;
  height: 150px;
  position: relative;
}

.avatar-xxl img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: #0d6efd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid white;
}

.avatar-upload-btn:hover {
  background: #0b5ed7;
  transform: scale(1.1);
}

.avatar-sm {
  width: 60px;
  height: 60px;
}

.avatar-sm img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stats-bar {
  margin-top: -30px;
  position: relative;
  z-index: 1;
  border-radius: 15px 15px 0 0;
}

.stat-item {
  padding: 1rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.nav-pills .nav-link {
  padding: 1rem 1.5rem;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  color: #495057;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-pills .nav-link:hover {
  background-color: rgba(13, 110, 253, 0.1);
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.nav-pills .nav-link .badge {
  margin-left: auto;
}

.card {
  border-radius: 15px;
  border: none;
  margin-bottom: 1.5rem;
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}

.form-control {
  border-radius: 10px;
  border: 1px solid #dee2e6;
  padding: 0.75rem 1rem;
}

.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
}

.btn {
  border-radius: 10px;
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

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.alert {
  border-radius: 10px;
  border: none;
}

.table th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.05);
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: #dc3545;
}

.border-danger {
  border-color: #dc3545 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-primary {
  color: #0d6efd !important;
}

.text-success {
  color: #198754 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-info {
  color: #0dcaf0 !important;
}

@media (max-width: 768px) {
  .profile-header {
    padding: 60px 0 30px;
  }
  
  .avatar-xxl {
    width: 100px;
    height: 100px;
  }
  
  .stats-bar {
    margin-top: -20px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}
</style>