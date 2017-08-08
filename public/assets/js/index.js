const doc = window.document
const BODY = doc.body
const ELEM = doc.getElementById('content')

async function getPosts () {
  const response = await fetch('/api/posts')
  return response.json()
}

async function init () {
  const posts = await getPosts()

  BODY.classList.remove('loading')
  ELEM.innerHTML = `There are ${posts.length} posts in the db`
}

init().catch(console.error)
