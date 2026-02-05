import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null); // { id, name, email, password, avatar }
  const isAuthenticated = ref(false);

  // Load từ localStorage khi khởi động
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    user.value = JSON.parse(savedUser);
    isAuthenticated.value = true;
  }

  const register = (name, email, password, avatar = '') => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email đã tồn tại!' };
    }
    const newUser = { id: Date.now(), name, email, password, avatar };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    login(email, password);
    return { success: true, message: 'Đăng ký thành công!' };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      user.value = { ...found };
      delete user.value.password; // Không lưu password trong state
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

  const updateProfile = (name, email, password, avatar) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === user.value.id);
    if (index !== -1) {
      users[index] = { ...users[index], name, email, password, avatar };
      localStorage.setItem('users', JSON.stringify(users));
      user.value = { id: users[index].id, name, email, avatar };
      localStorage.setItem('currentUser', JSON.stringify(user.value));
      return { success: true };
  }
    return { success: false };
  };

  return { user, isAuthenticated, register, login, logout, updateProfile };
});