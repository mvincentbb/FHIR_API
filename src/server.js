import { json, urlencoded } from 'body-parser'
import mongoSanitize from 'express-mongo-sanitize'
import swaggerUI from 'swagger-ui-express'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import config from './config'
import { connect } from './utils/db'
import { signup, signin, protect, acceptInvitation } from './utils/auth'
import userRouter from './resources/user/user.router'
import DonationRouter from './resources/donation/donation.router'
import DonorRouter from './resources/donor/donor.router'
import ReceptorRouter from './resources/receptor/receptor.router'
import PromiseRouter from './resources/promise/promise.router'
import ReportingRouter from './resources/reporting/reporting.router'
import PaymentRouter from './resources/payment/payment.router'

import PatientRouter from './resources/Patient/patient.router'

import docs from './docs'
import countries from './countries'

export const app = express()
dotenv.config()

app.use(express.static('public'))

app.use(helmet())

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

app.use(mongoSanitize())
app.use(morgan('dev'))

app.get('/countries', async (req, res) => {
  res.status(200).send(countries)
})

app.post('/signup', signup)
app.post('/signin', signin)
app.post('/accept-invitation/:token', acceptInvitation)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs))

app.use('/api/payment', PaymentRouter)
app.use('/api', protect)
app.use('/api/user', userRouter)
app.use('/api/donation', DonationRouter)
app.use('/api/donor', DonorRouter)
app.use('/api/receptor', ReceptorRouter)
app.use('/api/promise', PromiseRouter)
app.use('/api/reporting', ReportingRouter)

app.use('/api/patient', PatientRouter)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, async () =>
      console.log(
        `REST API on http://localhost:${config.port}/api`,
        config.dbUrl
      )
    )
  } catch (e) {
    console.error(e)
  }
}
