<template>
  <div class="container mt-5" style="max-width: 450px">
    <h2 class="mb-3">Đăng nhập</h2>

    <form @submit.prevent="submitLogin">
      <input v-model="email" class="form-control my-2" type="email" placeholder="Email" required>

      <input v-model="password" class="form-control my-2" type="password" placeholder="Password" required>

      <button class="btn btn-primary w-100 mt-3">Đăng nhập</button>
    </form>

    <p class="mt-3">
      Chưa có tài khoản?
      <router-link to="/register">Đăng ký ngay</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../store/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuth()

const submitLogin = async () => {
  const ok = await auth.login(email.value, password.value)

  if (!ok) {
    alert("Sai thông tin đăng nhập!")
    return
  }

  router.push('/profile')
}

</script>
