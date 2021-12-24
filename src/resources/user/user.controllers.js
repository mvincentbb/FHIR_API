import otpGenerator from 'otp-generator'
import { User } from './user.model'
import { Role } from '../role/role.model'
import { Donation } from '../donation/donation.model'
import { Promise as Promesse } from '../promise/promise.model'
import Clicksend from '../../utils/clicksend'
import roles from '../../utils/role'
import { uuid } from 'uuidv4'

export const me = async (req, res) => {
  req.user.role = req.user.role.name
  delete req.user.verificationCode
  res.status(200).json({ data: req.user })
}

export const updateMe = async (req, res) => {
  try {
    delete req.body.role
    delete req.body.verificationCode
    delete req.body.telephone
    delete req.body.invitation
    delete req.body.createdBy
    delete req.body.promise
    delete req.body.password

    await User.updateOne({ _id: req.user._id }, req.body).exec()
    return res.status(200).json({ message: 'user update successfully' })
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const match = await user.checkPassword(req.body.password)
    if (match) {
      if (req.body.newPassword) {
        await User.updateOne(
          { _id: req.user._id },
          { password: req.body.newPassword }
        ).exec()
        return res.status(200).json({ message: 'user update successfully' })
      }
      return res.status(400).json({ message: 'new_password required' })
    }
    return res.status(400).json({ message: 'Mauvais mot de passe' })
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}

export const updatePhoneNumber = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const match = await user.checkPassword(req.body.password)
    if (match) {
      const tmp = await User.findOne({
        'telephone.value': req.body.telephone,
        'telephone.callingCode': req.body.callingCode
      })
      if (tmp)
        return res
          .status(400)
          .json({ message: 'Ce numero de telephone est deja utilisé' })

      const secret = otpGenerator.generate(4, {
        alphabets: false,
        specialChars: false
      })
      await Clicksend.sendSMS(
        req.body.callingCode + req.body.telephone,
        `Veuillez confirmez votre nouveau numero telephone avec le code suivant : ${secret}`
      )
      await User.updateOne(
        { _id: req.user._id },
        {
          'telephone.update': {
            code: secret,
            value: req.body.telephone,
            callingCode: req.body.callingCode
          }
        }
      ).exec()
      return res
        .status(200)
        .send({ message: 'Un code confirmation vous a ete envoyé' })
    }
    return res.status(400).json({ message: 'Mauvais mot de passe' })
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}

