import { Promise } from '../promise/promise.model'

const getAllReporting = async (req, res) => {
  try {
    const promises = await Promise.find()
      .populate(
        'donor',
        '-password -verificationCode -updatedAt -createdBy -_id -invitation -role -createdAt'
      )
      .lean()
      .select('-createdBy -_id  -updatedAt')
      .sort(req.query.sortBy ? req.query.sortBy : '-createdAt')
      .exec()

    const bar = await Promise.aggregate([
      { $match: { amount: { $gt: 0 } } },
      { $project: { amount: 1, _id: 0 } },
      { $group: { _id: '$amount', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
    res.status(200).json({ promises, bar })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export default {
  getMany: getAllReporting
}
