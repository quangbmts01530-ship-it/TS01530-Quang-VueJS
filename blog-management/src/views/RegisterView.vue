<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Form state
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeToTerms = ref(false);

// UI state
const isLoading = ref(false);
const validationErrors = ref({});
const errorMessage = ref('');
const successMessage = ref('');

// Password visibility
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Redirect to home if already logged in
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});

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
  
  if (!password.value) {
    errors.password = 'Mật khẩu không được để trống';
  } else if (password.value.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password.value)) {
    errors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
  }
  
  if (!confirmPassword.value) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  } else if (password.value !== confirmPassword.value) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }
  
  if (!agreeToTerms.value) {
    errors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
  }
  
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Form submission
const handleRegister = async () => {
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
    
    // Attempt registration
    const result = authStore.register(
      name.value.trim(),
      email.value.trim(),
      password.value
    );
    
    if (result.success) {
      successMessage.value = 'Đăng ký thành công! Đang chuyển hướng...';
      
      // Redirect to home or intended page
      setTimeout(() => {
        const redirectTo = route.query.redirect || '/';
        router.push(redirectTo);
      }, 2000);
    } else {
      errorMessage.value = result.message || 'Đăng ký thất bại. Vui lòng thử lại.';
    }
  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Toggle password visibility
const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
};

// Navigate to login
const goToLogin = () => {
  router.push('/login');
};

// Check password strength
const passwordStrength = ref(0);
const checkPasswordStrength = () => {
  const password = password.value;
  let strength = 0;
  
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  
  passwordStrength.value = strength;
};

// Get strength color
const getStrengthColor = () => {
  if (passwordStrength.value < 50) return 'danger';
  if (passwordStrength.value < 75) return 'warning';
  return 'success';
};

// Get strength text
const getStrengthText = () => {
  if (passwordStrength.value < 25) return 'Rất yếu';
  if (passwordStrength.value < 50) return 'Yếu';
  if (passwordStrength.value < 75) return 'Trung bình';
  return 'Mạnh';
};
</script>

