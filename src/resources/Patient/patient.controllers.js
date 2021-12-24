import { crudControllers } from '../../utils/crud'
import { Patient } from './patient.model'
// import roles from '../../utils/role'

export default {
  ...crudControllers(Patient)
}
