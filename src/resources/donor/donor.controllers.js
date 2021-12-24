import { Role } from '../role/role.model'
import roles from '../../utils/role'
import { crudControllers } from '../../utils/crud'
import { User } from '../user/user.model'

const getDonors = async (req, res) => {
  console.log(req.query)
  if (req.user.role.name !== 'receptor' && req.user.role.name !== 'admin') {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    const role = await Role.findOne({ name: 'donor' })
    const donors = await User.find({ role: role._id })
      .sort(req.query.sortBy ? req.query.sortBy : '')
      .select('-password -role -SMSVerificationCode -verificationCode')
    return res.status(200).send(donors)
  } catch (e) {
    console.log(e)
    return res.status(500).end()
  }
}

const updateDonor = async (req, res) => {
  if (req.user.role.name !== 'receptor' && req.user.role.name !== 'admin') {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    delete req.body.isActive
    const role = await Role.findOne({ name: 'donor' })
    const updatedDoc = await User.findOneAndUpdate(
      req.user.role.name === 'admin'
        ? {
            _id: req.params.id,
            role: role._id,
            isActive: false
          }
        : {
            createdBy: req.user._id,
            _id: req.params.id,
            role: role._id,
            isActive: false
          },
      req.body,
      { new: true }
    )
      .lean()
      .exec()

    if (!updatedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

const removeDonor = async (req, res) => {
  if (req.user.role.name !== 'admin') {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    const role = await Role.findOne({ name: 'donor' })
    const removed = await User.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id,
      role: role._id
    })

    if (!removed) {
      return res.status(400).end()
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

const getOneDonor = async (req, res) => {
  if (req.user.role.name !== 'receptor' && req.user.role.name !== 'admin') {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    const donor = await User.findOne({
      _id: req.params.id
    }).select('-password -role -verificationCode')
    console.log(req.params)
    return res.status(200).send(donor)
  } catch (e) {
    console.log(e)
    return res.status(500).end()
  }
}

const promoteDonor = async (req, res) => {
  const DonorRole = await Role.findOne({ name: roles.donor })
  const ReceptorRole = await Role.findOne({ name: roles.receptor })

  const userToPromote = await User.findOne({
    _id: req.params.id,
    role: DonorRole._id
  })

  if (!userToPromote)
    res
      .status(400)
      .send({ message: 'The donor you would like to Promote does not exist.' })

  try {
    await User.updateOne({ _id: userToPromote._id }, { role: ReceptorRole._id })
    return res
      .status(200)
      .send({ message: 'Donor promoted to Receptor successfully' })
  } catch (e) {
    console.log(e)
    return res.status(500).send(e)
  }
}

export default {
  ...crudControllers(User),
  updateOne: updateDonor,
  removeOne: removeDonor,
  getMany: getDonors,
  getOne: getOneDonor,
  promoteOne: promoteDonor
}
