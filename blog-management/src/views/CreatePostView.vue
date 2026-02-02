<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/postStore';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const postStore = usePostStore();
const authStore = useAuthStore();

// Form data
const title = ref('');
const content = ref('');
const image = ref('');
const category = ref('');
const tags = ref('');
const isPublished = ref(true);

// UI state
const isLoading = ref(false);
const imagePreview = ref('');
const charCount = ref(0);
const categories = ref(['Công nghệ', 'Giáo dục', 'Sức khỏe', 'Du lịch', 'Ẩm thực', 'Thể thao', 'Kinh doanh', 'Giải trí']);

// Character limit
const MAX_CHARS = 5000;
const MAX_TITLE_CHARS = 200;

// Computed properties
const charProgress = computed(() => {
  const percentage = (charCount.value / MAX_CHARS) * 100;
  if (percentage < 50) return 'success';
  if (percentage < 80) return 'warning';
  return 'danger';
});

const wordCount = computed(() => {
  return content.value.trim() ? content.value.trim().split(/\s+/).length : 0;
});

const isFormValid = computed(() => {
  return title.value.trim().length >= 5 && 
         content.value.trim().length >= 20 && 
         content.value.trim().length <= MAX_CHARS;
});

// Image handling
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate image
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    alert('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)');
    e.target.value = '';
    return;
  }

  if (file.size > maxSize) {
    alert('Kích thước ảnh không được vượt quá 5MB');
    e.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    image.value = e.target.result;
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  image.value = '';
  imagePreview.value = '';
  document.getElementById('imageUpload').value = '';
};

// Content handling
const updateCharCount = () => {
  charCount.value = content.value.length;
};

// Form submission
const submitPost = async () => {
  if (!isFormValid.value) return;

  isLoading.value = true;
  
  try {
    // Prepare post data
    const postData = {
      title: title.value.trim(),
      content: content.value.trim(),
      image: image.value,
      category: category.value,
      tags: tags.value.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPublished: isPublished.value,
      author: authStore.user?.name || 'Anonymous',
      authorId: authStore.user?.id,
      createdAt: new Date().toISOString()
    };

    // Add post to store
    await postStore.addPost(postData);
    
    // Show success message
    showToast('success', 'Bài viết đã được đăng thành công!');
    
    // Redirect after delay
    setTimeout(() => {
      router.push('/');
    }, 1500);
    
  } catch (error) {
    showToast('error', 'Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.');
    console.error('Error creating post:', error);
  } finally {
    isLoading.value = false;
  }
};

const saveAsDraft = () => {
  isPublished.value = false;
  submitPost();
};

const cancelPost = () => {
  if (title.value || content.value) {
    if (confirm('Bài viết chưa được lưu. Bạn có chắc muốn rời đi?')) {
      router.push('/');
    }
  } else {
    router.push('/');
  }
};

