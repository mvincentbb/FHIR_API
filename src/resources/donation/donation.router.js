import { Router } from 'express'
import controllers from './donation.controllers'
import { authorize } from '../../utils/auth'
import roles from '../../utils/role'

const router = Router()

router
  .route('/')
  .get(
    authorize([roles.admin, roles.receptor, roles.donor]),
    controllers.getMany
  )
  .post(
    authorize([roles.admin, roles.receptor, roles.donor]),
    controllers.createOne
  )

router.route('/total').get(controllers.sumAll)
router.route('/in_review').get(controllers.getInReview)

router
  .route('/:id')
  .get(authorize(), controllers.getOne)
  .put(authorize([roles.admin, roles.receptor]), controllers.updateOne)
  .delete(authorize([roles.admin, roles.receptor]), controllers.removeOne)

export default router
