import { Hono } from 'hono'
import onBoardUserApp from './onBoardUser'
import testApp from './controlller/testapis'

const userRouter = new Hono()

userRouter.route('/onboard', onBoardUserApp)    
userRouter.route('/test', testApp)
userRouter.get('/', async (c) => {
    return c.text(' welcome to the user router')
})

export default userRouter