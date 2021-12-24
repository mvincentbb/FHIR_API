import { Role } from '../role/role.model'
import { crudControllers } from '../../utils/crud'
import { User } from '../user/user.model'

const getReceptors = async (req, res) => {
  if (req.user.role.name !== 'admin') {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    const role = await Role.findOne({ name: 'receptor' })
    const receptors = await User.find({ role: role._id })
      .sort(req.query.sortBy ? req.query.sortBy : '')
      .select('-password -role -SMSVerificationCode -verificationCode')
    return res.status(200).send(receptors)
  } catch (e) {
    console.log(e)
    return res.status(500).end()
  }
}

const updateReceptor = async (req, res) => {
  if (req.user.role.name !== 'admin') {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    const role = await Role.findOne({ name: 'receptor' })
    const updatedDoc = await User.findOneAndUpdate(
      {
        // createdBy: req.user._id,
        _id: req.params.id,
        role: role._id
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

const removeReceptor = async (req, res) => {
  if (req.user.role.name !== 'admin') {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    const role = await Role.findOne({ name: 'receptor' })
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

const getOneReceptor = async (req, res) => {
  if (req.user.role.name !== 'admin') {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    const role = await Role.findOne({ name: 'receptor' })
    const receptor = await User.findOne({
      _id: req.params.id,
      role: role._id
    }).select('-password -role -verificationCode')
    return res.status(200).send(receptor)
  } catch (e) {
    console.log(e)
    return res.status(500).end()
  }
}

export default {
  ...crudControllers(User),
  updateOne: updateReceptor,
  removeOne: removeReceptor,
  getMany: getReceptors,
  getOne: getOneReceptor
}
