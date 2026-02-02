<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '@/stores/postStore';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const authStore = useAuthStore();

// Form data - Extended with new fields
const postId = ref(null);
const title = ref('');
const content = ref('');
const image = ref('');
const category = ref('');
const tags = ref('');
const isPublished = ref(true);
const originalPost = ref(null);

// UI state
const isLoading = ref(false);
const imagePreview = ref('');
const charCount = ref(0);
const MAX_CHARS = 5000;
const MAX_TITLE_CHARS = 200;
const categories = ref(['Công nghệ', 'Giáo dục', 'Sức khỏe', 'Du lịch', 'Ẩm thực', 'Thể thao', 'Kinh doanh', 'Giải trí']);

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

const isModified = computed(() => {
  if (!originalPost.value) return false;
  
  return title.value !== originalPost.value.title ||
         content.value !== originalPost.value.content ||
         image.value !== originalPost.value.image ||
         category.value !== originalPost.value.category ||
         tags.value !== (Array.isArray(originalPost.value.tags) ? originalPost.value.tags.join(', ') : originalPost.value.tags) ||
         isPublished.value !== originalPost.value.isPublished;
});

// Watch for content changes to update char count
watch(content, () => {
  updateCharCount();
});

// Load post data
const loadPost = () => {
  postId.value = Number(route.params.id);
  const post = postStore.posts.find(post => post.id === postId.value);
  
  if (!post) {
    showToast('error', 'Bài viết không tồn tại!');
    router.push('/');
    return;
  }

  // Check if user has permission to edit
  if (authStore.user?.id !== post.authorId && authStore.user?.role !== 'admin') {
    showToast('error', 'Bạn không có quyền chỉnh sửa bài viết này!');
    router.push('/');
    return;
  }

  originalPost.value = { ...post };
  
  title.value = post.title || '';
  content.value = post.content || '';
  image.value = post.image || '';
  category.value = post.category || '';
  tags.value = Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '');
  isPublished.value = post.isPublished !== undefined ? post.isPublished : true;
  imagePreview.value = post.image || '';
  
  updateCharCount();
};

// Image handling
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate image
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    showToast('error', 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)');
    e.target.value = '';
    return;
  }

  if (file.size > maxSize) {
    showToast('error', 'Kích thước ảnh không được vượt quá 5MB');
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

const restoreImage = () => {
  image.value = originalPost.value?.image || '';
  imagePreview.value = originalPost.value?.image || '';
  document.getElementById('imageUpload').value = '';
};

// Content handling
const updateCharCount = () => {
  charCount.value = content.value.length;
};

const restoreOriginalContent = () => {
  if (!originalPost.value) return;
  
  if (confirm('Bạn có chắc muốn khôi phục nội dung gốc? Mọi thay đổi chưa lưu sẽ bị mất.')) {
    title.value = originalPost.value.title;
    content.value = originalPost.value.content;
    category.value = originalPost.value.category;
    tags.value = Array.isArray(originalPost.value.tags) ? originalPost.value.tags.join(', ') : originalPost.value.tags;
    isPublished.value = originalPost.value.isPublished;
    
    if (image.value !== originalPost.value.image) {
      image.value = originalPost.value.image;
      imagePreview.value = originalPost.value.image;
      document.getElementById('imageUpload').value = '';
    }
    
    showToast('success', 'Đã khôi phục nội dung gốc!');
  }
};

// Form submission
const updatePost = async () => {
  if (!isFormValid.value) return;

  isLoading.value = true;
  
  try {
    // Prepare updated post data
    const updatedData = {
      title: title.value.trim(),
      content: content.value.trim(),
      image: image.value,
      category: category.value,
      tags: tags.value.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPublished: isPublished.value,
      updatedAt: new Date().toISOString()
    };

    // Update post in store
    await postStore.updatePost(postId.value, updatedData);
    
    // Update original post reference
    originalPost.value = { ...originalPost.value, ...updatedData };
    
    // Show success message
    showToast('success', 'Bài viết đã được cập nhật thành công!');
    
    // Redirect after delay
    setTimeout(() => {
      router.push(`/post/${postId.value}`);
    }, 1500);
    
  } catch (error) {
    showToast('error', 'Có lỗi xảy ra khi cập nhật bài viết. Vui lòng thử lại.');
    console.error('Error updating post:', error);
  } finally {
    isLoading.value = false;
  }
};

const saveAsDraft = () => {
  isPublished.value = false;
  updatePost();
};

const cancelEdit = () => {
  if (isModified.value) {
    if (confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời đi?')) {
      router.push(`/post/${postId.value}`);
    }
  } else {
    router.push(`/post/${postId.value}`);
  }
};

const deletePost = () => {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.')) {
    postStore.deletePost(postId.value);
    showToast('success', 'Bài viết đã được xóa thành công!');
    setTimeout(() => {
      router.push('/');
    }, 1000);
  }
};

