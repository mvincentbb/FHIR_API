module.exports = {
  components: {
    schemas: {
      // todo model
      Payment: {
        type: 'object', // data type
        properties: {
          _id: {
            type: 'string', // data-type
            description: 'Payment identification number', // desc
            example: '6164546610f3a040ac86b9f0' // example of an id
          },
          code: {
            type: 'string',
            description: 'request response status',
            example: '201'
          },
          message: {
            type: 'string',
            description: 'response message',
            example: 'CREATED'
          },
          description: {
            type: 'string',
            description: 'response message description',
            example: 'Transaction created with success'
          },
          data: {
            type: 'object',
            properties: {
              payment_token: {
                type: 'string',
                description: 'CINETPAY payment token',
                example:
                  'be4cf197e23f2c3b5b24599b929e63606634e814701cb9fe99ceaae24df7e98b46c7489efe4de79ddec9a3c69c163467fae1bfb922f872'
              },
              payment_url: {
                type: 'string',
                description: 'CINETPAY payment URL',
                example:
                  'https://checkout.cinetpay.com/payment/be4cf197e23f2c3b5b24599b929e63606634e814701cb9fe99ceaae24df7e98b46c7489efe4de79ddec9a3c69c163467fae1bfb922f872'
              }
            }
          },
          api_response_id: {
            type: 'string',
            description: 'ID of response',
            example: '1634608250.4694'
          }
        }
      },
      // Todo input model
      PaymentInput: {
        type: 'object',
        properties: {
          channels: {
            type: 'string',
            description: "Payment's channel: 'MOBILE_MONEY' or 'CREDIT_CARD'",
            example: 'MOBILE_MONEY'
          },
          amount: {
            type: 'double',
            description: "Payment's amount",
            example: '2000'
          },
          fullname: {
            type: 'string',
            description: "donor's fullname",
            example: 'Jhon Doe'
          },
          phone_number: {
            type: 'string',
            description: "donor's phone",
            example: '+22890909090'
          },
          email: {
            type: 'string',
            description: "donor's email (JUST FOR PAYMENTS BY CREDIT CARD)",
            example: 'donor@example.com'
          },
          address: {
            type: 'string',
            description: "donor's address (JUST FOR PAYMENTS BY CREDIT CARD)",
            example: 'Agbalépédogan'
          },
          city: {
            type: 'string',
            description:
              "donor's living city (JUST FOR PAYMENTS BY CREDIT CARD)",
            example: 'Lome'
          },
          country: {
            type: 'string',
            description:
              "donor's living country (JUST FOR PAYMENTS BY CREDIT CARD)",
            example: 'TG'
          },
          state: {
            type: 'string',
            description:
              "donor's state. Provide only if donor live in USA or Canada (JUST FOR PAYMENTS BY CREDIT CARD)",
            example: 'Florid'
          }
        }
      },
      // error model
      Error: {
        type: 'object', // data type
        properties: {
          message: {
            type: 'string', // data type
            description: 'Error message', // desc
            example: 'Not found' // example of an error message
          },
          internal_code: {
            type: 'string', // data type
            description: 'Error internal code', // desc
            example: 'Invalid parameters' // example of an error internal code
          }
        }
      }
    }
  }
}
