import { crudControllers } from '../../utils/crud'
import { Donation } from './donation.model'
import roles from '../../utils/role'
import { User } from '../user/user.model'
import Clicksend from '../../utils/clicksend'

export const createOne = async (req, res) => {
  try {
    if (!req.body.donor || !req.body.amount || !req.body.transactionMethod)
      return res
        .status(400)
        .send({ message: 'Need donor, amount and transactionMethod' })

    const donor = await User.findOne({
      _id: req.user.role.name === roles.donor ? req.user._id : req.body.donor
    })

    if (!donor)
      return res.status(400).send({ message: 'No donor with this ID.' })

    const donation = await Donation.create({
      ...req.body,
      donor: donor._id,
      createdBy: req.user._id,
      status:
        req.user.role.name === roles.receptor
          ? 'IN_PROGRESS'
          : req.user.role.name === roles.admin
          ? 'APPROVED'
          : req.user.role.name === roles.donor
          ? 'RECEIVED'
          : ''
    })
    res.status(201).send(donation)
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const getOne = async (req, res) => {
  try {
    const donation = await Donation.findOne({ _id: req.params.id })
    if (!donation) return res.status(404).send({ message: 'Not found' })

    const flag =
      donation.createdBy === req.user._id ||
      donation.donor === req.user._id ||
      req.user.role.name === roles.admin

    if (!flag)
      return res.status(401).send({ message: 'You are not authorized' })

    return res.status(200).send(donation)
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const getMany = async (req, res) => {
  try {
    const donations = await Donation.find(
      req.user.role.name === roles.admin
        ? {}
        : { createdBy: req.user._id, donor: req.user._id }
    ).sort(req.query.sortBy ? req.query.sortBy : '')

    if (donations) return res.status(200).send(donations)
    return res.status(404).send()
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

const sumAll = async (req, res) => {
  try {
    const sum = await Donation.aggregate([
      req.user.role.name === roles.donor
        ? { $match: { donor: req.user._id } }
        : { $match: {} },
      { $group: { _id: '', amount: { $sum: '$amount' } } },
      { $project: { total: '$amount', _id: 0 } }
    ])
    console.log(sum)
    res.status(200).json(sum[0] ? sum[0] : { total: 0 })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getInReview = async (req, res) => {
  try {
    const donations = await Donation.find(
      req.user.role.name === roles.admin
        ? { status: { $nin: ['RECEIVED', 'APPROVED'] } }
        : {
            status: { $nin: ['RECEIVED', 'APPROVED'] },
            createdBy: req.user._id,
            donor: req.user._id
          }
    )
      .sort(req.query.sortBy ? req.query.sortBy : '')
      .limit(5)

    return res.status(200).send(donations)
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const updateOne = async (req, res) => {
  try {
    const donation = await Donation.findOneAndUpdate(
      req.user.role.name === roles.admin
        ? { _id: req.params.id }
        : {
            _id: req.params.id,
            createdBy: req.user._id,
            donor: req.user._id,
            status: { $nin: ['RECEIVED', 'APPROVED'] }
          },
      {
        transactionMethod: req.body.transactionMethod,
        accountNumber: req.body.accountNumber,
        amount: req.body.amount,
        date: req.body.date,
        status: req.body.status
      },
      { new: true, lean: true }
    )
    if (donation) {
      if (['RECEIVED', 'APPROVED'].includes(donation.status)) {
        // SEND SMS to notify donor
        const user = await User.findById(donation.donor)
        const msg = `Votre donation de ${donation.amount} XOF a ete effectue avec succès. Dieu vous benisse.`
        const mobileNumber = user.telephone.callingCode + user.telephone.value
        if (user)
          Clicksend.sendSMS(mobileNumber, msg)
            .then(async response => console.log('SUCCESS:', response.body))
            .catch(err => console.log('ERROR:', err.body))
        // SEND SMS to notify donor
      }
      return res.status(200).send(donation)
    }
    return res.status(404).send()
  } catch (e) {
    console.error(e)
    res.status(400).end(e.message)
  }
}

export const removeOne = async (req, res) => {
  try {
    const donation = await Donation.findOneAndRemove(
      req.user.role.name === roles.admin
        ? { _id: req.params.id }
        : {
            _id: req.params.id,
            createdBy: req.user._id,
            donor: req.user._id,
            status: { $nin: ['RECEIVED', 'APPROVED'] }
          }
    )
    if (donation) return res.status(200).send(donation)
    return res.status(404).send()
  } catch (e) {
    console.error(e)
    res.status(400).end(e.message)
  }
}

export default {
  ...crudControllers(Promise),
  getOne: getOne,
  getMany: getMany,
  sumAll: sumAll,
  getInReview: getInReview,
  createOne: createOne,
  updateOne: updateOne,
  removeOne: removeOne
}