// Toast notification
const showToast = (type, message) => {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.custom-toast');
  existingToasts.forEach(toast => toast.remove());
  
  const toast = document.createElement('div');
  toast.className = `custom-toast show position-fixed ${type === 'success' ? 'bg-success' : 'bg-danger'}`;
  toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  toast.innerHTML = `
    <div class="toast-body text-white d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2 fs-5"></i>
        <span>${message}</span>
      </div>
      <button class="btn-close btn-close-white ms-3" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Initialize
onMounted(() => {
  loadPost();
});
</script>

<template>
  <div class="edit-post-page">
    <!-- Header -->
    <div class="container-fluid py-4 mb-4 bg-light border-bottom">
      <div class="container">
        <div class="row align-items-center">
          <div class="col">
            <div class="d-flex align-items-center">
              <i class="bi bi-pencil-square display-6 text-primary me-3"></i>
              <div>
                <h1 class="h3 mb-0">Chỉnh sửa bài viết</h1>
                <p class="text-muted mb-0">
                  <template v-if="originalPost">
                    ID: {{ postId }} • 
                    <i class="bi bi-calendar3 me-1"></i>Tạo: {{ formatDate(originalPost.createdAt) }}
                    <template v-if="originalPost.updatedAt">
                      • <i class="bi bi-arrow-clockwise ms-2 me-1"></i>Sửa: {{ formatDate(originalPost.updatedAt) }}
                    </template>
                  </template>
                </p>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <div class="d-flex flex-wrap gap-2">
              <button 
                v-if="isModified"
                @click="restoreOriginalContent"
                class="btn btn-outline-warning"
                title="Khôi phục nội dung gốc"
              >
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
              <button 
                @click="cancelEdit" 
                class="btn btn-outline-secondary"
              >
                <i class="bi bi-x-lg me-1"></i>Hủy
              </button>
              <button 
                @click="saveAsDraft" 
                :disabled="!isModified"
                class="btn btn-outline-primary"
              >
                <i class="bi bi-save me-1"></i>Lưu nháp
              </button>
              <button 
                @click="updatePost" 
                :disabled="!isFormValid || !isModified || isLoading"
                class="btn btn-primary"
              >
                <template v-if="isLoading">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Đang lưu...
                </template>
                <template v-else>
                  <i class="bi bi-check-lg me-1"></i>Cập nhật
                </template>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Modification indicator -->
        <div v-if="isModified" class="row mt-3">
          <div class="col-12">
            <div class="alert alert-warning alert-dismissible fade show py-2 mb-0">
              <div class="d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <span>Bạn có thay đổi chưa lưu</span>
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
              </div>
            </div>
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
            </div>
          </div>
        </div>

        <!-- Right Column: Settings & Actions -->
        <div class="col-lg-4">
          <!-- Image Upload -->
          <div class="card shadow border-0 mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="card-title mb-0">
                  <i class="bi bi-image text-primary me-2"></i>Hình ảnh
                </h6>
                <button 
                  v-if="originalPost?.image && image !== originalPost.image"
                  @click="restoreImage"
                  class="btn btn-sm btn-outline-secondary"
                  title="Khôi phục ảnh gốc"
                >
                  <i class="bi bi-arrow-counterclockwise"></i>
                </button>
              </div>
              
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

          <!-- Post Settings -->
          <div class="card shadow border-0 mb-4">
            <div class="card-body">
              <h6 class="card-title mb-3">
                <i class="bi bi-gear text-primary me-2"></i>Cài đặt bài viết
              </h6>
              
              <!-- Category -->
              <div class="mb-3">
                <label class="form-label small">Chuyên mục</label>
                <select v-model="category" class="form-select">
                  <option value="" disabled>Chọn chuyên mục</option>
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
              <div class="mb-4">
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

              <!-- Author Info -->
              <div v-if="originalPost" class="border-top pt-3">
                <label class="form-label small">Thông tin tác giả</label>
                <div class="d-flex align-items-center">
                  <div class="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i class="bi bi-person-fill text-primary"></i>
                  </div>
                  <div>
                    <h6 class="mb-0">{{ originalPost.author }}</h6>
                    <small class="text-muted">ID: {{ originalPost.authorId }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Post Stats & Actions -->
          <div class="card shadow border-0">
            <div class="card-body">
              <h6 class="card-title mb-3">
                <i class="bi bi-bar-chart text-primary me-2"></i>Thống kê
              </h6>
              <div class="row text-center mb-3">
                <div class="col-6 border-end">
                  <div class="display-6 fw-bold text-primary">{{ wordCount }}</div>
                  <small class="text-muted">Số từ</small>
                </div>
                <div class="col-6">
                  <div class="display-6 fw-bold text-success">{{ charCount }}</div>
                  <small class="text-muted">Số ký tự</small>
                </div>
              </div>
              
              <!-- Danger Zone -->
              <div class="border-top pt-3">
                <h6 class="text-danger mb-3">
                  <i class="bi bi-exclamation-triangle me-2"></i>Vùng nguy hiểm
                </h6>
                <button 
                  @click="deletePost"
                  class="btn btn-outline-danger w-100"
                >
                  <i class="bi bi-trash me-2"></i>Xóa bài viết
                </button>
                <small class="text-muted d-block mt-2">
                  <i class="bi bi-info-circle me-1"></i>
                  Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.
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
.edit-post-page {
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

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
  transform: translateY(-1px);
}

.avatar-sm {
  width: 36px;
  height: 36px;
}

.custom-toast {
  border-radius: 8px;
  animation: slideIn 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

.alert-warning {
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
  color: #664d03;
}
</style>