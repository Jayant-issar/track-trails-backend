import { Hono } from 'hono'
import { db } from './utils/prisma'
import userRouter from './user/userRouter'
import { cors } from 'hono/cors'

const app = new Hono()
app.use("*", cors({ origin: 'http://localhost:8080' }))

app.route('/user', userRouter)
app.get('/', async (c) => {
  const users = await db.user.findMany()

  return c.text(`you have ${users.length} users`)
})

export default app
