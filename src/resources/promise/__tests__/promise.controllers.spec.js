import { promiseControllers } from '../promise.controllers'
import { isFunction } from 'lodash'

describe('promise controllers', () => {
  test('has crud controllers', () => {
    const crudMethods = [
      'createDonation',
      'createDonationFromAdmin',
      'getOnePromise',
      'getAllPromise',
      'createPromise',
      'updatePromise',
      'removePromise'
    ]

    crudMethods.forEach(name => {
      console.log(typeof promiseControllers[name])
      expect(isFunction(promiseControllers[name])).toBe(true)
    })
  })
})
