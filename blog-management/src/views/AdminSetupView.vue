<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  name: 'Quản trị viên',
  email: '',
  password: '',
  confirmPassword: ''
});

const errorMessage = ref('');
const successMessage = ref('');

// Kiểm tra xem đã có admin chưa
onMounted(() => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const hasAdmin = users.some(user => user.role === 'admin');
  
  if (hasAdmin) {
    router.push('/login');
  }
});

const createAdmin = () => {
  // Reset messages
  errorMessage.value = '';
  successMessage.value = '';
  
  // Validation
  if (!formData.value.name || !formData.value.email || !formData.value.password) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin';
    return;
  }
  
  if (formData.value.password !== formData.value.confirmPassword) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp';
    return;
  }
  
  if (formData.value.password.length < 6) {
    errorMessage.value = 'Mật khẩu phải có ít nhất 6 ký tự';
    return;
  }
  
  // Kiểm tra email đã tồn tại chưa
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some(user => user.email === formData.value.email)) {
    errorMessage.value = 'Email đã tồn tại trong hệ thống';
    return;
  }
  
  // Tạo admin account
  const adminUser = {
    id: Date.now(),
    name: formData.value.name,
    email: formData.value.email,
    password: formData.value.password,
    avatar: '',
    bio: 'Quản trị viên hệ thống',
    website: '',
    location: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      github: '',
      linkedin: ''
    },
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(adminUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  successMessage.value = '✅ Đã tạo tài khoản quản trị viên thành công!';
  
  // Redirect sau 3 giây
  setTimeout(() => {
    router.push('/login');
  }, 3000);
};
</script>

<template>
  <div class="admin-setup-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-gradient-primary text-white text-center py-4">
              <i class="bi bi-shield-lock display-4 mb-3"></i>
              <h1 class="h3 mb-0">Thiết lập Quản trị viên</h1>
              <p class="mb-0 opacity-75">Tạo tài khoản admin đầu tiên cho hệ thống</p>
            </div>
            
            <div class="card-body p-4">
              <!-- Error Message -->
              <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ errorMessage }}
                <button type="button" class="btn-close" @click="errorMessage = ''"></button>
              </div>
              
              <!-- Success Message -->
              <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
                <i class="bi bi-check-circle-fill me-2"></i>
                {{ successMessage }}
              </div>
              
              <!-- Form -->
              <form @submit.prevent="createAdmin" v-if="!successMessage">
                <div class="mb-4">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-person-badge me-2"></i>Tên quản trị viên
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Nhập tên quản trị viên"
                    required
                  >
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-envelope me-2"></i>Email
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="form-control form-control-lg"
                    placeholder="admin@example.com"
                    required
                  >
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-key me-2"></i>Mật khẩu
                  </label>
                  <input
                    v-model="formData.password"
                    type="password"
                    class="form-control form-control-lg"
                    placeholder="Nhập mật khẩu"
                    required
                  >
                  <small class="text-muted">Mật khẩu phải có ít nhất 6 ký tự</small>
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-key-fill me-2"></i>Xác nhận mật khẩu
                  </label>
                  <input
                    v-model="formData.confirmPassword"
                    type="password"
                    class="form-control form-control-lg"
                    placeholder="Nhập lại mật khẩu"
                    required
                  >
                </div>
                
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary btn-lg">
                    <i class="bi bi-shield-check me-2"></i>
                    Tạo tài khoản Quản trị viên
                  </button>
                </div>
              </form>
              
              <!-- Info after success -->
              <div v-if="successMessage" class="mt-4">
                <div class="alert alert-info">
                  <div class="d-flex">
                    <i class="bi bi-info-circle-fill me-3 fs-4"></i>
                    <div>
                      <h6 class="alert-heading">Thông tin đăng nhập:</h6>
                      <p class="mb-1"><strong>Email:</strong> {{ formData.email }}</p>
                      <p class="mb-1"><strong>Mật khẩu:</strong> ********</p>
                      <p class="mb-0">Đang chuyển hướng đến trang đăng nhập...</p>
                    </div>
                  </div>
                </div>
                
                <div class="d-grid">
                  <button @click="router.push('/login')" class="btn btn-outline-primary">
                    <i class="bi bi-box-arrow-in-right me-2"></i>
                    Đến trang đăng nhập ngay
                  </button>
                </div>
              </div>
            </div>
            
            <div class="card-footer text-center py-3 bg-light">
              <small class="text-muted">
                <i class="bi bi-exclamation-circle me-1"></i>
                Tài khoản này sẽ có toàn quyền quản trị hệ thống
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-setup-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.card {
  border-radius: 15px;
  overflow: hidden;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-header {
  border-bottom: none;
}

.form-control {
  border-radius: 10px;
  border: 1px solid #dee2e6;
  padding: 1rem;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
}

.btn {
  border-radius: 10px;
  font-weight: 500;
  padding: 1rem;
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

.alert {
  border-radius: 10px;
  border: none;
}
</style>