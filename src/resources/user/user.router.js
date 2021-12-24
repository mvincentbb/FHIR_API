import { Router } from 'express'
import {
  verifyAccount,
  resendCode,
  create,
  getReceptors,
  me,
  archiveOne,
  restoreOne,
  updateMe,
  updatePassword,
  updatePhoneNumber,
  confirmPhoneUpdate,
  sendInvitation,
  myPromise,
  myDonations,
  donations
} from './user.controllers'
import { authorize } from '../../utils/auth'
import roles from '../../utils/role'

const router = Router()

router
  .get('/', me)
  .get('/promise', myPromise)
  .get('/donations', myDonations)
  .get('/receptors', authorize([roles.admin]), getReceptors)
  .post('/verify', verifyAccount)
  .post('/resend-code', resendCode)
  .post('/', authorize([roles.admin, roles.receptor]), create)
  .get(
    '/:userId/donations',
    authorize([roles.admin, roles.receptor]),
    donations
  )
  .post(
    '/:userId/archive',
    authorize([roles.admin, roles.receptor]),
    archiveOne
  )
  .post(
    '/:userId/restore',
    authorize([roles.admin, roles.receptor]),
    restoreOne
  )
  .get(
    '/:userId/sendInvitation',
    authorize([roles.admin, roles.receptor]),
    sendInvitation
  )
  .put('/', updateMe)
  .put('/password', updatePassword)
  .put('/change-phone', updatePhoneNumber)
  .post('/confirm-change-phone', confirmPhoneUpdate)

export default router
