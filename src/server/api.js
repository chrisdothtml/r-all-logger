import postSchema from '../schemas/post.js'
import mongoose from 'mongoose'
import { promisify } from 'util'

const Post = mongoose.model('Post', postSchema)

export async function getPosts () {
  const get = promisify(Post.find.bind(Post))
  return get()
}
