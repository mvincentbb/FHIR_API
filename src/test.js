import { User } from './resources/user/user.model'
import mongoose from 'mongoose'
import { uuid } from 'uuidv4'
import otpGenerator from 'otp-generator'
import Clicksend from './utils/clicksend'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const init = async () => {
  await mongoose.connect('mongodb://localhost:27017/vaillant-batisseur')
  const rows = await User.find({
    isActive: false,
    'invitation.token': null
  })
  for (let user of rows) {
    const now = new Date()
    const UUID = uuid()
    const end = new Date(now)
    end.setDate(end.getDate() + 1)
    const secret = otpGenerator.generate(4, {
      alphabets: false,
      specialChars: false
    })
    const data = {
      token: UUID,
      createdAt: now,
      expireAt: end,
      secret
    }
    await Clicksend.inviteUser(
      user.telephone.callingCode + user.telephone.value,
      { user, headers: { origin: 'http://waast.org:8000' } },
      UUID,
      secret,
      async (err, response) => {
        if (err) {
          console.log('ERROR:', err)
        } else {
          console.log(user.firstName, 'Received the invite')
          user = await User.updateOne(
            { _id: user._id },
            { invitation: data },
            { new: true }
          )
        }
      }
    )
    await sleep(2000)
  }
  console.log('END')
}

init()
