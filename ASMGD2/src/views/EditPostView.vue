<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '@/stores/postStore';

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();

const title = ref('');
const content = ref('');
const image = ref('');

onMounted(() => {
  const post = postStore.posts.find(p => p.id === Number(route.params.id));
  if (post) {
    title.value = post.title;
    content.value = post.content;
    image.value = post.image;
  }
});

const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => image.value = ev.target.result;
    reader.readAsDataURL(file);
  }
};

const submit = () => {
  postStore.updatePost(Number(route.params.id), title.value, content.value, image.value);
  router.push('/');
};
</script>

<template>
  <div class="container mt-5">
    <h2>Chỉnh sửa bài viết</h2>
    <!-- Form giống CreatePostView, chỉ đổi submit -->
    <form @submit.prevent="submit"> ... (copy form từ Create) ... </form>
  </div>
</template>