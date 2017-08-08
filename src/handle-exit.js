import mongoose from 'mongoose'

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0)
  })
})
