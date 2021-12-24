import { Router } from 'express'
import controllers from './payment.controllers'

const router = Router()

router.route('/').post(controllers.initOne)

router.route('/notify').post(controllers.notify)

router.route('/sync').get(controllers.sync)

export default router
