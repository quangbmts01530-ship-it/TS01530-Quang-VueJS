import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import BlogList from "../pages/BlogList.vue";
import BlogDetail from "../pages/BlogDetail.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Profile from "../pages/Profile.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/blogs", component: BlogList },
  { path: "/blogs/:id", component: BlogDetail },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/profile", component: Profile }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
