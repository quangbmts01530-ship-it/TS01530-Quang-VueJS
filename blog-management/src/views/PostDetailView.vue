<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '@/stores/postStore';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const authStore = useAuthStore();

// State management
const post = ref(null);
const newComment = ref('');
const replyTo = ref(null);
const replyContent = ref('');
const editCommentId = ref(null);
const editedCommentContent = ref('');
const isLoading = ref(true);
const showDeleteModal = ref(false);
const showShareModal = ref(false);
const activeTab = ref('comments');

// Related posts
const relatedPosts = ref([]);
const recommendedPosts = ref([]);

// Format date
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
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format number
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
};

// Calculate reading time
const getReadingTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} phút đọc`;
};

// Load post and related data
const loadPost = async () => {
  isLoading.value = true;
  const postId = Number(route.params.id);
  
  try {
    // Find post
    const foundPost = postStore.posts.find(p => p.id === postId);
    
    if (!foundPost) {
      router.push('/404');
      return;
    }
    
    post.value = { ...foundPost };
    
    // Increment view count
    if (!post.value.views) post.value.views = 0;
    post.value.views++;
    postStore.updatePostViews(postId, post.value.views);
    
    // Load related posts
    loadRelatedPosts();
    
    // Load recommended posts
    loadRecommendedPosts();
    
  } catch (error) {
    console.error('Error loading post:', error);
  } finally {
    isLoading.value = false;
  }
};

// Load related posts (same category)
const loadRelatedPosts = () => {
  if (!post.value || !post.value.category) return;
  
  relatedPosts.value = postStore.posts
    .filter(p => 
      p.id !== post.value.id && 
      p.category === post.value.category &&
      p.isPublished !== false
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);
};

// Load recommended posts
const loadRecommendedPosts = () => {
  recommendedPosts.value = postStore.posts
    .filter(p => 
      p.id !== post.value.id &&
      p.isPublished !== false
    )
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 3);
};

// Comments management
const addComment = () => {
  if (!newComment.value.trim() || !authStore.user) return;
  
  const comment = {
    id: Date.now(),
    content: newComment.value.trim(),
    author: authStore.user.name,
    authorId: authStore.user.id,
    authorRole: authStore.user.role,
    createdAt: new Date().toISOString(),
    likes: 0,
    replies: []
  };
  
  postStore.addComment(post.value.id, comment);
  newComment.value = '';
};

const addReply = (commentId) => {
  if (!replyContent.value.trim() || !authStore.user) return;
  
  const reply = {
    id: Date.now(),
    content: replyContent.value.trim(),
    author: authStore.user.name,
    authorId: authStore.user.id,
    authorRole: authStore.user.role,
    createdAt: new Date().toISOString(),
    parentId: commentId
  };
  
  postStore.addReply(post.value.id, commentId, reply);
  replyContent.value = '';
  replyTo.value = null;
};

const startEditComment = (comment) => {
  editCommentId.value = comment.id;
  editedCommentContent.value = comment.content;
};

const saveEditedComment = (commentId) => {
  if (!editedCommentContent.value.trim()) return;
  
  postStore.updateComment(post.value.id, commentId, editedCommentContent.value.trim());
  editCommentId.value = null;
  editedCommentContent.value = '';
};

const cancelEditComment = () => {
  editCommentId.value = null;
  editedCommentContent.value = '';
};

const deleteComment = (commentId) => {
  if (confirm('Bạn có chắc muốn xóa bình luận này?')) {
    postStore.deleteComment(post.value.id, commentId);
  }
};

// Likes management
const toggleLike = () => {
  if (!authStore.user) {
    router.push('/login');
    return;
  }
  
  postStore.toggleLike(post.value.id, authStore.user.id);
  post.value = { ...postStore.posts.find(p => p.id === post.value.id) };
};

const checkUserLiked = () => {
  if (!authStore.user || !post.value.likedBy) return false;
  return post.value.likedBy.includes(authStore.user.id);
};

// Post actions
const editPost = () => {
  router.push(`/edit-post/${post.value.id}`);
};

const deletePost = () => {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.')) {
    postStore.deletePost(post.value.id);
    showToast('success', 'Bài viết đã được xóa thành công!');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  }
};

const sharePost = () => {
  showShareModal.value = true;
  
  // Copy link to clipboard
  const postUrl = `${window.location.origin}/post/${post.value.id}`;
  navigator.clipboard.writeText(postUrl).then(() => {
    showToast('success', 'Đã sao chép link bài viết!');
  });
};

const copyLink = () => {
  const postUrl = `${window.location.origin}/post/${post.value.id}`;
  navigator.clipboard.writeText(postUrl).then(() => {
    showToast('success', 'Đã sao chép link!');
  });
};

const shareToFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank', 'width=600,height=400');
};

const shareToTwitter = () => {
  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.value.title)}`;
  window.open(url, '_blank', 'width=600,height=400');
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

