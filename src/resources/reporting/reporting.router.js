import { Router } from 'express'
import controllers from './reporting.controllers'
import { authorize } from '../../utils/auth'
import roles from '../../utils/role'

const router = Router()

router.route('/').get(authorize([roles.admin]), controllers.getMany)
// .post(authorize(), controllers.createOne)

/* router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
// .delete(controllers.removeOne) */

export default router
