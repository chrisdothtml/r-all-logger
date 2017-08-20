/* global Chart */

import { countPostsField, getPosts } from '../posts/index.js'

async function init (element) {
  const posts = await getPosts()
  const counts = countPostsField(posts, 'post_subreddit')
  const ctx = element.getContext('2d')
  const labels = counts.map(item => `/r/${item.name}`)
  const points = counts.map(item => item.count)

  new Chart(ctx, {// eslint-disable-line no-new
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        backgroundColor: '#3498db',
        borderColor: '#3498db',
        data: points,
        fill: false
      }]
    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        mode: 'index',
        intersect: false
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

export {
  init
}
