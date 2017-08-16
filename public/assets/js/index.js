{
  const doc = window.document
  const BODY = doc.body
  const TOPS = doc.getElementById('tops')
  const SR_CHART = doc.querySelector('#sr-chart canvas')
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

  function getCounts (posts, field) {
    const counts = {}

    posts.forEach(post => {
      const value = post[field]

      if (counts[value]) {
        counts[value]++
      } else {
        counts[value] = 1
      }
    })

    return keys(counts)
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

  function getTopsHTML (posts) {
    const fields = {
      post_author: {
        counts: getCounts(posts, 'post_author'),
        title: 'Top 10 Authors'
      },
      post_subreddit: {
        counts: getCounts(posts, 'post_subreddit'),
        title: 'Top 10 Subreddits'
      }
    }
    let result = ''

    // generate html
    keys(fields).forEach(key => {
      const { counts, title } = fields[key]
      let listItems = counts
        .slice(0, 10)
        .map(({ count, name }) => {
          name = key === 'post_subreddit' ? `/r/${name}` : name
          return `<li class="list-item">${name} (${count})</li>`
        })
        .join('\n')

      result += `
        <div class="card card_half">
          <h2 class="card-heading">${title}</h2>
          <ul class="card-list">
            ${listItems}
          </ul>
        </div>
      `
    })

    return result
  }

  function initSRChart (el, posts) {
    const counts = getCounts(posts, 'post_subreddit')
    const ctx = el.getContext('2d')
    const labels = counts.map(item => `/r/${item.name}`)
    const points = counts.map(item => item.count)

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          backgroundColor: '#3498db',
          borderColor: '#3498db',
          data: points,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Post Count'
            }
          }]
        }
      }
    })
  }

  async function init () {
    const posts = await getPosts()

    BODY.classList.remove('loading')
    EXPORT_BTN.addEventListener('click', exportPosts(posts))
    TOPS.innerHTML = `
      <div class="contain">
        ${getTopsHTML(posts)}
      </div>
    `
    initSRChart(SR_CHART, posts)
  }

  init().catch(console.error)
}
