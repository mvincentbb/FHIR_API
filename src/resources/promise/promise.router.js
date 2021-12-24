import { Router } from 'express'
import controllers from './promise.controllers'
import { authorize } from '../../utils/auth'
import roles from '../../utils/role'

const router = Router()

router
  .route('/')
  .get(authorize([roles.admin, roles.receptor]), controllers.getMany)
  .post(authorize(), controllers.createOne)

router.route('/total').get(controllers.sumAll)

router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
// .delete(controllers.removeOne)

export default router
