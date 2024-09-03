import { Router } from 'express'

import { sendController } from '../controllers'
import { checkToken } from '../middleware'

export const sendRouter = Router()

sendRouter.post('/send', checkToken, sendController.send)
