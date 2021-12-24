import config from '../config'
import { User } from '../resources/user/user.model'
import { Role } from '../resources/role/role.model'
import { Promise as Promesse } from '../resources/promise/promise.model'
import jwt from 'jsonwebtoken'
import Clicksend from './clicksend'
import otpGenerator from 'otp-generator'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  const r = await Role.findOne({ name: 'donor' })

  if (!req.body.telephone || !req.body.password)
    return res.status(400).send({ message: 'need telephone and password' })

  const user = await User.findOne({
    'telephone.value': req.body.telephone.value,
    'telephone.callingCode': req.body.telephone.callingCode
  })

  if (user)
    return res.status(400).send({
      message: user.isActive
        ? 'A user with this telephone already exist.'
        : 'An account with this telephone already exist. Check your message inbox to activate it or contact the admin to resend you code'
    })

  try {
    const verificationCode = otpGenerator.generate(6, {
      alphabets: false,
      specialChars: false,
      digits: true,
      upperCase: true
    })
    const msg = `Votre code de vérification est : ${verificationCode}`
    Clicksend.sendSMS(
      req.body.telephone.callingCode + req.body.telephone.value,
      msg
    ) // '+61411111111'
      .then(async response => {
        console.log('SUCCESS:', response.body)
        const now = new Date()
        const end = new Date(now)
        end.setHours(end.getHours() + 1)
        const user = await User.create({
          ...req.body,
          role: r._id,
          verificationCode: {
            value: verificationCode,
            createdAt: now,
            expireAt: end
          },
          isActive: false
        })
        const token = newToken(user)
        return res.status(201).send({ token, token_type: 'Bearer' })
      })
      .catch(err => {
        console.log('ERROR:', err.body)
        return res.status(500).send({
          message: 'Error when sending verification code',
          error: err
        })
      })
  } catch (e) {
    console.log(e)
    return res.status(500).send(e)
  }
}

export const signin = async (req, res) => {
  if (!req.body.telephone || !req.body.password) {
    return res
      .status(400)
      .send({ message: "téléphone et d'un mot de passe réquis" })
  }

  const invalid = { message: ' téléphone ou mot de passe incorrect' }

  try {
    const user = await User.findOne({
      'telephone.value': req.body.telephone.value,
      'telephone.callingCode': req.body.telephone.callingCode,
      isActive: true
    })
      .select('telephone password')
      .exec()

    if (!user) {
      console.log('no user')
      return res.status(401).send(invalid)
    }

    const match = await user.checkPassword(req.body.password)

    if (!match) {
      console.log('incorrect password')
      return res.status(401).send(invalid)
    }

    const token = newToken(user)
    return res.status(200).send({ token, token_type: 'Bearer' })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Token error' })
  }

  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    console.log(e)
    return res.status(401).send({ message: 'Bad Token' })
  }

  const user = await User.findOne({ _id: payload.id })
    .select('-password')
    .lean()
    .exec()

  if (!user) return res.status(401).send({ message: 'User not found' })

  // if (user.isArchived) return res.status(401).send({ message: 'User archived' })

  user.role = await Role.findById(user.role).exec()
  user.promise = await Promesse.findOne({ donor: user._id }).exec()

  req.user = user
  next()
}

export const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return [
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role.name)) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      next()
    }
  ]
}

export const acceptInvitation = async (req, res) => {
  let user = await User.findOne({
    'invitation.token': req.params.token
  })
  if (!user) return res.status(400).send({ message: 'Invalid token' })

  if (user.isActive)
    return res.status(400).send({ message: 'Invitation already accepted' })

  if (!req.body.secret)
    return res.status(400).send({ message: 'Need secret code' })

  if (req.body.secret === user.invitation.secret) {
    user = await User.findOneAndUpdate(
      { _id: user._id },
      { isActive: true, invitation: { ...user.invitation, accepted: true } },
      { new: true }
    )
    const token = newToken(user)
    const data = { user: user, token: { token: token, token_type: 'Bearer' } }
    return res.status(200).send(data)
  }
  return res.status(400).send({ message: 'Bad invitation code' })
}
