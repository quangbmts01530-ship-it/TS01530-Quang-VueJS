<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const currentYear = new Date().getFullYear();

const navigateTo = (path) => {
  router.push(path);
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <footer class="footer">
    <!-- Main Footer -->
    <div class="footer-main py-5">
      <div class="container">
        <div class="row">
          <!-- Company Info -->
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="footer-brand mb-4">
              <router-link to="/" class="text-decoration-none">
                <div class="d-flex align-items-center">
                  <div class="brand-logo">
                    <i class="bi bi-journal-bookmark-fill"></i>
                  </div>
                  <div class="ms-3">
                    <h3 class="h4 mb-0 text-white">BlogSpace</h3>
                    <small class="text-light opacity-75">Chia sẻ tri thức - Kết nối cộng đồng</small>
                  </div>
                </div>
              </router-link>
            </div>
            <p class="text-light opacity-75 mb-4">
              Nền tảng blog chia sẻ kiến thức hàng đầu dành cho cộng đồng yêu thích viết lách và học hỏi.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" title="Facebook">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="#" class="social-link" title="Twitter">
                <i class="bi bi-twitter"></i>
              </a>
              <a href="#" class="social-link" title="Instagram">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="#" class="social-link" title="YouTube">
                <i class="bi bi-youtube"></i>
              </a>
              <a href="#" class="social-link" title="GitHub">
                <i class="bi bi-github"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-lg-2 col-md-6 mb-4">
            <h5 class="footer-title mb-4">Liên kết nhanh</h5>
            <ul class="footer-links list-unstyled">
              <li class="mb-3">
                <router-link to="/" class="footer-link">
                  <i class="bi bi-house-door me-2"></i>Trang chủ
                </router-link>
              </li>
              <li class="mb-3">
                <router-link to="/about" class="footer-link">
                  <i class="bi bi-info-circle me-2"></i>Giới thiệu
                </router-link>
              </li>
              <li class="mb-3">
                <router-link to="/contact" class="footer-link">
                  <i class="bi bi-envelope me-2"></i>Liên hệ
                </router-link>
              </li>
              <li class="mb-3">
                <router-link to="/faq" class="footer-link">
                  <i class="bi bi-question-circle me-2"></i>FAQ
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Categories -->
          <div class="col-lg-3 col-md-6 mb-4">
            <h5 class="footer-title mb-4">Chuyên mục</h5>
            <div class="category-tags">
              <span class="category-tag">Công nghệ</span>
              <span class="category-tag">Giáo dục</span>
              <span class="category-tag">Sức khỏe</span>
              <span class="category-tag">Du lịch</span>
              <span class="category-tag">Ẩm thực</span>
              <span class="category-tag">Thể thao</span>
              <span class="category-tag">Kinh doanh</span>
              <span class="category-tag">Giải trí</span>
            </div>
          </div>

          <!-- Newsletter -->
          <div class="col-lg-3 col-md-6 mb-4">
            <h5 class="footer-title mb-4">Đăng ký nhận tin</h5>
            <p class="text-light opacity-75 mb-3">
              Nhận thông báo về bài viết mới và sự kiện từ BlogSpace.
            </p>
            <div class="input-group mb-3">
              <input 
                type="email" 
                class="form-control" 
                placeholder="Email của bạn"
                aria-label="Email"
              >
              <button class="btn btn-primary" type="button">
                <i class="bi bi-send"></i>
              </button>
            </div>
            <div class="contact-info">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-geo-alt text-primary me-3"></i>
                <span class="text-light">Tòa nhà FPT Polytechnic, TP.HCM</span>
              </div>
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-envelope text-primary me-3"></i>
                <span class="text-light">contact@blogspace.edu.vn</span>
              </div>
              <div class="d-flex align-items-center">
                <i class="bi bi-telephone text-primary me-3"></i>
                <span class="text-light">(028) 7300 5588</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom py-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 mb-3 mb-md-0">
            <p class="mb-0 text-light opacity-75">
              &copy; {{ currentYear }} BlogSpace - FPT Polytechnic. Tất cả các quyền được bảo lưu.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <div class="d-flex flex-wrap justify-content-md-end gap-3">
              <router-link to="/privacy" class="footer-bottom-link">
                Chính sách bảo mật
              </router-link>
              <router-link to="/terms" class="footer-bottom-link">
                Điều khoản sử dụng
              </router-link>
              <router-link to="/sitemap" class="footer-bottom-link">
                Sitemap
              </router-link>
              <button @click="scrollToTop" class="btn-scroll-top">
                <i class="bi bi-arrow-up-circle"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <p class="mb-0 text-light opacity-50 small">
            Made with <i class="bi bi-heart-fill text-danger"></i> by Quang & Team
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%);
  color: white;
  margin-top: auto;
}

.footer-main {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom {
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-logo {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo i {
  font-size: 1.8rem;
  color: white;
}

.footer-title {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
  padding-bottom: 0.75rem;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.footer-links {
  padding: 0;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.footer-link:hover {
  color: white;
  transform: translateX(5px);
}

.footer-link i {
  font-size: 0.9rem;
  width: 20px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-tag:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(-3px);
}

.social-link i {
  font-size: 1.2rem;
}

.contact-info i {
  font-size: 1.2rem;
}

.footer-bottom-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-bottom-link:hover {
  color: white;
}

.btn-scroll-top {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-scroll-top:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(-2px);
}

.input-group {
  border-radius: 8px;
  overflow: hidden;
}

.input-group .form-control {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1rem;
}

.input-group .form-control:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
  color: white;
}

.input-group .form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input-group .btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem 1.25rem;
}

.input-group .btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

@media (max-width: 768px) {
  .footer-title {
    margin-top: 1.5rem;
  }
  
  .category-tags {
    justify-content: flex-start;
  }
  
  .footer-bottom-link {
    font-size: 0.8rem;
  }
}
</style>