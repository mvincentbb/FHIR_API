import { Router } from 'express'
import controllers from './patient.controllers'
// import { authorize } from '../../utils/auth'
// import roles from '../../utils/role'

const router = Router()

router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)

// router.route('/total').get(controllers.sumAll)

router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