export const confirmPhoneUpdate = async (req, res) => {
  try {
    if (req.user.telephone.update) {
      if (req.user.telephone.update.code === req.body.code) {
        await User.updateOne(
          { _id: req.user._id },
          {
            'telephone.value': req.user.telephone.update.value,
            'telephone.callingCode': req.user.telephone.update.callingCode,
            'telephone.update': null
          }
        ).exec()
        return res
          .status(200)
          .send({ message: 'Numéro de téléphone modifié avec succès' })
      }
      return res.status(400).json({ message: 'Mauvais code de verification' })
    }
    return res.status(400).json({ message: 'Aucune confirmation en attente' })
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}

export const verifyAccount = async (req, res) => {
  const code = req.body.verificationCode

  if (code) {
    try {
      if (code === req.user.verificationCode.value) {
        await User.findByIdAndUpdate(req.user._id, {
          isActive: true,
          verificationCode: {
            verified: true
          }
        })
          .lean()
          .exec()
        res.status(200).send({ message: 'Account activated' })
      } else {
        return res.status(400).send({ message: 'Bad code' })
      }
    } catch (e) {
      console.error(e)
      res.status(500).send(e)
    }
  } else {
    return res.status(400).send({ message: 'need verification code' })
  }
}

export const resendCode = async (req, res) => {
  try {
    const verificationCode = otpGenerator.generate(6, {
      alphabets: false,
      specialChars: false,
      digits: true,
      upperCase: true
    })
    const msg = `Votre code de vérification est : ${verificationCode}`
    Clicksend.sendSMS(
      req.user.telephone.callingCode + req.user.telephone.value,
      msg
    )
      .then(async response => {
        await User.updateOne(
          { _id: req.user._id },
          {
            isActive: false,
            verificationCode: {
              verified: false,
              value: verificationCode
            }
          }
        ).exec()
        return res.status(200).send({ message: 'code sent' })
      })
      .catch(err => {
        console.log('ERROR:', err.body)
        return res.status(500).send({
          message: 'Error when sending verification code',
          error: err
        })
      })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

export const sendInvitation = async (req, res) => {
  try {
    let user = await User.findById(req.params['userId'])
    if (user.isActive)
      return res.status(400).send({ message: 'Utilisateur deja activé' })

    const now = new Date()
    if (
      user.invitation &&
      user.invitation.createdAt &&
      now - user.invitation.createdAt < 3600 * 1000 // 1H
    )
      return res.status(400).send({
        message: "01 Heure doit séparer les invitations d'un même utilisateur"
      })

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
      req,
      UUID,
      secret,
      async (err, response) => {
        if (err) {
          console.log('ERROR:', err)
          return res.status(500).send({
            message: 'Error when sending invitation',
            error: err
          })
        } else {
          user = await User.updateOne(
            { _id: user._id },
            { invitation: data },
            { new: true }
          )
          return res
            .status(201)
            .send({ message: 'Invitation envoyée avec succès' })
        }
      }
    )
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

export const create = async (req, res) => {
  const role = await Role.findOne({ name: req.body.role })
  if (!role) {
    return res.status(400).send({ message: 'unknown role' })
  }
  if (
    req.user.role.name === roles.donor ||
    (req.user.role.name === roles.receptor && req.body.role !== roles.donor)
  ) {
    return res
      .status(401)
      .send('You are not authorized to create this type of account')
  }
  if (!req.body.telephone || !req.body.firstName || !req.body.lastName) {
    return res
      .status(400)
      .send({ message: 'need telephone, firstName and lastName' })
  }

  try {
    const data = {
      ...req.body,
      role: role._id,
      isActive: false,
      isArchived: false,
      createdBy: req.user._id
    }
    let user = await User.create(data)
    console.log(user)

    if (req.body.sendInvitation === true && user) {
      const UUID = uuid()
      const now = new Date()
      const end = new Date(now)
      end.setDate(end.getDate() + 1)
      const secret = otpGenerator.generate(4, {
        alphabets: false,
        specialChars: false
      })
      data['invitation'] = {
        token: UUID,
        createdAt: now,
        expireAt: end,
        secret
      }
      await Clicksend.inviteUser(
        req.body.telephone.callingCode + req.body.telephone.value,
        req,
        UUID,
        secret,
        async (err, response) => {
          if (err) {
            console.log('ERROR:', err)
            return res.status(500).send({
              message: 'Error when sending invitation',
              error: err
            })
          } else {
            user = await User.updateOne(
              { _id: user._id },
              { invitation: data.invitation },
              { new: true }
            )
            return res.status(201).send(user)
          }
        }
      )
    } else {
      return res.status(201).send(user)
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send(e)
  }
}

export const getReceptors = async (req, res) => {
  if (req.user.role.name !== 'admin') {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    const role = await Role.findOne({ name: 'receptor' })
    const receptors = await User.find({ role: role._id })
      .select('-password -role -verificationCode')
      .sort(req.query.sortBy ? req.query.sortBy : '')

    return res.status(200).send(receptors)
  } catch (e) {
    console.log(e)
    return res.status(500).end()
  }
}

export const archiveOne = async (req, res) => {
  const userToArchive = await User.findOne({ _id: req.params.userId })
  if (!userToArchive)
    return res
      .status(400)
      .send({ message: 'The user you would like to archive does not exist.' })

  const role = await Role.findOne({ _id: userToArchive.role })

  if (req.user.role.name !== roles.admin || role.name === roles.admin) {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    console.log('userToArchive')
    await User.findOneAndUpdate(
      { _id: userToArchive._id },
      { isArchived: true }
    )

    return res.status(200).send({ message: 'User archived successfully' })
  } catch (e) {
    console.log(e)
    return res.status(500).end()
  }
}

export const restoreOne = async (req, res) => {
  const userToArchive = await User.findOne({ _id: req.params.userId })
  if (!userToArchive)
    return res
      .status(400)
      .send({ message: 'The user you would like to restore does not exist.' })

  const role = await Role.findOne({ _id: userToArchive.role })

  if (req.user.role.name === roles.receptor && role.name !== roles.donor) {
    return res.status(401).send({ message: 'You are not authorized' })
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userToArchive._id },
      { isArchived: false },
      { new: true }
    )
      .lean()
      .exec()

    return res
      .status(200)
      .send({ message: 'User restored successfully', data: user })
  } catch (e) {
    console.log(e)
    return res.status(500).end()
  }
}

export const myPromise = async (req, res) => {
  const promise = await Promesse.findOne({ donor: req.user._id })
  return res.status(200).json(promise)
}

export const myDonations = async (req, res) => {
  const donations = await Donation.find({ donor: req.user._id })
  return res.status(200).json(donations)
}

export const donations = async (req, res) => {
  const donations = await Donation.find({ donor: req.params.userId })
  return res.status(200).json(donations)
}
