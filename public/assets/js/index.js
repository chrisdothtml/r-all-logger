{
  const doc = window.document
  const BODY = doc.body
  const CONTENT = doc.getElementById('content')
  const EXPORT_BTN = doc.getElementById('export-btn')
  const CACHE_LIFETIME = (1000 * 60) * 30
  const CACHE_KEY = 'r-all-logger'
  const { keys } = Object
  const { fetch, localStorage } = window

  function cachePosts (posts) {
    if (posts) {
      const cache = JSON.stringify({
        data: posts,
        timestamp: Date.now()
      })

      localStorage.setItem(CACHE_KEY, cache)
    }
  }

  function getCachedPosts () {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
    const hasExpired = (Date.now() - cache.timestamp) >= CACHE_LIFETIME
    let result

    if (cache.data && !hasExpired) {
      result = cache.data
    }

    return result
  }

  async function getPosts () {
    const cachedPosts = getCachedPosts()
    let result

    if (cachedPosts) {
      result = cachedPosts
    } else {
      const response = await fetch('/api/posts', {
        credentials: 'same-origin'
      })

      result = await response.json()
      setTimeout(() => {
        cachePosts(result)
      }, 0)
    }

    return result
  }

  function createAndDownload (filename, content) {
    var el = document.createElement('a')

    el.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`)
    el.setAttribute('download', filename)
    el.click()
  }

  function exportPosts (posts) {
    return () => {
      const fields = ['_id', 'createdAt', 'post_created_utc', 'post_num_comments', 'post_score', 'post_subreddit']
      let result = fields.join(',')

      posts.forEach(post => {
        const values = []

        fields.forEach(field => values.push(post[field]))
        result += '\n' + values.join(',')
      })

      createAndDownload(`posts-${new Date().getTime()}.csv`, result)
    }
  }

  function getListsHTML (posts) {
    const fields = {
      post_author: {
        counts: {},
        title: 'Top 10 Authors'
      },
      post_subreddit: {
        counts: {},
        title: 'Top 10 Subreddits'
      }
    }
    let result = ''

    // calculate counts
    posts.forEach(post => {
      keys(fields).forEach(key => {
        const value = key === 'post_subreddit' ? `/r/${post[key]}` : post[key]

        if (fields[key].counts[value]) {
          fields[key].counts[value]++
        } else {
          fields[key].counts[value] = 1
        }
      })
    })

    // generate html
    keys(fields).forEach(key => {
      const { counts, title } = fields[key]
      let listItems = keys(counts)
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
        .slice(0, 10)
        .map(({ count, name }) => `<li class="list-item">${name} (${count})</li>`)
        .join('\n')

      result += `
        <div class="card">
          <h2 class="card-heading">${title}</h2>
          <ul class="card-list">
            ${listItems}
          </ul>
        </div>
      `
    })

    return result
  }

  async function init () {
    const posts = await getPosts()

    BODY.classList.remove('loading')
    EXPORT_BTN.addEventListener('click', exportPosts(posts))
    CONTENT.innerHTML = `
      <div class="contain">
        ${getListsHTML(posts)}
      </div>
    `
  }

  init().catch(console.error)
}
