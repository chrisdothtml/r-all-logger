const FIELDS = ['author', 'created_utc', 'id', 'num_comments', 'permalink', 'preview', 'score', 'subreddit', 'title', 'url']

export function parsePost (post) {
  const result = {}

  FIELDS.forEach(key => {
    dbKey = 'post_' + key

    switch (key) {
      case 'preview':
        const preview = (((post[key].images || [])[0] || {}).source || {}).url

        if (preview) {
          result[dbKey] = preview
        }

        break
      default:
        result[dbKey] = post[key]
    }
  })

  return result
}
