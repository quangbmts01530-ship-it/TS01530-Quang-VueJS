<script>
import { ref } from 'vue'
import { useAuth } from '../store/auth'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const confirm = ref('')
    const auth = useAuth()

    const handleRegister = () => {
      if (password.value !== confirm.value) {
        alert("Mật khẩu không khớp!")
        return
      }
      auth.register(email.value, password.value)
      window.location.href = '/login'
    }

    return { email, password, confirm, handleRegister }
  }
}
</script>
<template>
  <div class="register container mt-4">
    <h1 class="text-primary">Đăng ký tài khoản</h1>

    <form @submit.prevent="handleRegister" class="mt-3">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" id="email" required />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Mật khẩu</label>
        <input v-model="password" type="password" class="form-control" id="password" required />
      </div>

      <div class="mb-3">
        <label for="confirm" class="form-label">Xác nhận mật khẩu</label>
        <input v-model="confirm" type="password" class="form-control" id="confirm" required />
      </div>

      <button type="submit" class="btn btn-primary">Đăng ký</button>
    </form>
  </div>
</template>