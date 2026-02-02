// src/create-admin.js
export function createAdminAccount() {
  // Kiểm tra xem đã có admin chưa
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const hasAdmin = users.some(user => user.role === 'admin');
  
  if (!hasAdmin) {
    // Tạo admin
    const adminUser = {
      id: 1,
      name: 'Quản trị viên',
      email: 'admin@blogspace.com',
      password: 'Admin@123', // Mật khẩu mạnh
      avatar: '',
      bio: 'Quản trị viên hệ thống BlogSpace',
      website: 'https://blogspace.edu.vn',
      location: 'TP.HCM, Việt Nam',
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
    
    console.log('🎯 Đã tạo tài khoản admin:');
    console.log('📧 Email: admin@blogspace.com');
    console.log('🔑 Password: Admin@123');
    console.log('👑 Role: admin');
    
    return adminUser;
  } else {
    console.log('✅ Đã có tài khoản admin trong hệ thống');
    return null;
  }
}