import { boot } from 'quasar/wrappers'
import pinia from '../store'

export default boot(({ app }) => {
  app.use(pinia)
})
