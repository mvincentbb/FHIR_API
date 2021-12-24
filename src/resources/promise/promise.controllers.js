import { crudControllers } from '../../utils/crud'
import { Promise } from './promise.model'
import roles from '../../utils/role'

const getAllPromise = async (req, res) => {
  try {
    const docs = await Promise.find()
      .lean()
      .exec()

    // console.log(docs)

    res.status(200).json(docs)
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

const sumAllPromise = async (req, res) => {
  try {
    const sum = await Promise.aggregate([
      { $group: { _id: '', amount: { $sum: '$amount' } } },
      { $project: { total: '$amount', _id: 0 } }
    ])
    res.status(200).json(sum[0] ? sum[0] : { total: 0 })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

const createPromise = async (req, res) => {
  const createdBy = req.user._id

  try {
    const donor =
      req.user.role.name === roles.donor ? req.user._id : req.body.donor
    let promise = await Promise.findOne({ donor: donor })

    if (promise) {
      promise = await Promise.updateOne(
        { donor: donor },
        { amount: req.body.amount }
      )
      res.status(200).json({ data: promise })
    } else {
      const promise = await Promise.create({
        ...req.body,
        donor,
        createdBy,
        date: Date.now()
      })
      res.status(201).json({ data: promise })
    }
  } catch (e) {
    console.error(e)
    res.status(400).end(e)
  }
}

const updatePromise = async (req, res) => {
  try {
    const updatedDoc = await Promise.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id
      },
      req.body,
      { new: true }
    )
      .lean()
      .exec()

    if (!updatedDoc) {
      return res.status(400).send({ message: 'Not found' })
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

const removePromise = async (req, res) => {
  try {
    const removed = await Promise.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id
    })

    if (!removed) {
      return res.status(400).send({ message: 'Promise not exist' })
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

const getOnePromise = async (req, res) => {
  console.log(
    req.app.path() +
      (req.route.path || (req.route.regexp && req.route.regexp.source))
  )
  console.log(req)
  try {
    const promise = await Promise.findOne({ _id: req.params.id })
      .lean()
      .exec()

    if (!promise) {
      return res.status(404).send({ message: 'Not found' })
    }

    res.status(200).json(promise)
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

export default {
  ...crudControllers(Promise),
  getMany: getAllPromise,
  sumAll: sumAllPromise,
  createOne: createPromise,
  updateOne: updatePromise,
  removeOne: removePromise,
  getOne: getOnePromise
}
