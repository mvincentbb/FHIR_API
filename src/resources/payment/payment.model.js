import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    token: {
      type: String
    },
    transaction_id: {
      type: String
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export const Payment = mongoose.model('payment', PaymentSchema)
