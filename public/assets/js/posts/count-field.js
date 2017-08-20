import store from '../store.js'

const cache = store.fieldCounts

export default function countPostsField (posts, field) {
  let result

  if (cache[field]) {
    result = cache[field]
  } else {
    const counts = {}

    posts.forEach(post => {
      let key = post[field]

      if (field === 'post_subreddit') {
        key = `/r/${key}`
      }

      if (counts[key]) {
        counts[key]++
      } else {
        counts[key] = 1
      }
    })

    result = cache[field] = Object.keys(counts)
      .map(key => ({ name: key, count: counts[key] }))
      .sort((a, b) => {
        /* eslint-disable curly */
        if (a.count > b.count)
          return -1
        if (a.count === b.count)
          return a.name > b.name ? 1 : -1
        if (a.count < b.count)
          return 1
        /* eslint-enable curly */
      })
  }

  return result
}
