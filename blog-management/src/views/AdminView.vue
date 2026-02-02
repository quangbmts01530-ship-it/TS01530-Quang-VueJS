<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

// State management
const users = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const editingUser = ref(null);

// Fetch users from localStorage
const fetchUsers = () => {
  users.value = JSON.parse(localStorage.getItem('users') || '[]');
};

// Computed properties
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query) ||
    (user.role || 'user').toLowerCase().includes(query)
  );
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => 
  Math.ceil(filteredUsers.value.length / itemsPerPage.value)
);

// Actions
const deleteUser = (id) => {
  const arr = users.value.filter(u => u.id !== id);
  users.value = arr;
  localStorage.setItem('users', JSON.stringify(arr));
  
  if (authStore.user.id === id) {
    authStore.logout();
  }
};

const updateUserRole = (user) => {
  const updatedUsers = users.value.map(u => 
    u.id === user.id ? { ...u, role: user.role } : u
  );
  users.value = updatedUsers;
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  editingUser.value = null;
};

// Pagination controls
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const goToFirstPage = () => goToPage(1);
const goToLastPage = () => goToPage(totalPages.value);
const goToPrevPage = () => goToPage(currentPage.value - 1);
const goToNextPage = () => goToPage(currentPage.value + 1);

// Initialize
onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="admin-container" v-if="authStore.user?.role === 'admin'">
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h1 class="h3 mb-0 text-primary">
                    <i class="bi bi-people-fill me-2"></i>Quản lý người dùng
                  </h1>
                  <p class="text-muted mb-0">Quản lý tất cả người dùng trong hệ thống</p>
                </div>
                <div class="badge bg-primary bg-opacity-10 text-primary p-3">
                  <i class="bi bi-person-fill me-2"></i>
                  <span class="fw-bold">{{ users.length }}</span> người dùng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Controls -->
      <div class="row mb-4">
        <div class="col-md-8">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-search text-muted"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control border-start-0"
              placeholder="Tìm kiếm theo tên, email hoặc role..."
            >
            <button 
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="btn btn-outline-secondary"
              type="button"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
        <div class="col-md-4">
          <div class="d-flex align-items-center h-100">
            <label class="me-2 text-muted">Hiển thị:</label>
            <select v-model="itemsPerPage" class="form-select w-auto">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span class="ms-2 text-muted">mỗi trang</span>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow border-0">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="bg-light">
                    <tr>
                      <th class="ps-4 py-3 border-bottom" style="width: 5%;">#</th>
                      <th class="py-3 border-bottom">Tên người dùng</th>
                      <th class="py-3 border-bottom">Email</th>
                      <th class="py-3 border-bottom">Role</th>
                      <th class="py-3 border-bottom text-end pe-4">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="paginatedUsers.length === 0">
                      <td colspan="5" class="text-center py-5">
                        <i class="bi bi-person-x display-4 text-muted"></i>
                        <p class="mt-3 text-muted">Không tìm thấy người dùng nào</p>
                      </td>
                    </tr>
                    <tr 
                      v-for="(user, index) in paginatedUsers" 
                      :key="user.id"
                      class="hover-row"
                    >
                      <td class="ps-4">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3">
                            <i class="bi bi-person-fill text-primary"></i>
                          </div>
                          <div>
                            <h6 class="mb-0">{{ user.name }}</h6>
                            <small class="text-muted">ID: {{ user.id }}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="bi bi-envelope me-2 text-muted"></i>
                          {{ user.email }}
                        </div>
                      </td>
                      <td>
                        <div v-if="editingUser === user.id" class="d-flex align-items-center">
                          <select 
                            v-model="user.role" 
                            class="form-select form-select-sm me-2"
                            style="width: auto;"
                            @change="updateUserRole(user)"
                            @blur="editingUser = null"
                          >
                            <option value="user">Người dùng</option>
                            <option value="admin">Quản trị viên</option>
                          </select>
                          <button 
                            @click="editingUser = null"
                            class="btn btn-sm btn-outline-secondary"
                          >
                            <i class="bi bi-x"></i>
                          </button>
                        </div>
                        <div v-else>
                          <span 
                            :class="{
                              'badge': true,
                              'bg-success': user.role === 'admin',
                              'bg-secondary': user.role !== 'admin'
                            }"
                            class="cursor-pointer"
                            @click="editingUser = user.id"
                          >
                            {{ user.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
                          </span>
                          <small 
                            class="text-muted ms-2"
                            style="cursor: pointer;"
                            @click="editingUser = user.id"
                          >
                            <i class="bi bi-pencil"></i>
                          </small>
                        </div>
                      </td>
                      <td class="text-end pe-4">
                        <button 
                          @click="deleteUser(user.id)"
                          class="btn btn-sm btn-outline-danger"
                          :disabled="authStore.user.id === user.id"
                          :title="authStore.user.id === user.id ? 'Không thể xóa tài khoản của chính mình' : 'Xóa người dùng'"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="row mt-4" v-if="totalPages > 1">
        <div class="col-12">
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="goToFirstPage" :disabled="currentPage === 1">
                  <i class="bi bi-chevron-double-left"></i>
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="goToPrevPage" :disabled="currentPage === 1">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              
              <li 
                v-for="page in totalPages" 
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <button 
                  class="page-link" 
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
              </li>
              
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="goToNextPage" :disabled="currentPage === totalPages">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="goToLastPage" :disabled="currentPage === totalPages">
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </li>
            </ul>
          </nav>
          <div class="text-center text-muted mt-2">
            Hiển thị {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length) }} 
            đến {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} 
            của {{ filteredUsers.length }} người dùng
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container py-5">
    <div class="alert alert-danger shadow border-0">
      <div class="d-flex align-items-center">
        <i class="bi bi-shield-exclamation display-4 me-3"></i>
        <div>
          <h4 class="alert-heading mb-2">Truy cập bị từ chối!</h4>
          <p class="mb-0">Bạn không có quyền truy cập vào trang quản trị viên.</p>
          <p class="mb-0 mt-2">
            <router-link to="/" class="alert-link">Quay lại trang chủ</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.hover-row:hover {
  background-color: rgba(13, 110, 253, 0.02);
  transition: background-color 0.2s ease;
}

.avatar-sm {
  width: 36px;
  height: 36px;
}

.cursor-pointer {
  cursor: pointer;
}

.page-link {
  cursor: pointer;
}

.badge {
  padding: 0.35em 0.65em;
  font-weight: 500;
}

.bg-success {
  background-color: #198754 !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.card {
  border-radius: 0.75rem;
  border: none;
}

.input-group-text {
  background-color: #f8f9fa;
}

.form-select {
  border-radius: 0.5rem;
}

.btn-outline-danger:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.alert-danger {
  border-radius: 0.75rem;
  border: none;
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
}
</style>