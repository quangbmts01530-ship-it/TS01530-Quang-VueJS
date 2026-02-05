import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';

export const usePostStore = defineStore('posts', () => {
  const posts = ref(JSON.parse(localStorage.getItem('posts') || '[]')); // [{ id, title, content, image, authorId, authorName, createdAt, comments: [{ id, content, authorName, createdAt }] }]

  const addPost = (title, content, image = '') => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return false;
    const newPost = {
      id: Date.now(),
      title,
      content,
      image,
      authorId: authStore.user.id,
      authorName: authStore.user.name,
      createdAt: new Date().toLocaleString(),
      comments: []
    };
    posts.value.unshift(newPost); // Thêm lên new post lên đầu
    localStorage.setItem('posts', JSON.stringify(posts.value));
    return true;
  };

  const updatePost = (id, title, content, image) => {
    const post = posts.value.find(p => p.id === id);
    if (post) {
      post.title = title;
      post.content = content;
      post.image = image;
      localStorage.setItem('posts', JSON.stringify(posts.value));
      return true;
    }
    return false;
  };

  const deletePost = (id) => {
    posts.value = posts.value.filter(p => p.id !== id);
    localStorage.setItem('posts', JSON.stringify(posts.value));
  };

  const addComment = (postId, content) => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return false;
    const post = posts.value.find(p => p.id === postId);
    if (post) {
      post.comments.push({
        id: Date.now(),
        content,
        authorName: authStore.user.name,
        createdAt: new Date().toLocaleString()
      });
      localStorage.setItem('posts', JSON.stringify(posts.value));
      return true;
    }
    return false;
  };

  return { posts, addPost, updatePost, deletePost, addComment };
});