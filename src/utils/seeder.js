import { connect } from './db'
import { Role } from '../resources/role/role.model'
import { User } from '../resources/user/user.model'
import { Promise } from '../resources/promise/promise.model'

let DONOR_ROLE = null

const seed = async () => {
  try {
    await connect()
    // await Role.deleteMany({})
    const roleNames = ['donor', 'receptor', 'admin']
    for (const name of roleNames) {
      const oldRole = await Role.findOneAndDelete({ name: name })
      let users = []
      if (oldRole)
        users = await User.find({ role: oldRole._id }).select('_id role')
      console.log(name, users)
      const newRole = await Role.create({ name: name })
      for (const user of users) {
        await User.updateOne({ _id: user._id }, { $set: { role: newRole._id } })
      }

      if (name === 'donor') DONOR_ROLE = newRole
    }

    // create the anonymous user
    const anonymous = await User.create({
      firstName: 'anonymous',
      lastName: 'anonymous',
      telephone: {
        callingCode: '228',
        value: '55555555555',
        isVerified: true
      },
      password: 'secret@anonymous',
      isActive: true,
      role: DONOR_ROLE ? DONOR_ROLE._id : null
    })
    const promise = await Promise.create({
      amount: 0,
      donor: anonymous._id,
      createdBy: anonymous._id
    })
    await anonymous.update({ promise: promise._id })
  } catch (e) {
    console.error(e)
  }
}
seed()
  .then(() => process.exit(0))
  .catch(() => {})
