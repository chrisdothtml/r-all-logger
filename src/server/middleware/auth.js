import auth from 'basic-auth'
import env from '../../env.js'

export default async function handleAuth (ctx, next) {
  const { AUTH_USER, AUTH_PASS } = env.get()
  let isAuthorized

  try {
    const user = auth(ctx)
    isAuthorized = user.name === AUTH_USER && user.pass === AUTH_PASS
  } catch (error) {
    isAuthorized = false
  }

  if (isAuthorized) {
    return next()
  } else {
    ctx.set('WWW-Authenticate', 'Basic')
    ctx.status = 401
  }
}
