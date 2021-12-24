const addFormats = require('ajv-formats')
const Ajv = require('ajv')

const ajv = new Ajv()
addFormats(ajv)

const donationSchemaValidator = {
  type: 'object',
  required: ['transactionMethod', 'amount'],
  properties: {
    transactionMethod: {
      type: 'string',
      enum: [
        'flooz',
        'tmoney',
        'visa',
        'master',
        'paypal',
        'cagnote',
        'espece',
        'western',
        'ria',
        'wari',
        'moneyGram',
        'autre'
      ]
    },
    amount: { type: 'number' },
    account_number: {
      type: 'string'
    },
    date: { type: 'string', format: 'date-time' },
    createdBy: { type: 'string' }
  }
}

const validate = ajv.compile(donationSchemaValidator)

export const validDonation = async (req, res, next) => {
  const validSchema = validate(req.body)
  if (!validSchema) {
    console.log(validate.errors)
    res.status(400).end()
  } else {
    res.status(200)
    next()
  }
}
