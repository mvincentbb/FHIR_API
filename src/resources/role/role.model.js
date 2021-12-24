import mongoose from 'mongoose'

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
})

export const Role = mongoose.model('role', RoleSchema)
