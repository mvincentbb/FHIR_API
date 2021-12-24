import { Router } from 'express'
import controller from './receptor.controllers'
import { authorize } from '../../utils/auth'
import roles from '../../utils/role'

const router = Router()

router.route('/').get(authorize([roles.admin]), controller.getMany)

router
  .route('/:id')
  .get(authorize([roles.admin]), controller.getOne)
  .put(authorize([roles.admin]), controller.updateOne)

export default router
