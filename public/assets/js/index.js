{
  const doc = window.document
  const BODY = doc.body
  const ELEM = doc.getElementById('content')
  const { keys } = Object

  async function getPosts () {
    const response = await fetch('/api/posts')
    return response.json()
  }

  function getListsHTML (posts) {
    const fields = {
      post_author: {
        counts: {},
        title: 'Authors'
      },
      post_subreddit: {
        counts: {},
        title: 'Subreddits'
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
      let html = keys(counts)
        .map(key => ({ name: key, count: counts[key] }))
        .sort((a, b) => {
          if (a.count > b.count)
            return -1
          if (a.count === b.count)
            return a.name > b.name ? 1 : -1
          if (a.count < b.count)
            return 1
        })
        .map(({ count, name }) => `<li>${name} (${count} posts)</li>`)
        .join('\n')

      result += `
        <h2>${title}</h2>
        <ul>
          ${html}
        </ul>
      `
    })

    return result
  }

  async function init () {
    const posts = await getPosts()
    const listsHTML = getListsHTML(posts)

    BODY.classList.remove('loading')
    ELEM.innerHTML = `
      <span>There are ${posts.length} posts in the db</span>
      ${listsHTML}
    `
  }

  init().catch(console.error)
}
