import { Router } from 'express'

import { parserController } from '../controllers'
import { checkToken } from '../middleware'

export const parserRouter = Router()

parserRouter.post('/parser', checkToken, parserController.parser)
