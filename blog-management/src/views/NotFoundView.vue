<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="not-found-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10 text-center">
          <!-- Illustration -->
          <div class="error-illustration mb-5">
            <div class="error-number">
              <span class="number-4">4</span>
              <div class="planet">
                <i class="bi bi-planet"></i>
              </div>
              <span class="number-4">4</span>
            </div>
            <div class="error-astronaut">
              <i class="bi bi-robot"></i>
            </div>
          </div>

          <!-- Message -->
          <h1 class="display-4 fw-bold mb-4">Trang không tìm thấy</h1>
          <p class="lead text-muted mb-5">
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang chủ.
          </p>

          <!-- Actions -->
          <div class="d-flex flex-wrap justify-content-center gap-3">
            <button @click="goBack" class="btn btn-outline-primary btn-lg">
              <i class="bi bi-arrow-left me-2"></i>Quay lại
            </button>
            <button @click="goHome" class="btn btn-primary btn-lg">
              <i class="bi bi-house-door me-2"></i>Về trang chủ
            </button>
          </div>

          <!-- Search -->
          <div class="mt-5 pt-5">
            <p class="text-muted mb-3">Hoặc tìm kiếm nội dung khác</p>
            <div class="input-group mx-auto" style="max-width: 400px;">
              <input 
                type="text" 
                class="form-control form-control-lg" 
                placeholder="Tìm kiếm bài viết..."
                @keyup.enter="goHome"
              >
              <button class="btn btn-primary btn-lg" type="button">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>

          <!-- Useful Links -->
          <div class="mt-5 pt-5 border-top">
            <h5 class="mb-4">Các trang hữu ích</h5>
            <div class="row">
              <div class="col-md-3 col-6 mb-3">
                <router-link to="/" class="text-decoration-none">
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                      <i class="bi bi-house-door display-6 text-primary mb-3"></i>
                      <h6>Trang chủ</h6>
                    </div>
                  </div>
                </router-link>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <router-link to="/login" class="text-decoration-none">
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                      <i class="bi bi-box-arrow-in-right display-6 text-success mb-3"></i>
                      <h6>Đăng nhập</h6>
                    </div>
                  </div>
                </router-link>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <router-link to="/register" class="text-decoration-none">
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                      <i class="bi bi-person-plus display-6 text-info mb-3"></i>
                      <h6>Đăng ký</h6>
                    </div>
                  </div>
                </router-link>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <router-link to="/create-post" class="text-decoration-none">
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                      <i class="bi bi-pencil-square display-6 text-warning mb-3"></i>
                      <h6>Viết bài</h6>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.error-illustration {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-number {
  font-size: 12rem;
  font-weight: 900;
  color: #2c3e50;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.number-4 {
  text-shadow: 8px 8px 0 rgba(0,0,0,0.1);
  animation: float 3s ease-in-out infinite;
}

.number-4:nth-child(1) {
  animation-delay: 0s;
}

.number-4:nth-child(3) {
  animation-delay: 1s;
}

.planet {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 20s linear infinite;
}

.planet i {
  font-size: 3rem;
  color: white;
}

.error-astronaut {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  color: #0d6efd;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translate(-50%, -50%);
  }
  50% {
    transform: translate(-50%, -60%);
  }
}

.card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
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

.input-group {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.form-control {
  border-radius: 12px 0 0 12px;
  border: none;
  padding: 1rem 1.5rem;
}

.form-control:focus {
  box-shadow: none;
  border-color: #86b7fe;
}

.input-group .btn {
  border-radius: 0 12px 12px 0;
}

@media (max-width: 768px) {
  .error-number {
    font-size: 8rem;
  }
  
  .planet {
    width: 70px;
    height: 70px;
  }
  
  .planet i {
    font-size: 2rem;
  }
  
  .error-astronaut {
    font-size: 3rem;
  }
}

@media (max-width: 576px) {
  .error-number {
    font-size: 6rem;
  }
  
  .planet {
    width: 50px;
    height: 50px;
  }
  
  .planet i {
    font-size: 1.5rem;
  }
}
</style>