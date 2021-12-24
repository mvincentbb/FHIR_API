import basicInfo from './basicInfo'
import servers from './servers'
import tags from './tags'
import todos from './payments'
import components from './components'

export default {
  ...basicInfo,
  ...components,
  ...tags,
  ...todos,
  ...servers
}
