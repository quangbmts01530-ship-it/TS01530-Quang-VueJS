export function useComments() {
  const getComments = (blogId) => {
    const all = JSON.parse(localStorage.getItem('comments') || '[]')
    return all.filter(c => c.blogId == blogId)
  }

  const addComment = (blogId, content, user) => {
    const all = JSON.parse(localStorage.getItem('comments') || '[]')
    all.push({
      id: Date.now(),
      blogId,
      content,
      user
    })
    localStorage.setItem('comments', JSON.stringify(all))
  }

  return { getComments, addComment }
}
