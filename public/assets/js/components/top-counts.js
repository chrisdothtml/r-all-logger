import { countPostsField, getPosts } from '../posts/index.js'
import { capitalize } from '../utils.js'

// data.title
// data.counts[].name
// data.counts[].count
function renderCounter (data) {
  let listItems = data.counts
    .map(({ count, name }) => {
      return `<li class="list-item">${name} (${count})</li>`
    })
    .join('\n')

  return `
    <div class="card card_half">
      <h2 class="card-heading">${data.title}</h2>
      <ul class="card-list">
        ${listItems}
      </ul>
    </div>
  `
}

function renderCounters (posts) {
  const fields = ['post_author', 'post_subreddit']
  let countsHTML = ''

  fields.forEach(field => {
    const title = `Top 10 ${capitalize(field.replace('post_', ''))}s`
    const counts = countPostsField(posts, field).slice(0, 10)

    countsHTML += renderCounter({ counts, title })
  })

  return `
    <div class="contain">
      ${countsHTML}
    </div>
  `
}

async function init (element) {
  const posts = await getPosts()

  element.innerHTML = renderCounters(posts)
}

export {
  init
}
