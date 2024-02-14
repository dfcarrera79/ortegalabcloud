import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({  })
api.defaults.timeout = 1000 * 5; // Wait for 5 seconds

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
