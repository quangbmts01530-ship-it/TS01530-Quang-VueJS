import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuth = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),

  actions: {
    async register(email, password) {
      try {
        const res = await axios.post('http://localhost:8080/api/register', {
          email,
          password
        })

        alert("Đăng ký thành công!")
        return res.data
      } catch (err) {
        alert("Đăng ký thất bại!")
        console.error(err)
      }
    },

    async login(email, password) {
      try {
        const res = await axios.post('http://localhost:8080/api/login', {
          email,
          password
        })

        this.user = res.data.user
        this.isLoggedIn = true

        return true
      } catch (err) {
        alert("Sai tài khoản hoặc mật khẩu!")
        console.error(err)
        return false
      }
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
    }
  }
})