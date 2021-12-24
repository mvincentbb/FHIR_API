const addFormats = require('ajv-formats')
const Ajv = require('ajv')

const ajv = new Ajv()
addFormats(ajv)

export const userSchemaValidator = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'telephone', 'password', 'role'],
  properties: {
    firstName: {
      type: 'string'
    },

    lastName: {
      type: 'string'
    },

    email: {
      type: 'string'
    },

    telephone: {
      type: 'string'
    },

    password: {
      type: 'string'
    },

    defaultPassword: {
      type: 'string'
    },

    isActive: {
      type: 'boolean'
    },

    role: {
      type: 'string'
    },

    SMSVerificationCode: {
      type: 'object',
      required: ['value'],
      value: {
        type: 'string'
      },

      date: {
        type: 'string',
        format: 'date-time'
      },

      isVerified: {
        type: 'boolean'
      }
    },

    createdBy: {
      type: 'string'
    }
  }
}

const validate = ajv.compile(userSchemaValidator)

export const valid = async (req, res, next) => {
  const validSchema = validate(req.body)
  if (!validSchema) {
    console.log(validate.errors)
    res.status(400).end()
  } else {
    res.status(200)
    next()
  }
}
