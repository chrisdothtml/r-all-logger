{
  const doc = window.document
  const BODY = doc.body
  const ELEM = doc.getElementById('content')
  const { keys } = Object

  async function getPosts () {
    const response = await fetch('/api/posts', {
      credentials: 'same-origin'
    })

    return response.json()
  }

  function getListsHTML (posts) {
    const fields = {
      post_author: {
        counts: {},
        title: 'Top 20 Authors'
      },
      post_subreddit: {
        counts: {},
        title: 'Top 20 Subreddits'
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
          if (a.count > b.count)
            return -1
          if (a.count === b.count)
            return a.name > b.name ? 1 : -1
          if (a.count < b.count)
            return 1
        })
        .slice(0, 20)
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
    ELEM.innerHTML = `
      <div class="contain">
        ${getListsHTML(posts)}
      </div>
    `
  }

  init().catch(console.error)
}