<template>
  <div class="register-page">
    <div class="container-fluid vh-100">
      <div class="row h-100">
        <!-- Left Side - Branding/Illustration -->
        <div class="col-lg-6 d-none d-lg-block register-left">
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
              <p class="text-light opacity-75 mt-3">Tạo tài khoản để tham gia cộng đồng</p>
            </div>

            <!-- Benefits -->
            <div class="mb-5">
              <h2 class="h3 text-white mb-4">Lợi ích khi tham gia</h2>
              <div class="benefits-list">
                <div class="benefit-item d-flex align-items-center mb-3">
                  <div class="benefit-icon">
                    <i class="bi bi-check-circle-fill"></i>
                  </div>
                  <div class="ms-3">
                    <h5 class="text-white mb-1">Viết bài không giới hạn</h5>
                    <p class="text-light opacity-75 mb-0">Chia sẻ kiến thức và kinh nghiệm của bạn</p>
                  </div>
                </div>
                <div class="benefit-item d-flex align-items-center mb-3">
                  <div class="benefit-icon">
                    <i class="bi bi-check-circle-fill"></i>
                  </div>
                  <div class="ms-3">
                    <h5 class="text-white mb-1">Tương tác với cộng đồng</h5>
                    <p class="text-light opacity-75 mb-0">Like, bình luận và thảo luận cùng mọi người</p>
                  </div>
                </div>
                <div class="benefit-item d-flex align-items-center">
                  <div class="benefit-icon">
                    <i class="bi bi-check-circle-fill"></i>
                  </div>
                  <div class="ms-3">
                    <h5 class="text-white mb-1">Cá nhân hóa trải nghiệm</h5>
                    <p class="text-light opacity-75 mb-0">Theo dõi chủ đề yêu thích và tác giả</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Testimonials -->
            <div class="mt-auto">
              <div class="testimonial-card">
                <i class="bi bi-quote display-4 text-primary opacity-50"></i>
                <p class="text-white fst-italic mb-3">
                  "Đăng ký BlogSpace là quyết định tuyệt vời nhất của tôi năm nay. Tôi đã học được rất nhiều từ cộng đồng."
                </p>
                <div class="d-flex align-items-center">
                  <div class="avatar-sm bg-white rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i class="bi bi-person-fill text-primary"></i>
                  </div>
                  <div>
                    <h6 class="text-white mb-0">Nguyễn Văn A</h6>
                    <small class="text-light opacity-75">Thành viên từ 2023</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Register Form -->
        <div class="col-lg-6 col-12">
          <div class="d-flex flex-column justify-content-center h-100 p-4 p-lg-5">
            <!-- Back to Home -->
            <div class="mb-4 d-lg-none">
              <router-link to="/" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left me-2"></i>Quay lại trang chủ
              </router-link>
            </div>

            <!-- Register Form Card -->
            <div class="mx-auto" style="max-width: 450px; width: 100%;">
              <!-- Header -->
              <div class="text-center mb-5">
                <div class="d-inline-block p-3 bg-primary bg-opacity-10 rounded-circle mb-3">
                  <i class="bi bi-person-plus display-4 text-primary"></i>
                </div>
                <h1 class="h2 mb-2">Tạo tài khoản mới</h1>
                <p class="text-muted">
                  Tham gia cộng đồng của chúng tôi ngay hôm nay
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

              <!-- Register Form -->
              <div class="card border-0 shadow">
                <div class="card-body p-4">
                  <form @submit.prevent="handleRegister" novalidate>
                    <!-- Name -->
                    <div class="mb-4">
                      <label for="name" class="form-label fw-semibold">
                        <i class="bi bi-person me-2"></i>Họ và tên
                      </label>
                      <input
                        id="name"
                        v-model="name"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': validationErrors.name }"
                        placeholder="Nhập họ và tên của bạn"
                        autocomplete="name"
                        autofocus
                      />
                      <div v-if="validationErrors.name" class="invalid-feedback d-block">
                        {{ validationErrors.name }}
                      </div>
                    </div>

                    <!-- Email -->
                    <div class="mb-4">
                      <label for="email" class="form-label fw-semibold">
                        <i class="bi bi-envelope me-2"></i>Email
                      </label>
                      <input
                        id="email"
                        v-model="email"
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': validationErrors.email }"
                        placeholder="Nhập email của bạn"
                        autocomplete="email"
                      />
                      <div v-if="validationErrors.email" class="invalid-feedback d-block">
                        {{ validationErrors.email }}
                      </div>
                    </div>

                    <!-- Password -->
                    <div class="mb-4">
                      <label for="password" class="form-label fw-semibold">
                        <i class="bi bi-key me-2"></i>Mật khẩu
                      </label>
                      <div class="input-group">
                        <input
                          id="password"
                          v-model="password"
                          @input="checkPasswordStrength"
                          :type="showPassword ? 'text' : 'password'"
                          class="form-control"
                          :class="{ 'is-invalid': validationErrors.password }"
                          placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                          autocomplete="new-password"
                        />
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="togglePasswordVisibility('password')"
                        >
                          <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                      </div>
                      <!-- Password Strength -->
                      <div v-if="password" class="mt-2">
                        <div class="d-flex justify-content-between mb-1">
                          <small>Độ mạnh mật khẩu:</small>
                          <small :class="'text-' + getStrengthColor()">
                            {{ getStrengthText() }}
                          </small>
                        </div>
                        <div class="progress" style="height: 5px;">
                          <div 
                            :class="'progress-bar bg-' + getStrengthColor()"
                            :style="{ width: passwordStrength + '%' }"
                            role="progressbar"
                          ></div>
                        </div>
                        <small class="text-muted d-block mt-2">
                          <i class="bi bi-info-circle me-1"></i>
                          Mật khẩu nên chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                        </small>
                      </div>
                      <div v-if="validationErrors.password" class="invalid-feedback d-block">
                        {{ validationErrors.password }}
                      </div>
                    </div>

                    <!-- Confirm Password -->
                    <div class="mb-4">
                      <label for="confirmPassword" class="form-label fw-semibold">
                        <i class="bi bi-key-fill me-2"></i>Xác nhận mật khẩu
                      </label>
                      <div class="input-group">
                        <input
                          id="confirmPassword"
                          v-model="confirmPassword"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          class="form-control"
                          :class="{ 'is-invalid': validationErrors.confirmPassword }"
                          placeholder="Nhập lại mật khẩu"
                          autocomplete="new-password"
                        />
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="togglePasswordVisibility('confirm')"
                        >
                          <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                      </div>
                      <div v-if="validationErrors.confirmPassword" class="invalid-feedback d-block">
                        {{ validationErrors.confirmPassword }}
                      </div>
                    </div>

                    <!-- Terms Agreement -->
                    <div class="mb-4">
                      <div class="form-check">
                        <input
                          id="agreeToTerms"
                          v-model="agreeToTerms"
                          type="checkbox"
                          class="form-check-input"
                          :class="{ 'is-invalid': validationErrors.agreeToTerms }"
                        />
                        <label for="agreeToTerms" class="form-check-label">
                          Tôi đồng ý với 
                          <a href="#" class="text-decoration-none">Điều khoản sử dụng</a> 
                          và 
                          <a href="#" class="text-decoration-none">Chính sách bảo mật</a>
                        </label>
                      </div>
                      <div v-if="validationErrors.agreeToTerms" class="invalid-feedback d-block">
                        {{ validationErrors.agreeToTerms }}
                      </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="mb-4">
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg w-100"
                        :disabled="isLoading"
                      >
                        <template v-if="isLoading">
                          <span class="spinner-border spinner-border-sm me-2"></span>
                          Đang xử lý...
                        </template>
                        <template v-else>
                          <i class="bi bi-person-plus me-2"></i>
                          Đăng ký tài khoản
                        </template>
                      </button>
                    </div>
                  </form>

                  <!-- Divider -->
                  <div class="divider my-4">
                    <span class="text-muted">Đã có tài khoản?</span>
                  </div>

                  <!-- Login Link -->
                  <div class="text-center">
                    <button
                      @click="goToLogin"
                      class="btn btn-outline-success w-100"
                    >
                      <i class="bi bi-box-arrow-in-right me-2"></i>Đăng nhập ngay
                    </button>
                  </div>
                </div>
              </div>

              <!-- Footer Note -->
              <div class="text-center mt-4">
                <small class="text-muted">
                  Bằng việc đăng ký, bạn đồng ý với
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
.register-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.register-left {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.register-left::before {
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

.benefits-list {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
}

.benefit-item {
  padding: 0.5rem;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.benefit-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.benefit-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-icon i {
  font-size: 1.25rem;
  color: white;
}

.testimonial-card {
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

.progress {
  border-radius: 3px;
  overflow: hidden;
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
  .register-left {
    display: none;
  }
  
  .register-page {
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