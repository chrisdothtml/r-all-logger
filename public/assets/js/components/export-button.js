import { exportPosts, getPosts } from '../posts/index.js'

async function init (element) {
  const posts = await getPosts()

  element.addEventListener('click', () => {
    exportPosts(posts)
  })
}

export {
  init
}
