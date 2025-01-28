import { Hono } from 'hono'
import onBoardUserApp from './onBoardUser'

const userRouter = new Hono()

userRouter.route('/onboard', onBoardUserApp)    
userRouter.get('/', async (c) => {
    return c.text(' welcome to the user router')
})

export default userRouter