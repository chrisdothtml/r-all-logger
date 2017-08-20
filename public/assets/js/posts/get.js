const CACHE_LIFETIME = (1000 * 60) * 30
const CACHE_KEY = 'r-all-logger'
const { fetch, localStorage } = window

function setCache (posts) {
  if (posts) {
    const cache = JSON.stringify({
      data: posts,
      timestamp: Date.now()
    })

    localStorage.setItem(CACHE_KEY, cache)
  }
}

function getCache () {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  const hasExpired = (Date.now() - cache.timestamp) >= CACHE_LIFETIME
  let result

  if (cache.data && !hasExpired) {
    result = cache.data
  }

  return result
}

export default async function getPosts () {
  const cachedPosts = getCache()
  let result

  if (cachedPosts) {
    result = cachedPosts
  } else {
    const response = await fetch('/api/posts', {
      credentials: 'same-origin'
    })

    result = await response.json()
    setCache(result)
  }

  return result
}
