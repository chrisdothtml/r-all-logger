import store from '../store.js'
import { promisify } from 'util'

const FIELDS = [
  'author',
  'created_utc',
  'id',
  'num_comments',
  'permalink',
  'preview',
  'score',
  'subreddit',
  'title',
  'url'
]

function parsePost (post) {
  const result = {}

  FIELDS.forEach(key => {
    const dbKey = 'post_' + key

    switch (key) {
      case 'preview':
        const preview = ((((post[key] || {}).images || [])[0] || {}).source || {}).url

        if (preview) result[dbKey] = preview
        break
      default:
        result[dbKey] = post[key]
    }
  })

  return result
}

async function savePosts (posts) {
  const { Post } = store.models

  return Promise.all(
    posts.map(async fields => {
      const findPosts = promisify(Post.find.bind(Post))
      const duplicates = await findPosts({ post_id: fields.post_id })

      if (!duplicates.length) {
        const post = new Post(fields)
        const save = promisify(post.save.bind(post))

        await save()
      }
    })
  )
}

export default async function fetchPosts () {
  const { reddit } = store
  const posts = JSON.parse(
    JSON.stringify(
      await reddit.getSubreddit('all').getHot()
    )
  )

  await savePosts(
    posts.map(parsePost)
  )
}