// Check if user can edit/delete comment
const canModifyComment = (comment) => {
  if (!authStore.user) return false;
  return comment.authorId === authStore.user.id || authStore.user.role === 'admin';
};

// Check if user can edit/delete post
const canModifyPost = computed(() => {
  if (!authStore.user || !post.value) return false;
  return post.value.authorId === authStore.user.id || authStore.user.role === 'admin';
});

// Watch route changes
watch(() => route.params.id, () => {
  loadPost();
});

// Initialize
onMounted(() => {
  loadPost();
});
</script>

<template>
  <div class="post-detail-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-3 text-muted">Đang tải bài viết...</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="post" class="container-fluid py-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">
              <i class="bi bi-house-door"></i> Trang chủ
            </router-link>
          </li>
          <li v-if="post.category" class="breadcrumb-item">
            <router-link :to="`/category/${post.category}`" class="text-decoration-none">
              {{ post.category }}
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ post.title.substring(0, 50) }}...</li>
        </ol>
      </nav>

      <div class="row">
        <!-- Main Content -->
        <div class="col-lg-8">
          <!-- Post Header -->
          <div class="card shadow border-0 mb-4">
            <!-- Category Badge -->
            <div v-if="post.category" class="category-badge">
              <span class="badge bg-primary">{{ post.category }}</span>
            </div>
            
            <!-- Post Image -->
            <div v-if="post.image" class="post-image-container">
              <img :src="post.image" class="post-image" :alt="post.title">
              <div class="image-overlay"></div>
            </div>

            <div class="card-body p-4">
              <!-- Title -->
              <h1 class="post-title mb-3">{{ post.title }}</h1>

              <!-- Meta Info -->
              <div class="post-meta mb-4">
                <div class="row align-items-center">
                  <div class="col-md-6">
                    <div class="d-flex align-items-center">
                      <div class="avatar-lg bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3">
                        <i class="bi bi-person-fill text-primary fs-4"></i>
                      </div>
                      <div>
                        <div class="fw-semibold">{{ post.author || 'Anonymous' }}</div>
                        <div class="text-muted small">
                          <i class="bi bi-calendar3 me-1"></i>
                          {{ formatDate(post.createdAt) }}
                          <span v-if="post.updatedAt" class="ms-3">
                            <i class="bi bi-arrow-clockwise me-1"></i>
                            Sửa: {{ formatDate(post.updatedAt) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 text-md-end mt-3 mt-md-0">
                    <div class="d-flex flex-wrap justify-content-md-end gap-2">
                      <div class="stat-badge">
                        <i class="bi bi-eye me-1"></i>
                        {{ formatNumber(post.views || 0) }}
                      </div>
                      <div class="stat-badge">
                        <i class="bi bi-clock me-1"></i>
                        {{ getReadingTime(post.content) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="post.tags && post.tags.length > 0" class="mb-4">
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="tag in post.tags" :key="tag" class="badge bg-light text-dark">
                    <i class="bi bi-tag me-1"></i>{{ tag }}
                  </span>
                </div>
              </div>

              <!-- Post Content -->
              <div class="post-content mb-5">
                <div class="content-text" v-html="post.content.replace(/\n/g, '<br>')"></div>
              </div>

              <!-- Post Actions -->
              <div class="post-actions border-top pt-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex gap-3">
                    <!-- Like Button -->
                    <button 
                      @click="toggleLike"
                      class="btn btn-like"
                      :class="{ 'liked': checkUserLiked() }"
                      :disabled="!authStore.user"
                      :title="!authStore.user ? 'Đăng nhập để thích bài viết' : ''"
                    >
                      <i class="bi bi-heart-fill me-2"></i>
                      <span class="like-count">{{ formatNumber(post.likes || 0) }}</span>
                    </button>

                    <!-- Comment Button -->
                    <button 
                      @click="activeTab = 'comments'"
                      class="btn btn-outline-primary"
                    >
                      <i class="bi bi-chat-dots me-2"></i>
                      {{ formatNumber(post.comments?.length || 0) }}
                    </button>

                    <!-- Share Button -->
                    <button 
                      @click="sharePost"
                      class="btn btn-outline-secondary"
                    >
                      <i class="bi bi-share me-2"></i>
                      Chia sẻ
                    </button>
                  </div>

                  <!-- Edit/Delete (Author/Admin only) -->
                  <div v-if="canModifyPost" class="d-flex gap-2">
                    <button @click="editPost" class="btn btn-warning">
                      <i class="bi bi-pencil me-1"></i>Sửa
                    </button>
                    <button @click="deletePost" class="btn btn-danger">
                      <i class="bi bi-trash me-1"></i>Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="card shadow border-0">
            <div class="card-body p-4">
              <!-- Comments Header -->
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="mb-0">
                  <i class="bi bi-chat-left-text me-2"></i>
                  Bình luận ({{ post.comments?.length || 0 }})
                </h3>
                <div class="btn-group" role="group">
                  <button 
                    @click="activeTab = 'comments'"
                    class="btn btn-outline-primary"
                    :class="{ 'active': activeTab === 'comments' }"
                  >
                    Bình luận
                  </button>
                  <button 
                    @click="activeTab = 'preview'"
                    class="btn btn-outline-secondary"
                    :class="{ 'active': activeTab === 'preview' }"
                  >
                    Xem trước
                  </button>
                </div>
              </div>

              <!-- Add Comment Form -->
              <div v-if="authStore.user" class="add-comment mb-5">
                <div class="d-flex gap-3">
                  <div class="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <i class="bi bi-person-fill text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <textarea
                      v-model="newComment"
                      class="form-control"
                      rows="3"
                      placeholder="Viết bình luận của bạn..."
                    ></textarea>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                      <small class="text-muted">
                        Nhấn Enter để gửi, Shift+Enter để xuống dòng
                      </small>
                      <button 
                        @click="addComment"
                        :disabled="!newComment.trim()"
                        class="btn btn-primary"
                      >
                        <i class="bi bi-send me-1"></i>Gửi
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Login Prompt -->
              <div v-else class="alert alert-info mb-5">
                <div class="d-flex align-items-center">
                  <i class="bi bi-info-circle me-3"></i>
                  <div>
                    <p class="mb-1">Vui lòng đăng nhập để bình luận.</p>
                    <router-link to="/login" class="btn btn-sm btn-primary">
                      Đăng nhập ngay
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Comments List -->
              <div v-if="post.comments && post.comments.length > 0" class="comments-list">
                <div 
                  v-for="comment in post.comments" 
                  :key="comment.id"
                  class="comment-item mb-4"
                >
                  <div class="d-flex gap-3">
                    <!-- Comment Avatar -->
                    <div class="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-person-fill text-primary"></i>
                    </div>

                    <!-- Comment Content -->
                    <div class="flex-grow-1">
                      <!-- Comment Header -->
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong class="me-2">{{ comment.author }}</strong>
                          <span v-if="comment.authorRole === 'admin'" class="badge bg-danger">Admin</span>
                          <span class="text-muted small ms-2">
                            {{ formatDate(comment.createdAt) }}
                          </span>
                        </div>
                        
                        <!-- Comment Actions -->
                        <div v-if="canModifyComment(comment)" class="dropdown">
                          <button class="btn btn-sm btn-link text-muted" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                          </button>
                          <ul class="dropdown-menu">
                            <li>
                              <button 
                                @click="startEditComment(comment)"
                                class="dropdown-item"
                              >
                                <i class="bi bi-pencil me-2"></i>Sửa
                              </button>
                            </li>
                            <li>
                              <button 
                                @click="deleteComment(comment.id)"
                                class="dropdown-item text-danger"
                              >
                                <i class="bi bi-trash me-2"></i>Xóa
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <!-- Comment Edit Form -->
                      <div v-if="editCommentId === comment.id" class="mb-3">
                        <textarea
                          v-model="editedCommentContent"
                          class="form-control"
                          rows="2"
                        ></textarea>
                        <div class="d-flex gap-2 mt-2">
                          <button 
                            @click="saveEditedComment(comment.id)"
                            class="btn btn-sm btn-primary"
                          >
                            Lưu
                          </button>
                          <button 
                            @click="cancelEditComment"
                            class="btn btn-sm btn-outline-secondary"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>

                      <!-- Comment Text -->
                      <div v-else class="comment-text mb-3">
                        {{ comment.content }}
                      </div>

                      <!-- Comment Actions -->
                      <div class="comment-actions d-flex align-items-center gap-3">
                        <button 
                          @click="postStore.toggleCommentLike(post.id, comment.id, authStore.user?.id)"
                          class="btn btn-sm btn-link text-muted p-0"
                          :disabled="!authStore.user"
                        >
                          <i class="bi bi-heart me-1"></i>
                          {{ comment.likes || 0 }}
                        </button>
                        <button 
                          @click="replyTo = replyTo === comment.id ? null : comment.id"
                          class="btn btn-sm btn-link text-muted p-0"
                        >
                          <i class="bi bi-reply me-1"></i>
                          Trả lời
                        </button>
                      </div>

                      <!-- Reply Form -->
                      <div v-if="replyTo === comment.id && authStore.user" class="reply-form mt-3">
                        <div class="d-flex gap-2">
                          <div class="flex-grow-1">
                            <textarea
                              v-model="replyContent"
                              class="form-control form-control-sm"
                              rows="2"
                              placeholder="Viết phản hồi..."
                            ></textarea>
                          </div>
                          <div class="d-flex flex-column gap-1">
                            <button 
                              @click="addReply(comment.id)"
                              :disabled="!replyContent.trim()"
                              class="btn btn-sm btn-primary"
                            >
                              Gửi
                            </button>
                            <button 
                              @click="replyTo = null; replyContent = ''"
                              class="btn btn-sm btn-outline-secondary"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Replies -->
                      <div v-if="comment.replies && comment.replies.length > 0" class="replies mt-3">
                        <div 
                          v-for="reply in comment.replies" 
                          :key="reply.id"
                          class="reply-item ps-4 pt-3 border-start"
                        >
                          <div class="d-flex gap-2">
                            <div class="avatar-xs bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                              <i class="bi bi-person-fill text-secondary"></i>
                            </div>
                            <div class="flex-grow-1">
                              <div class="d-flex justify-content-between align-items-start mb-1">
                                <div>
                                  <strong class="small">{{ reply.author }}</strong>
                                  <span v-if="reply.authorRole === 'admin'" class="badge bg-danger small ms-1">Admin</span>
                                  <span class="text-muted small ms-2">
                                    {{ formatDate(reply.createdAt) }}
                                  </span>
                                </div>
                                <div v-if="canModifyComment(reply)" class="dropdown">
                                  <button class="btn btn-sm btn-link text-muted p-0" data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots-vertical"></i>
                                  </button>
                                  <ul class="dropdown-menu">
                                    <li>
                                      <button 
                                        @click="deleteComment(reply.id)"
                                        class="dropdown-item text-danger small"
                                      >
                                        <i class="bi bi-trash me-2"></i>Xóa
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <p class="small mb-0">{{ reply.content }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Comments -->
              <div v-else class="text-center py-5">
                <i class="bi bi-chat-square-text display-4 text-muted mb-3"></i>
                <h5 class="text-muted">Chưa có bình luận nào</h5>
                <p class="text-muted">Hãy là người đầu tiên bình luận!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <div class="sticky-sidebar">
            <!-- Author Info -->
            <div class="card shadow border-0 mb-4">
              <div class="card-body">
                <h5 class="card-title mb-4">
                  <i class="bi bi-person-circle me-2"></i>Về tác giả
                </h5>
                <div class="d-flex align-items-center mb-3">
                  <div class="avatar-lg bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i class="bi bi-person-fill text-primary fs-4"></i>
                  </div>
                  <div>
                    <h6 class="mb-1">{{ post.author || 'Anonymous' }}</h6>
                    <small class="text-muted">Tác giả bài viết</small>
                  </div>
                </div>
                <div v-if="authStore.user?.id === post.authorId" class="d-grid">
                  <router-link to="/profile" class="btn btn-outline-primary">
                    <i class="bi bi-person-lines-fill me-2"></i>Trang cá nhân
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Post Stats -->
            <div class="card shadow border-0 mb-4">
              <div class="card-body">
                <h5 class="card-title mb-4">
                  <i class="bi bi-bar-chart me-2"></i>Thống kê
                </h5>
                <div class="row text-center">
                  <div class="col-6 mb-3">
                    <div class="stat-number text-primary">{{ formatNumber(post.views || 0) }}</div>
                    <small class="text-muted">Lượt xem</small>
                  </div>
                  <div class="col-6 mb-3">
                    <div class="stat-number text-success">{{ formatNumber(post.likes || 0) }}</div>
                    <small class="text-muted">Lượt thích</small>
                  </div>
                  <div class="col-6">
                    <div class="stat-number text-warning">{{ post.comments?.length || 0 }}</div>
                    <small class="text-muted">Bình luận</small>
                  </div>
                  <div class="col-6">
                    <div class="stat-number text-info">{{ getReadingTime(post.content) }}</div>
                    <small class="text-muted">Thời gian đọc</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Related Posts -->
            <div v-if="relatedPosts.length > 0" class="card shadow border-0 mb-4">
              <div class="card-body">
                <h5 class="card-title mb-4">
                  <i class="bi bi-journal-text me-2"></i>Bài viết liên quan
                </h5>
                <div class="related-posts">
                  <div 
                    v-for="related in relatedPosts" 
                    :key="related.id"
                    class="related-post mb-3"
                    @click="router.push(`/post/${related.id}`)"
                    style="cursor: pointer;"
                  >
                    <div class="d-flex gap-3">
                      <img 
                        v-if="related.image" 
                        :src="related.image" 
                        class="related-image rounded"
                        :alt="related.title"
                      >
                      <div class="flex-grow-1">
                        <h6 class="mb-1">{{ related.title.substring(0, 60) }}...</h6>
                        <small class="text-muted">{{ formatDate(related.createdAt) }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recommended Posts -->
            <div v-if="recommendedPosts.length > 0" class="card shadow border-0">
              <div class="card-body">
                <h5 class="card-title mb-4">
                  <i class="bi bi-fire me-2"></i>Bài viết nổi bật
                </h5>
                <div class="recommended-posts">
                  <div 
                    v-for="recommended in recommendedPosts" 
                    :key="recommended.id"
                    class="recommended-post mb-3"
                    @click="router.push(`/post/${recommended.id}`)"
                    style="cursor: pointer;"
                  >
                    <div class="d-flex align-items-center">
                      <span class="badge bg-danger me-3">{{ recommendedPosts.indexOf(recommended) + 1 }}</span>
                      <div>
                        <h6 class="mb-1">{{ recommended.title.substring(0, 50) }}...</h6>
                        <div class="small text-muted">
                          <i class="bi bi-heart-fill text-danger me-1"></i>
                          {{ recommended.likes || 0 }}
                          <i class="bi bi-chat-dots ms-2 me-1"></i>
                          {{ recommended.comments?.length || 0 }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 404 -->
    <div v-else class="container text-center py-5">
      <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
      <h1 class="mt-3">404</h1>
      <p class="lead">Bài viết không tồn tại hoặc đã bị xóa</p>
      <router-link to="/" class="btn btn-primary">
        <i class="bi bi-house-door me-2"></i>Về trang chủ
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.loading-container {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.breadcrumb {
  background: transparent;
  padding: 0.75rem 0;
}

.breadcrumb-item a {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-item a:hover {
  color: #0d6efd;
}

.category-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
}

.post-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.post-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-image:hover {
  transform: scale(1.02);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
}

.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.post-meta {
  font-size: 0.9rem;
}

.avatar-lg {
  width: 60px;
  height: 60px;
}

.avatar-sm {
  width: 40px;
  height: 40px;
}

.avatar-xs {
  width: 24px;
  height: 24px;
}

.stat-badge {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
}

.post-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

.content-text {
  white-space: pre-wrap;
}

.post-actions {
  margin-top: 2rem;
}

.btn-like {
  background: transparent;
  border: 2px solid #dee2e6;
  color: #6c757d;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.btn-like:hover {
  background: rgba(220, 53, 69, 0.1);
  border-color: #dc3545;
  color: #dc3545;
}

.btn-like.liked {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
}

.btn-like.liked:hover {
  background: #bb2d3b;
  border-color: #b02a37;
}

.like-count {
  font-weight: 600;
}

.sticky-sidebar {
  position: sticky;
  top: 100px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.related-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
}

.related-post:hover,
.recommended-post:hover {
  background: rgba(13, 110, 253, 0.05);
  border-radius: 8px;
  padding: 0.5rem;
  margin: -0.5rem;
}

.comment-item {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.comment-item:hover {
  background: #f8f9fa;
}

.comment-text {
  line-height: 1.6;
}

.reply-item {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

.add-comment textarea {
  border-radius: 8px;
  resize: none;
}

.add-comment textarea:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
}

.dropdown-menu {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: 12px;
  border: none;
  overflow: hidden;
}

.card-body {
  padding: 2rem;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
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

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}

.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
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

.text-info {
  color: #0dcaf0 !important;
}

.alert {
  border-radius: 8px;
  border: none;
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

@media (max-width: 768px) {
  .post-title {
    font-size: 1.75rem;
  }
  
  .post-image {
    height: 250px;
  }
  
  .sticky-sidebar {
    position: static;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}
</style>