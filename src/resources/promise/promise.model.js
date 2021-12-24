import mongoose from 'mongoose'

const PromiseSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      unique: true,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    }
  },
  { timestamps: true }
)

export const Promise = mongoose.model('promise', PromiseSchema)
