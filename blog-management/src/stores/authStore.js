import { defineStore } from 'pinia';
import { ref } from 'vue';


// Tạo admin account
const adminData = {
  id: 1,
  name: 'Admin Quang',
  email: 'admin@fpt.edu.vn',
  password: 'admin123',
  role: 'admin',
  avatar: '',
  createdAt: new Date().toISOString()
};

// Lấy danh sách users hiện tại
let users = JSON.parse(localStorage.getItem('users') || '[]');

// Kiểm tra xem admin đã tồn tại chưa
const existingAdmin = users.find(u => u.role === 'admin');
if (!existingAdmin) {
  users.push(adminData);
  localStorage.setItem('users', JSON.stringify(users));
  console.log('✅ Đã tạo admin thành công!');
  console.log('📧 Email: admin@fpt.edu.vn');
  console.log('🔑 Password: admin123');
} else {
  console.log('⚠️ Admin đã tồn tại:', existingAdmin.email);
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = ref(false);

  // Load user from localStorage on initialization
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    user.value = JSON.parse(savedUser);
    isAuthenticated.value = true;
  }

  const register = (name, email, password, avatar = '', bio = '', website = '', location = '') => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email đã tồn tại!' };
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      avatar,
      bio,
      website,
      location,
      socialLinks: {
        facebook: '',
        twitter: '',
        github: '',
        linkedin: ''
      },
      role: users.length === 0 ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const loginResult = login(email, password);
    
    if (loginResult.success) {
      return { success: true, message: 'Đăng ký thành công!' };
    } else {
      return { success: false, message: 'Đăng ký thành công nhưng đăng nhập thất bại' };
    }
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    
    if (found) {
      user.value = {
        id: found.id,
        name: found.name,
        email: found.email,
        avatar: found.avatar,
        bio: found.bio,
        website: found.website,
        location: found.location,
        socialLinks: found.socialLinks || {},
        role: found.role,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt
      };
      
      isAuthenticated.value = true;
      localStorage.setItem('currentUser', JSON.stringify(user.value));
      
      return { success: true, message: 'Đăng nhập thành công!' };
    }
    
    return { success: false, message: 'Sai email hoặc mật khẩu!' };
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updateData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === user.value.id);
    
    if (index !== -1) {
      // Update user data
      users[index] = {
        ...users[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      // Update password if provided
      if (updateData.password) {
        users[index].password = updateData.password;
      }
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user in store
      user.value = {
        ...user.value,
        ...updateData
      };
      
      // Remove password from user object (don't store it in memory)
      delete user.value.password;
      
      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(user.value));
      
      return { success: true, message: 'Cập nhật thông tin thành công!' };
    }
    
    return { success: false, message: 'Không tìm thấy người dùng!' };
  };

  // Check if user is admin
  const isAdmin = () => {
    return user.value?.role === 'admin';
  };

  return { 
    user, 
    isAuthenticated, 
    register, 
    login, 
    logout, 
    updateProfile,
    isAdmin
  };
  
});