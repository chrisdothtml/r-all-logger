const FIELDS = [
  '_id',
  'createdAt',
  'post_created_utc',
  'post_num_comments',
  'post_score',
  'post_subreddit'
]

function createAndDownload (filename, content) {
  const el = document.createElement('a')

  content = encodeURIComponent(content)
  el.setAttribute('href', `data:text/plain;charset=utf-8,${content}`)
  el.setAttribute('download', filename)
  el.click()
}

export default function exportPosts (posts) {
  const timestamp = new Date().getTime()
  let result = FIELDS.join(',')

  posts.forEach(post => {
    const values = []

    FIELDS.forEach(field => values.push(post[field]))
    result += '\n' + values.join(',')
  })

  createAndDownload(`posts-${timestamp}.csv`, result)
}
