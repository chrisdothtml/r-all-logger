const WEEK_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

function createAndDownload (filename, content) {
  const el = document.createElement('a')

  content = encodeURIComponent(content)
  el.setAttribute('href', `data:text/plain;charset=utf-8,${content}`)
  el.setAttribute('download', filename)
  el.click()
}

// TODO: cleanup...
export default function exportPosts (posts) {
  const standardFields = ['post_num_comments', 'post_score', 'post_subreddit']
  const timestamp = new Date().getTime()
  let columns = ''

  posts = posts
    .map(post => {
      const createdDate = new Date(post.post_created_utc * 1000)
      const newPost = {
        post_day: WEEK_DAYS[createdDate.getDay()],
        post_hour: createdDate.getHours()
      }

      standardFields.forEach(field => (newPost[field] = post[field]))
      return newPost
    })
    .map(post => {
      const keys = Object.keys(post).sort()

      if (!columns) {
        // add column labels
        columns = keys.join(',') + '\n'
      }

      return keys
        .map(key => post[key])
        .join(',')
    })
    .join('\n')

  createAndDownload(`posts-${timestamp}.csv`, columns + posts)
}
