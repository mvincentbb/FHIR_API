import makePayment from './make-payment'

module.exports = {
  paths: {
    '/payment': {
      ...makePayment
    }
  }
}
