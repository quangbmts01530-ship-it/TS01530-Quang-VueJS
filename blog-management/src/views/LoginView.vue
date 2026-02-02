<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

// Form state
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

// UI state
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const validationErrors = ref({});

// Redirect to home if already logged in
onMounted(() => {
  if (authStore.user) {
    router.push('/');
  }
  
  // Check if there's saved email in localStorage
  const savedEmail = localStorage.getItem('rememberedEmail');
  if (savedEmail) {
    email.value = savedEmail;
    rememberMe.value = true;
  }
});

// Validation rules
const validateForm = () => {
  const errors = {};
  
  if (!email.value.trim()) {
    errors.email = 'Email không được để trống';
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.email = 'Email không hợp lệ';
  }
  
  if (!password.value) {
    errors.password = 'Mật khẩu không được để trống';
  } else if (password.value.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Form submission
const handleLogin = async () => {
  // Reset messages
  errorMessage.value = '';
  successMessage.value = '';
  validationErrors.value = {};
  
  // Validate form
  if (!validateForm()) {
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Attempt login
    const result = authStore.login(email.value, password.value);
    
    if (result.success) {
      // Handle remember me
      if (rememberMe.value) {
        localStorage.setItem('rememberedEmail', email.value);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Show success message
      successMessage.value = 'Đăng nhập thành công! Đang chuyển hướng...';
      
      // Redirect after delay
      setTimeout(() => {
        const redirectTo = router.currentRoute.value.query.redirect || '/';
        router.push(redirectTo);
      }, 1500);
    } else {
      errorMessage.value = result.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      // Clear password on failure
      password.value = '';
    }
  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Social login simulation
const handleSocialLogin = (provider) => {
  errorMessage.value = '';
  successMessage.value = `Đang kết nối với ${provider}...`;
  
  // Simulate social login
  setTimeout(() => {
    errorMessage.value = `Tính năng đăng nhập bằng ${provider} đang được phát triển.`;
    successMessage.value = '';
  }, 1000);
};

// Navigate to register
const goToRegister = () => {
  router.push('/register');
};

// Navigate to forgot password
const goToForgotPassword = () => {
  router.push('/forgot-password');
};

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="login-page">
    <div class="container-fluid vh-100">
      <div class="row h-100">
        <!-- Left Side - Branding/Illustration -->
        <div class="col-lg-6 d-none d-lg-block login-left">
          <div class="d-flex flex-column justify-content-center h-100 p-5">
            <!-- Brand -->
            <div class="mb-5">
              <router-link to="/" class="text-decoration-none">
                <div class="d-flex align-items-center">
                  <div class="brand-logo">
                    <i class="bi bi-journal-bookmark-fill"></i>
                  </div>
                  <h1 class="h2 mb-0 text-white ms-3">BlogSpace</h1>
                </div>
              </router-link>
              <p class="text-light opacity-75 mt-3">Nền tảng chia sẻ kiến thức và kết nối cộng đồng</p>
            </div>

            <!-- Features -->
            <div class="mt-auto">
              <h2 class="h3 text-white mb-4">Tham gia cộng đồng của chúng tôi</h2>
              <div class="row g-3">
                <div class="col-6">
                  <div class="feature-card">
                    <div class="feature-icon">
                      <i class="bi bi-pencil-square"></i>
                    </div>
                    <h5 class="text-white mb-1">Viết bài</h5>
                    <p class="text-light opacity-75 small mb-0">Chia sẻ kiến thức của bạn</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="feature-card">
                    <div class="feature-icon">
                      <i class="bi bi-chat-dots"></i>
                    </div>
                    <h5 class="text-white mb-1">Thảo luận</h5>
                    <p class="text-light opacity-75 small mb-0">Trao đổi với cộng đồng</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="feature-card">
                    <div class="feature-icon">
                      <i class="bi bi-heart"></i>
                    </div>
                    <h5 class="text-white mb-1">Tương tác</h5>
                    <p class="text-light opacity-75 small mb-0">Like và bình luận bài viết</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="feature-card">
                    <div class="feature-icon">
                      <i class="bi bi-people"></i>
                    </div>
                    <h5 class="text-white mb-1">Kết nối</h5>
                    <p class="text-light opacity-75 small mb-0">Gặp gỡ người cùng đam mê</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quote -->
            <div class="mt-5 pt-5">
              <div class="quote-card">
                <i class="bi bi-quote display-4 text-primary opacity-50"></i>
                <p class="text-white fst-italic mb-3">
                  "Kiến thức chỉ có giá trị khi được chia sẻ."
                </p>
                <div class="d-flex align-items-center">
                  <div class="avatar-sm bg-white rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i class="bi bi-person-fill text-primary"></i>
                  </div>
                  <div>
                    <h6 class="text-white mb-0">Người dùng BlogSpace</h6>
                    <small class="text-light opacity-75">Thành viên cộng đồng</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="col-lg-6 col-12">
          <div class="d-flex flex-column justify-content-center h-100 p-4 p-lg-5">
            <!-- Back to Home -->
            <div class="mb-4 d-lg-none">
              <router-link to="/" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left me-2"></i>Quay lại trang chủ
              </router-link>
            </div>

            <!-- Login Form Card -->
            <div class="mx-auto" style="max-width: 400px; width: 100%;">
              <!-- Header -->
              <div class="text-center mb-5">
                <div class="d-inline-block p-3 bg-primary bg-opacity-10 rounded-circle mb-3">
                  <i class="bi bi-person-circle display-4 text-primary"></i>
                </div>
                <h1 class="h2 mb-2">Đăng nhập tài khoản</h1>
                <p class="text-muted">
                  Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
                </p>
              </div>

              <!-- Error/Success Messages -->
              <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ errorMessage }}
                <button type="button" class="btn-close" @click="errorMessage = ''"></button>
              </div>

              <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                {{ successMessage }}
                <button type="button" class="btn-close" @click="successMessage = ''"></button>
              </div>

              <!-- Login Form -->
              <div class="card border-0 shadow">
                <div class="card-body p-4">
                  <form @submit.prevent="handleLogin" novalidate>
                    <!-- Email Field -->
                    <div class="mb-4">
                      <label for="email" class="form-label fw-semibold">
                        <i class="bi bi-envelope me-2"></i>Email
                      </label>
                      <div class="input-group">
                        <span class="input-group-text bg-light border-end-0">
                          <i class="bi bi-at text-muted"></i>
                        </span>
                        <input
                          id="email"
                          v-model="email"
                          type="email"
                          class="form-control border-start-0"
                          :class="{ 'is-invalid': validationErrors.email }"
                          placeholder="Nhập email của bạn"
                          autocomplete="email"
                          autofocus
                        />
                      </div>
                      <div v-if="validationErrors.email" class="invalid-feedback d-block">
                        {{ validationErrors.email }}
                      </div>
                    </div>

                    <!-- Password Field -->
                    <div class="mb-4">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <label for="password" class="form-label fw-semibold">
                          <i class="bi bi-key me-2"></i>Mật khẩu
                        </label>
                        <button
                          type="button"
                          @click="goToForgotPassword"
                          class="btn btn-link p-0 text-decoration-none"
                        >
                          <small>Quên mật khẩu?</small>
                        </button>
                      </div>
                      <div class="input-group">
                        <span class="input-group-text bg-light border-end-0">
                          <i class="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          id="password"
                          v-model="password"
                          :type="showPassword ? 'text' : 'password'"
                          class="form-control border-start-0 pe-5"
                          :class="{ 'is-invalid': validationErrors.password }"
                          placeholder="Nhập mật khẩu của bạn"
                          autocomplete="current-password"
                        />
                        <button
                          type="button"
                          class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3 text-decoration-none"
                          @click="togglePasswordVisibility"
                          style="z-index: 5;"
                        >
                          <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                      </div>
                      <div v-if="validationErrors.password" class="invalid-feedback d-block">
                        {{ validationErrors.password }}
                      </div>
                    </div>

                    <!-- Remember Me & Submit -->
                    <div class="mb-4">
                      <div class="form-check mb-3">
                        <input
                          id="rememberMe"
                          v-model="rememberMe"
                          type="checkbox"
                          class="form-check-input"
                        />
                        <label for="rememberMe" class="form-check-label">
                          Ghi nhớ đăng nhập
                        </label>
                      </div>

                      <button
                        type="submit"
                        class="btn btn-primary btn-lg w-100"
                        :disabled="isLoading"
                      >
                        <template v-if="isLoading">
                          <span class="spinner-border spinner-border-sm me-2"></span>
                          Đang đăng nhập...
                        </template>
                        <template v-else>
                          <i class="bi bi-box-arrow-in-right me-2"></i>
                          Đăng nhập
                        </template>
                      </button>
                    </div>
                  </form>

                  <!-- Divider -->
                  <div class="divider my-4">
                    <span class="text-muted">hoặc đăng nhập với</span>
                  </div>

                  <!-- Social Login -->
                  <div class="row g-2 mb-4">
                    <div class="col-6">
                      <button
                        type="button"
                        @click="handleSocialLogin('Google')"
                        class="btn btn-outline-danger w-100"
                      >
                        <i class="bi bi-google me-2"></i>Google
                      </button>
                    </div>
                    <div class="col-6">
                      <button
                        type="button"
                        @click="handleSocialLogin('Facebook')"
                        class="btn btn-outline-primary w-100"
                      >
                        <i class="bi bi-facebook me-2"></i>Facebook
                      </button>
                    </div>
                  </div>

                  <!-- Register Link -->
                  <div class="text-center pt-3 border-top">
                    <p class="text-muted mb-2">Chưa có tài khoản?</p>
                    <button
                      @click="goToRegister"
                      class="btn btn-outline-success w-100"
                    >
                      <i class="bi bi-person-plus me-2"></i>Tạo tài khoản mới
                    </button>
                  </div>
                </div>
              </div>

              <!-- Footer Note -->
              <div class="text-center mt-4">
                <small class="text-muted">
                  Bằng việc đăng nhập, bạn đồng ý với
                  <a href="#" class="text-decoration-none">Điều khoản sử dụng</a> và
                  <a href="#" class="text-decoration-none">Chính sách bảo mật</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.login-left {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-left::before {
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

.brand-logo {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo i {
  font-size: 2rem;
  color: white;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  height: 100%;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.feature-icon i {
  font-size: 1.5rem;
  color: white;
}

.quote-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border-left: 4px solid #0d6efd;
}

.avatar-sm {
  width: 40px;
  height: 40px;
}

.card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.form-control, .input-group-text {
  border-radius: 10px;
}

.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
  border-color: #86b7fe;
}

.btn {
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.2s ease;
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
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline-success:hover {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-color: transparent;
  color: white;
}

.divider {
  position: relative;
  text-align: center;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #dee2e6;
  z-index: 1;
}

.divider span {
  position: relative;
  z-index: 2;
  background: white;
  padding: 0 1rem;
}

.alert {
  border-radius: 10px;
  border: none;
}

.alert-danger {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
}

.alert-success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: 0;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .login-left {
    display: none;
  }
  
  .login-page {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .container-fluid {
    background: white;
    border-radius: 20px;
    margin: 1rem;
    min-height: calc(100vh - 2rem);
  }
}

@media (max-width: 576px) {
  .container-fluid {
    margin: 0;
    border-radius: 0;
  }
  
  .p-4 {
    padding: 1.5rem !important;
  }
}
</style>