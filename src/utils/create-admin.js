import { connect } from './db'
import readline from 'readline'
import { User } from '../resources/user/user.model'
import { Role } from '../resources/role/role.model'
import { config } from '../config/dev'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Téléphone ? ', async telephone => {
  rl.question('mot de passe ? ', async password => {
    await createAdmin(telephone, password)
    rl.close()
  })
})

rl.on('close', function() {
  console.log('\nBYE BYE !!!')
  process.exit(0)
})

async function createAdmin(telephone, password) {
  try {
    await connect()
    const role = await Role.findOne({ name: 'admin' })
    await User.create({
      _id: config.admin_id,
      firstName: 'admin',
      lastName: 'admin',
      telephone: {
        callingCode: '+228',
        alpha: 'TG',
        value: telephone
      },
      password: password,
      role: role._id,
      isActive: true
    })
    console.log('ADMIN CREATED')
  } catch (e) {
    console.error(e)
  }
}
