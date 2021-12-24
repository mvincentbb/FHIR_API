import * as yup from 'yup'

export const PromiseSchema = yup.object().shape({
  donor: yup.String(),
  amount: yup.number().required(),
  date: yup.date().required(),
  donation: yup
    .array()
    .object()
    .shape({
      transactionMethod: yup
        .string()
        .mixed()
        .oneOf([
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
        ])
        .required(),

      amount: yup.number().required(),

      account_number: yup.String().required(),

      date: yup.date().required()
    })
})
