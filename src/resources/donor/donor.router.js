import { Router } from 'express'
import controller from './donor.controllers'
import { authorize } from '../../utils/auth'
import roles from '../../utils/role'

const router = Router()

router
  .route('/')
  .get(authorize([roles.admin, roles.receptor]), controller.getMany)

router
  .route('/:id')
  .get(authorize([roles.admin, roles.receptor]), controller.getOne)
  .put(authorize([roles.admin, roles.receptor]), controller.updateOne)

router
  .route('/:id/promote')
  .post(authorize([roles.admin]), controller.promoteOne)

export default router
