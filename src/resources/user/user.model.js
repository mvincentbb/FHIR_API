import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: false,
      unique: false,
      trim: true
    },

    telephone: {
      callingCode: String,
      value: {
        type: String,
        trim: true
      },
      alpha: String,
      isVerified: {
        type: Boolean,
        default: false
      },
      update: {
        value: String,
        callingCode: String,
        code: String
      }
    },

    password: {
      type: String,
      required: false
    },

    isActive: {
      type: Boolean,
      default: false
    },

    isArchived: {
      type: Boolean,
      default: false
    },

    promise: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'promise',
      required: false
    },

    role: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'role',
      required: true
    },

    verificationCode: {
      value: String,
      createdAt: Date,
      expireAt: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },

    invitation: {
      token: String,
      secret: String,
      createdAt: Date,
      expireAt: Date,
      accepted: {
        type: Boolean,
        default: false
      }
    },

    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: false
    }
  },
  { timestamps: true }
)

userSchema.index(
  { 'telephone.value': 1, 'telephone.callingCode': 1 },
  { unique: true }
)

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next()
  }

  bcrypt.hash(this.password ? this.password : '123456', 8, (err, hash) => {
    if (err) {
      return next(err)
    }

    this.password = hash
    next()
  })
})

function hashPassword(next) {
  const update = this.getUpdate()
  console.log(update)

  if (update.password !== '' && update.password !== undefined) {
    bcrypt.hash(update.password, 8, (err, hash) => {
      if (err) {
        return next(err)
      }
      this.getUpdate().password = hash
      next()
    })
  } else {
    console.log('no password')
    return next()
  }
}

userSchema.pre('updateOne', hashPassword)
userSchema.pre('findOneAndUpdate', hashPassword)

userSchema.methods.checkPassword = function(password) {
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }

      resolve(same)
    })
  })
}

export const User = mongoose.model('user', userSchema)
