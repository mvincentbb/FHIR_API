import mongoose from 'mongoose'
import mongooseDelete from 'mongoose-delete'

const DonationSchema = new mongoose.Schema(
  {
    transactionMethod: {
      type: String,
      // enum: [
      //   'flooz',
      //   'tmoney',
      //   'visa',
      //   'masterCard',
      //   'paypal',
      //   'cagnote',
      //   'espece',
      //   'western',
      //   'ria',
      //   'wari',
      //   'moneyGram',
      //   'autre'
      // ],
      required: true
    },

    donor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ['IN_PROGRESS', 'CANCELED', 'APPROVED', 'RECEIVED'],
      default: 'IN_PROGRESS'
    },

    accountNumber: {
      type: String,
      required: false
    },

    date: Date,

    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
    payment: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'payment',
      required: false
    }
  },
  { timestamps: true }
)

DonationSchema.plugin(mongooseDelete)

export const Donation = mongoose.model('donation', DonationSchema)