// Toast notification
const showToast = (type, message) => {
  const toast = document.createElement('div');
  toast.className = `toast show position-fixed ${type === 'success' ? 'bg-success' : 'bg-danger'}`;
  toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
  toast.innerHTML = `
    <div class="toast-body text-white d-flex align-items-center">
      <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
      ${message}
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// Initialize
onMounted(() => {
  updateCharCount();
});
</script>

<template>
  <div class="create-post-page">
    <!-- Header -->
    <div class="container-fluid py-4 mb-4 bg-light border-bottom">
      <div class="container">
        <div class="row align-items-center">
          <div class="col">
            <h1 class="h3 mb-0 text-primary">
              <i class="bi bi-pencil-square me-2"></i>Tạo bài viết mới
            </h1>
            <p class="text-muted mb-0">Chia sẻ kiến thức và trải nghiệm của bạn với cộng đồng</p>
          </div>
          <div class="col-auto">
            <button @click="cancelPost" class="btn btn-outline-secondary me-2">
              <i class="bi bi-x-lg me-1"></i>Hủy
            </button>
            <button 
              @click="saveAsDraft" 
              :disabled="!title && !content"
              class="btn btn-outline-primary me-2"
            >
              <i class="bi bi-save me-1"></i>Lưu nháp
            </button>
            <button 
              @click="submitPost" 
              :disabled="!isFormValid || isLoading"
              class="btn btn-primary"
            >
              <template v-if="isLoading">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Đang đăng...
              </template>
              <template v-else>
                <i class="bi bi-send-check me-1"></i>Đăng bài
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <div class="row">
        <!-- Left Column: Editor -->
        <div class="col-lg-8">
          <div class="card shadow border-0 mb-4">
            <div class="card-body">
              <!-- Title -->
              <div class="mb-4">
                <label class="form-label fw-semibold d-flex justify-content-between">
                  <span>Tiêu đề bài viết</span>
                  <small class="text-muted">{{ title.length }}/{{ MAX_TITLE_CHARS }}</small>
                </label>
                <input
                  v-model="title"
                  :maxlength="MAX_TITLE_CHARS"
                  type="text"
                  class="form-control form-control-lg border-0 fs-4"
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  style="font-weight: 600;"
                />
                <div v-if="title.length < 5 && title.length > 0" class="text-danger small mt-1">
                  Tiêu đề cần ít nhất 5 ký tự
                </div>
              </div>

              <!-- Content Editor -->
              <div class="mb-4">
                <label class="form-label fw-semibold d-flex justify-content-between">
                  <span>Nội dung bài viết</span>
                  <small class="text-muted">{{ charCount }}/{{ MAX_CHARS }}</small>
                </label>
                <textarea
                  v-model="content"
                  @input="updateCharCount"
                  :maxlength="MAX_CHARS"
                  class="form-control border-0"
                  rows="12"
                  placeholder="Bắt đầu viết bài của bạn ở đây..."
                  style="resize: none; line-height: 1.6;"
                ></textarea>
                
                <!-- Character Progress -->
                <div class="mt-3">
                  <div class="progress" style="height: 6px;">
                    <div 
                      :class="`progress-bar bg-${charProgress}`"
                      :style="{ width: `${Math.min(100, (charCount / MAX_CHARS) * 100)}%` }"
                      role="progressbar"
                    ></div>
                  </div>
                  <div class="d-flex justify-content-between mt-2">
                    <small :class="`text-${charProgress}`">
                      {{ charCount }} / {{ MAX_CHARS }} ký tự
                    </small>
                    <small class="text-muted">{{ wordCount }} từ</small>
                  </div>
                  <div v-if="content.length < 20 && content.length > 0" class="text-danger small mt-1">
                    Nội dung cần ít nhất 20 ký tự
                  </div>
                </div>
              </div>

              <!-- Editor Toolbar -->
              <div class="border-top pt-3 mt-4">
                <h6 class="mb-3">Định dạng văn bản</h6>
                <div class="d-flex flex-wrap gap-2 mb-4">
                  <button class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-type-bold"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-type-italic"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-type-underline"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-list-ul"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-link-45deg"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-image"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Settings -->
        <div class="col-lg-4">
          <!-- Image Upload -->
          <div class="card shadow border-0 mb-4">
            <div class="card-body">
              <h6 class="card-title mb-3">
                <i class="bi bi-image text-primary me-2"></i>Hình ảnh bài viết
              </h6>
              
              <!-- Image Preview -->
              <div v-if="imagePreview" class="mb-3">
                <div class="position-relative">
                  <img 
                    :src="imagePreview" 
                    class="img-fluid rounded w-100" 
                    style="max-height: 200px; object-fit: cover;"
                    alt="Preview"
                  />
                  <button 
                    @click="removeImage"
                    class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                    style="width: 32px; height: 32px;"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Upload Button -->
              <div class="upload-area border-dashed rounded p-4 text-center"
                   :class="{ 'border-primary': imagePreview, 'border-secondary': !imagePreview }"
                   @click="$refs.fileInput.click()"
                   style="cursor: pointer;">
                <input 
                  id="imageUpload"
                  ref="fileInput"
                  type="file" 
                  accept="image/*" 
                  @change="handleImageUpload" 
                  class="d-none"
                />
                <div v-if="!imagePreview">
                  <i class="bi bi-cloud-arrow-up display-6 text-muted mb-3"></i>
                  <p class="text-muted mb-2">Kéo thả hoặc click để chọn ảnh</p>
                  <small class="text-muted">JPG, PNG, GIF tối đa 5MB</small>
                </div>
                <div v-else>
                  <i class="bi bi-check-circle display-6 text-success mb-3"></i>
                  <p class="text-success mb-0">Ảnh đã được tải lên</p>
                  <small class="text-muted">Click để thay đổi</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Category & Tags -->
          <div class="card shadow border-0 mb-4">
            <div class="card-body">
              <h6 class="card-title mb-3">
                <i class="bi bi-tags text-primary me-2"></i>Phân loại
              </h6>
              
              <!-- Category -->
              <div class="mb-3">
                <label class="form-label small">Chuyên mục</label>
                <select v-model="category" class="form-select">
                  <option value="" disabled selected>Chọn chuyên mục</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <!-- Tags -->
              <div class="mb-3">
                <label class="form-label small">Thẻ (Tags)</label>
                <input
                  v-model="tags"
                  type="text"
                  class="form-control"
                  placeholder="Ví dụ: vuejs, javascript, webdev"
                />
                <small class="text-muted">Phân cách bằng dấu phẩy</small>
              </div>

              <!-- Publish Status -->
              <div class="mt-4 pt-3 border-top">
                <label class="form-label small">Trạng thái</label>
                <div class="form-check form-switch">
                  <input 
                    v-model="isPublished" 
                    class="form-check-input" 
                    type="checkbox" 
                    id="publishSwitch"
                  />
                  <label class="form-check-label" for="publishSwitch">
                    <span v-if="isPublished" class="text-success">
                      <i class="bi bi-eye me-1"></i>Công khai
                    </span>
                    <span v-else class="text-muted">
                      <i class="bi bi-eye-slash me-1"></i>Riêng tư
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Post Stats -->
          <div class="card shadow border-0">
            <div class="card-body">
              <h6 class="card-title mb-3">
                <i class="bi bi-bar-chart text-primary me-2"></i>Thống kê bài viết
              </h6>
              <div class="row text-center">
                <div class="col-6 border-end">
                  <div class="display-6 fw-bold text-primary">{{ wordCount }}</div>
                  <small class="text-muted">Số từ</small>
                </div>
                <div class="col-6">
                  <div class="display-6 fw-bold text-success">{{ charCount }}</div>
                  <small class="text-muted">Số ký tự</small>
                </div>
              </div>
              <div class="mt-3 pt-3 border-top">
                <div class="alert alert-light small">
                  <i class="bi bi-lightbulb me-2"></i>
                  <strong>Mẹo:</strong> Sử dụng hình ảnh và thẻ tag để bài viết dễ được tìm thấy hơn.
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
.create-post-page {
  min-height: calc(100vh - 56px);
  background-color: #f8f9fa;
}

.border-dashed {
  border: 2px dashed;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.border-dashed:hover {
  border-color: #0d6efd !important;
  background-color: rgba(13, 110, 253, 0.05);
}

.upload-area {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-control, .form-select {
  border-radius: 8px;
}

.form-control:focus, .form-select:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
}

.card {
  border-radius: 12px;
  border: none;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.progress {
  border-radius: 3px;
  overflow: hidden;
}

textarea {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 1rem;
}

textarea:focus {
  box-shadow: none;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline-secondary:hover {
  transform: translateY(-1px);
}

.toast {
  border-radius: 8px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.text-success {
  color: #198754 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.bg-success {
  background-color: #198754 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}
</style>