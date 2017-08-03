const FIELDS = ['author', 'created_utc', 'id', 'num_comments', 'permalink', 'preview', 'score', 'subreddit', 'title', 'url']

export function parse (post) {
  const result = {}

  FIELDS.forEach(key => {
    switch (key) {
      case 'preview':
        const preview = (((post[key].images || [])[0] || {}).source || {}).url

        if (preview) {
          result[key] = preview
        }

        break
      default:
        result[key] = post[key]
    }
  })

  return result
}
