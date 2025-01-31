import { Hono } from 'hono'
import onBoardUserApp from './onBoardUser'
import testApp from './controlller/testapis'
import { applicationTrackerRouteApp } from './applicationTrackerRoute'

const userRouter = new Hono()

userRouter.route('/onboard', onBoardUserApp)    
userRouter.route('/test', testApp)
userRouter.route('/application', applicationTrackerRouteApp)
userRouter.get('/', async (c) => {
    return c.text(' welcome to the user router')
})

export default userRouter