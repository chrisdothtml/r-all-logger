import { Schema } from 'mongoose'

export default new Schema({
  post_author: String,
  post_created_utc: Number,
  post_id: String,
  post_num_comments: Number,
  post_permalink: String,
  post_preview: String,
  post_score: Number,
  post_subreddit: String,
  post_title: String,
  post_url: String
})
