module.exports = {
  // method of operation
  post: {
    tags: ['payment operations'],
    description: 'make Payment',
    operationId: 'makePayment', // unique operation id.
    parameters: [], // expected params.
    requestBody: {
      // expected request body
      content: {
        // content-type
        'application/json': {
          schema: {
            $ref: '#/components/schemas/PaymentInput' // todo input data model
          }
        }
      }
    },
    // expected responses
    responses: {
      // response code
      200: {
        description: 'Payment created successfully', // response desc.
        content: {
          // content-type
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Payment' // Todo model
            }
          }
        }
      },
      500: {
        description: 'Server error' // response desc
      }
    }
  }
}
