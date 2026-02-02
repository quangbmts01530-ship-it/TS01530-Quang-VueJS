import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './authStore';

export const usePostStore = defineStore('posts', () => {
  const posts = ref(JSON.parse(localStorage.getItem('posts') || '[]'));
  const authStore = useAuthStore();

  // Computed properties for statistics
  const totalComments = computed(() => {
    return posts.value.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
  });

  const totalLikes = computed(() => {
    return posts.value.reduce((sum, post) => sum + (post.likes || 0), 0);
  });

  const totalViews = computed(() => {
    return posts.value.reduce((sum, post) => sum + (post.views || 0), 0);
  });

  const totalAuthors = computed(() => {
    const authors = new Set();
    posts.value.forEach(post => {
      if (post.authorId) authors.add(post.authorId);
    });
    return authors.size;
  });

  // Add new post with extended data structure
  const addPost = (postData) => {
    if (!authStore.isAuthenticated) {
      return { success: false, message: 'Bạn cần đăng nhập để đăng bài' };
    }

    try {
      const newPost = {
        id: Date.now(),
        title: postData.title,
        content: postData.content,
        image: postData.image || '',
        category: postData.category || '',
        tags: Array.isArray(postData.tags) ? postData.tags : (postData.tags || []),
        isPublished: postData.isPublished !== undefined ? postData.isPublished : true,
        author: authStore.user?.name || 'Anonymous',
        authorId: authStore.user?.id,
        authorRole: authStore.user?.role,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        likes: 0,
        likedBy: [],
        views: 0,
        comments: []
      };

      posts.value.unshift(newPost);
      saveToLocalStorage();
      
      return { 
        success: true, 
        message: 'Bài viết đã được đăng thành công!',
        post: newPost
      };
    } catch (error) {
      console.error('Error adding post:', error);
      return { success: false, message: 'Có lỗi xảy ra khi đăng bài' };
    }
  };

  // Update post with extended data
  const updatePost = (id, updatedData) => {
    try {
      const postIndex = posts.value.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        return { success: false, message: 'Bài viết không tồn tại' };
      }

      // Check permissions
      const post = posts.value[postIndex];
      if (post.authorId !== authStore.user?.id && authStore.user?.role !== 'admin') {
        return { success: false, message: 'Bạn không có quyền chỉnh sửa bài viết này' };
      }

      // Update post data
      posts.value[postIndex] = {
        ...post,
        title: updatedData.title || post.title,
        content: updatedData.content || post.content,
        image: updatedData.image !== undefined ? updatedData.image : post.image,
        category: updatedData.category || post.category,
        tags: Array.isArray(updatedData.tags) ? updatedData.tags : (updatedData.tags || post.tags),
        isPublished: updatedData.isPublished !== undefined ? updatedData.isPublished : post.isPublished,
        updatedAt: new Date().toISOString()
      };

      saveToLocalStorage();
      
      return { 
        success: true, 
        message: 'Bài viết đã được cập nhật thành công!',
        post: posts.value[postIndex]
      };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, message: 'Có lỗi xảy ra khi cập nhật bài viết' };
    }
  };

  // Delete post
  const deletePost = (id) => {
    try {
      const postIndex = posts.value.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        return { success: false, message: 'Bài viết không tồn tại' };
      }

      // Check permissions
      const post = posts.value[postIndex];
      if (post.authorId !== authStore.user?.id && authStore.user?.role !== 'admin') {
        return { success: false, message: 'Bạn không có quyền xóa bài viết này' };
      }

      posts.value.splice(postIndex, 1);
      saveToLocalStorage();
      
      return { 
        success: true, 
        message: 'Bài viết đã được xóa thành công!'
      };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, message: 'Có lỗi xảy ra khi xóa bài viết' };
    }
  };

  // Add comment with nested replies support
  const addComment = (postId, commentData) => {
    if (!authStore.isAuthenticated) {
      return { success: false, message: 'Bạn cần đăng nhập để bình luận' };
    }

    try {
      const postIndex = posts.value.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        return { success: false, message: 'Bài viết không tồn tại' };
      }

      const comment = {
        id: Date.now(),
        content: commentData.content,
        author: authStore.user?.name || 'Anonymous',
        authorId: authStore.user?.id,
        authorRole: authStore.user?.role,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        likes: 0,
        likedBy: [],
        replies: []
      };

      // Initialize comments array if it doesn't exist
      if (!posts.value[postIndex].comments) {
        posts.value[postIndex].comments = [];
      }

      posts.value[postIndex].comments.push(comment);
      saveToLocalStorage();
      
      return { 
        success: true, 
        message: 'Đã thêm bình luận!',
        comment
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, message: 'Có lỗi xảy ra khi thêm bình luận' };
    }
  };

  // Add reply to a comment
  const addReply = (postId, commentId, replyData) => {
    if (!authStore.isAuthenticated) {
      return { success: false, message: 'Bạn cần đăng nhập để phản hồi' };
    }

    try {
      const postIndex = posts.value.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        return { success: false, message: 'Bài viết không tồn tại' };
      }

      const commentIndex = posts.value[postIndex].comments.findIndex(c => c.id === commentId);
      
      if (commentIndex === -1) {
        return { success: false, message: 'Bình luận không tồn tại' };
      }

      const reply = {
        id: Date.now(),
        content: replyData.content,
        author: authStore.user?.name || 'Anonymous',
        authorId: authStore.user?.id,
        authorRole: authStore.user?.role,
        createdAt: new Date().toISOString(),
        parentId: commentId
      };

      // Initialize replies array if it doesn't exist
      if (!posts.value[postIndex].comments[commentIndex].replies) {
        posts.value[postIndex].comments[commentIndex].replies = [];
      }

      posts.value[postIndex].comments[commentIndex].replies.push(reply);
      saveToLocalStorage();
      
      return { 
        success: true, 
        message: 'Đã thêm phản hồi!',
        reply
      };
    } catch (error) {
      console.error('Error adding reply:', error);
      return { success: false, message: 'Có lỗi xảy ra khi thêm phản hồi' };
    }
  };

  // Update comment
  const updateComment = (postId, commentId, newContent) => {
    if (!authStore.isAuthenticated) {
      return { success: false, message: 'Bạn cần đăng nhập để chỉnh sửa' };
    }

    try {
      const postIndex = posts.value.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        return { success: false, message: 'Bài viết không tồn tại' };
      }

      const commentIndex = posts.value[postIndex].comments.findIndex(c => c.id === commentId);
      
      if (commentIndex === -1) {
        return { success: false, message: 'Bình luận không tồn tại' };
      }

      // Check permissions
      const comment = posts.value[postIndex].comments[commentIndex];
      if (comment.authorId !== authStore.user?.id && authStore.user?.role !== 'admin') {
        return { success: false, message: 'Bạn không có quyền chỉnh sửa bình luận này' };
      }

      posts.value[postIndex].comments[commentIndex].content = newContent;
      posts.value[postIndex].comments[commentIndex].updatedAt = new Date().toISOString();
      saveToLocalStorage();
      
      return { 
        success: true, 
        message: 'Đã cập nhật bình luận!'
      };
    } catch (error) {
      console.error('Error updating comment:', error);
      return { success: false, message: 'Có lỗi xảy ra khi cập nhật bình luận' };
    }
  };

  // Delete comment
  const deleteComment = (postId, commentId) => {
    if (!authStore.isAuthenticated) {
      return { success: false, message: 'Bạn cần đăng nhập để xóa' };
    }

    try {
      const postIndex = posts.value.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        return { success: false, message: 'Bài viết không tồn tại' };
      }

      const commentIndex = posts.value[postIndex].comments.findIndex(c => c.id === commentId);
      
      if (commentIndex === -1) {
        return { success: false, message: 'Bình luận không tồn tại' };
      }

      // Check permissions
      const comment = posts.value[postIndex].comments[commentIndex];
      if (comment.authorId !== authStore.user?.id && authStore.user?.role !== 'admin') {
        return { success: false, message: 'Bạn không có quyền xóa bình luận này' };
      }

      posts.value[postIndex].comments.splice(commentIndex, 1);
      saveToLocalStorage();
      
      return { 
        success: true, 
        message: 'Đã xóa bình luận!'
      };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { success: false, message: 'Có lỗi xảy ra khi xóa bình luận' };
    }
  };

  // Toggle like on post
  const toggleLike = (postId, userId) => {
    if (!authStore.isAuthenticated) {
      return { success: false, message: 'Bạn cần đăng nhập để thích bài viết' };
    }

    try {
      const postIndex = posts.value.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        return { success: false, message: 'Bài viết không tồn tại' };
      }

      const post = posts.value[postIndex];
      
      // Initialize likedBy array if it doesn't exist
      if (!post.likedBy) {
        post.likedBy = [];
      }

      const userIndex = post.likedBy.indexOf(userId);
      
      if (userIndex === -1) {
        // Add like
        post.likedBy.push(userId);
        post.likes = (post.likes || 0) + 1;
      } else {
        // Remove like
        post.likedBy.splice(userIndex, 1);
        post.likes = Math.max(0, (post.likes || 0) - 1);
      }

      saveToLocalStorage();
      
      return { 
        success: true, 
        message: userIndex === -1 ? 'Đã thích bài viết!' : 'Đã bỏ thích bài viết!',
        likes: post.likes,
        liked: userIndex === -1
      };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false, message: 'Có lỗi xảy ra khi thích bài viết' };
    }
  };

  // Toggle like on comment
  const toggleCommentLike = (postId, commentId, userId) => {
    if (!authStore.isAuthenticated) {
      return { success: false, message: 'Bạn cần đăng nhập để thích bình luận' };
    }

    try {
      const postIndex = posts.value.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        return { success: false, message: 'Bài viết không tồn tại' };
      }

      const commentIndex = posts.value[postIndex].comments.findIndex(c => c.id === commentId);
      
      if (commentIndex === -1) {
        return { success: false, message: 'Bình luận không tồn tại' };
      }

      const comment = posts.value[postIndex].comments[commentIndex];
      
      // Initialize likedBy array if it doesn't exist
      if (!comment.likedBy) {
        comment.likedBy = [];
      }

      const userIndex = comment.likedBy.indexOf(userId);
      
      if (userIndex === -1) {
        // Add like
        comment.likedBy.push(userId);
        comment.likes = (comment.likes || 0) + 1;
      } else {
        // Remove like
        comment.likedBy.splice(userIndex, 1);
        comment.likes = Math.max(0, (comment.likes || 0) - 1);
      }

      saveToLocalStorage();
      
      return { 
        success: true, 
        message: userIndex === -1 ? 'Đã thích bình luận!' : 'Đã bỏ thích bình luận!',
        likes: comment.likes,
        liked: userIndex === -1
      };
    } catch (error) {
      console.error('Error toggling comment like:', error);
      return { success: false, message: 'Có lỗi xảy ra khi thích bình luận' };
    }
  };

  // Update post views
  const updatePostViews = (postId, views) => {
    try {
      const postIndex = posts.value.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        return { success: false, message: 'Bài viết không tồn tại' };
      }

      posts.value[postIndex].views = views;
      saveToLocalStorage();
      
      return { 
        success: true, 
        message: 'Đã cập nhật lượt xem'
      };
    } catch (error) {
      console.error('Error updating post views:', error);
      return { success: false, message: 'Có lỗi xảy ra khi cập nhật lượt xem' };
    }
  };

  // Get user posts
  const getUserPosts = (userId) => {
    return posts.value.filter(post => post.authorId === userId);
  };

  // Get posts by category
  const getPostsByCategory = (category) => {
    return posts.value.filter(post => post.category === category && post.isPublished !== false);
  };

  // Get featured posts (posts with images, sorted by likes)
  const getFeaturedPosts = (limit = 5) => {
    return posts.value
      .filter(post => post.image && post.isPublished !== false)
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, limit);
  };

  // Get trending posts
  const getTrendingPosts = (limit = 8) => {
    return posts.value
      .filter(post => post.isPublished !== false)
      .map(post => {
        const likeScore = (post.likes || 0) * 2;
        const commentScore = (post.comments?.length || 0) * 3;
        const recencyScore = Math.max(0, 100 - (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...post,
          trendScore: likeScore + commentScore + recencyScore
        };
      })
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit);
  };

  // Get recent posts
  const getRecentPosts = (limit = 8) => {
    return posts.value
      .filter(post => post.isPublished !== false)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  // Search posts
  const searchPosts = (query) => {
    if (!query) return posts.value;
    
    const q = query.toLowerCase();
    return posts.value.filter(post => 
      post.title.toLowerCase().includes(q) || 
      post.content.toLowerCase().includes(q) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(q))) ||
      (post.author && post.author.toLowerCase().includes(q)) ||
      (post.category && post.category.toLowerCase().includes(q))
    );
  };

  // Helper function to save to localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('posts', JSON.stringify(posts.value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Initialize posts if empty
  const initializePosts = () => {
    if (posts.value.length === 0) {
      const samplePosts = [
        {
          id: 1,
          title: 'Chào mừng đến với BlogSpace!',
          content: 'Đây là bài viết đầu tiên trên BlogSpace. Hãy khám phá và tạo ra những nội dung tuyệt vời!',
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
          category: 'Giới thiệu',
          tags: ['welcome', 'blogging', 'community'],
          isPublished: true,
          author: 'Admin',
          authorId: 1,
          authorRole: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: null,
          likes: 15,
          likedBy: [],
          views: 120,
          comments: [
            {
              id: 101,
              content: 'Rất vui được tham gia cộng đồng!',
              author: 'Người dùng mới',
              authorId: 2,
              authorRole: 'user',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              likes: 3,
              likedBy: [],
              replies: []
            }
          ]
        },
        {
          id: 2,
          title: 'Hướng dẫn viết bài hiệu quả',
          content: 'Trong bài viết này, chúng ta sẽ cùng tìm hiểu cách viết bài chất lượng và thu hút người đọc.',
          image: 'https://images.unsplash.com/photo-1488229297570-58520851e868?w-800',
          category: 'Giáo dục',
          tags: ['writing', 'tips', 'tutorial'],
          isPublished: true,
          author: 'Admin',
          authorId: 1,
          authorRole: 'admin',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: null,
          likes: 28,
          likedBy: [],
          views: 250,
          comments: []
        }
      ];
      
      posts.value = samplePosts;
      saveToLocalStorage();
    }
  };

  // Call initialization
  initializePosts();

  return { 
    posts,
    totalComments,
    totalLikes,
    totalViews,
    totalAuthors,
    addPost,
    updatePost,
    deletePost,
    addComment,
    addReply,
    updateComment,
    deleteComment,
    toggleLike,
    toggleCommentLike,
    updatePostViews,
    getUserPosts,
    getPostsByCategory,
    getFeaturedPosts,
    getTrendingPosts,
    getRecentPosts,
    searchPosts
  };
});