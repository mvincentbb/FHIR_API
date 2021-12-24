import mongoose from 'mongoose'
import https from 'https'
import { Donation } from '../donation/donation.model'
import { User } from '../user/user.model'
import { Payment } from './payment.model'
import { verifyToken } from '../../utils/auth'
import { config } from '../../config/dev'
import Clicksend from '../../utils/clicksend'

const options_ = (data, path) => {
  return {
    hostname: 'api-checkout.cinetpay.com',
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }
}

const initOne = async (req, res_) => {
  console.log(req.body)
  try {
    let user
    let isAnonymous = false
    const bearer = req.headers.authorization
    if (!bearer || !bearer.startsWith('Bearer ')) {
      isAnonymous = true
      user = await User.findOne({ _id: config.anonymous_id }) // anonymous user
    } else {
      const token = bearer.split('Bearer ')[1].trim()
      let payload
      payload = await verifyToken(token)
      user = await User.findOne({ _id: payload.id })
    }

    const payment = await Payment.create({ user: user._id })
    const data = new TextEncoder().encode(
      JSON.stringify({
        site_id: config.cinetpay_site_id,
        apikey: config.cinetpay_api_key,
        amount: req.body.amount,
        trans_date: Date.now(),
        transaction_id: payment._id,
        metadata: payment._id,
        customer_id: user._id,
        customer_surname: isAnonymous ? req.body.fullname : user.lastName,
        customer_name: isAnonymous ? req.body.fullname : user.firstName,
        customer_city: req.body.city,
        customer_phone_number: req.body.phone_number,
        customer_email: req.body.email,
        customer_address: req.body.address,
        customer_country: req.body.country,
        customer_zip_code: '228',
        notify_url: 'http://waast.org:7898/api/payment/notify',
        return_url: 'http://waast.org:8000',
        channels: req.body.channels,
        lang: 'fr',
        currency: 'XOF',
        description: 'Test'
      })
    )
    const options = options_(data, '/v2/payment')
    const request = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)

      res.on('data', async d => {
        try {
          d = JSON.parse(d.toString('utf-8'))
          console.log(d)
          if (res.statusCode === 200 && d.data && d.data.payment_token)
            await payment.update({ token: d.data.payment_token })
          else console.log('Error: No payment_token')

          res_.status(res.statusCode).send(d)
        } catch (e) {
          console.log(e)
          res_.status(500).send(e)
        }
      })
    })

    request.on('error', error => {
      console.error(error)
      res_.status(500).send(error)
    })
    request.write(data)
    request.end()
  } catch (e) {
    console.log(e)
    res_.status(500).send(e)
  }
}

const notify = async (req, res_) => {
  console.log(req.body)
  if (
    req.body['cpm_trans_id'] &&
    req.body['cpm_site_id'] &&
    req.body['cpm_site_id'] === config.cinetpay_site_id
  ) {
    const data = new TextEncoder().encode(
      JSON.stringify({
        site_id: config.cinetpay_site_id,
        apikey: config.cinetpay_api_key,
        transaction_id: req.body['cpm_trans_id']
      })
    )
    const options = options_(data, '/v2/payment/check')
    const request = https.request(options, async res => {
      const session = await mongoose.startSession()
      console.log(`statusCode: ${res.statusCode}`)
      res.on('data', async d => {
        d = JSON.parse(d.toString('utf-8'))
        console.log('check', d)
        const payment = await Payment.findOne({
          _id: d.data ? d.data.metadata : null
        })
        if (payment && !payment.status) {
          await payment
            .update({ transaction_id: req.body['cpm_trans_id'] })
            .session(session)
          if (d.code === '00') {
            try {
              console.log('SUCCESS')
              await session.startTransaction()
              await payment.update({ status: true }).session(session)
              const donor = payment.user
              const transactionMethod =
                d.data.payment_method === 'TMONEYTG'
                  ? 'tmoney'
                  : d.data.payment_method === 'FLOOZTG'
                  ? 'flooz'
                  : d.data.payment_method
              const amount = d.data.amount || 0
              const date = d.data.payment_date || new Date()
              const phoneNumber =
                req.body['cpm_phone_prefixe'] + req.body['cpm_phone_num']
              const phonePrefix = d.data.phone_prefix
              const accountNumber =
                phoneNumber && phonePrefix ? phonePrefix + phoneNumber : ''

              const donation = await Donation({
                donor,
                transactionMethod,
                amount,
                date,
                accountNumber,
                createdBy: donor,
                status: 'RECEIVED'
              }).save()
              await donation.update({ payment: payment._id })
              console.log(donation)
              await session.commitTransaction()
              session.endSession()
              // SEND SMS to notify donor
              const user = await User.findById(payment.user)
              const msg = `Votre donation de ${amount} XOF a ete effectue avec succès. Dieu vous benisse.`
              const mobileNumber =
                user.telephone.callingCode + user.telephone.value
              if (user)
                Clicksend.sendSMS(mobileNumber, msg)
                  .then(async response =>
                    console.log('SUCCESS:', response.body)
                  )
                  .catch(err => console.log('ERROR:', err.body))
              // SEND SMS to notify donor
            } catch (e) {
              console.log(e)
              await session.abortTransaction()
              session.endSession()
            }
          }
        } else console.log('Payment not found or already completed')
      })
    })

    request.on('error', error => {
      console.error(error)
    })
    request.write(data)
    request.end()
    console.log('request lancé')
    // res_.status(200).send({ message: 'Merci beaucoup' })
  }
}

const sync = async (req, res) => {
  const payments = await Payment.find({ status: false })
  payments.forEach(item =>
    notify({
      body: {
        cpm_trans_id: item._id,
        cpm_site_id: '106643'
      }
    })
  )
  res.status(200).send({ message: 'Payments in synchronizing' })
}

export default {
  initOne: initOne,
  notify: notify,
  sync: sync
}
