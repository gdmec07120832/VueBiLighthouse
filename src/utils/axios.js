import Axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/routes/index'

const instance = Axios.create({
  baseURL: '/lighthouse',
  timeout: 60 * 1000,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

instance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    const { data, config } = response
    if (data instanceof Blob) {
      return Promise.resolve(response)
    }
    if (data) {
      if (data.result === false && data.action === 'sso') {
        const { targetUrl } = data
        window.location.href =
          targetUrl || process.env.VUE_APP_SSO_LOGIN_PAGE + `?redirectUrl=${window.location.origin}`
        return
      }
      if (data.code === 1) {
        return Promise.resolve(data)
      } else {
        if (!config.silent) {
          message.destroy()
          message.error(data.msg)
        }
        if (data.code === 401) {
          router.push('/login').then()
        }
        if (data.code === 403) {
          router
            .push({
              name: '404',
              query: {
                url: response.config.url,
                json: JSON.stringify(response.data).slice(0, 200)
              }
            })
            .then()
        }
        console.warn(`${response.config.url}出现错误`)
        return Promise.reject(data)
      }
    }
    console.warn(`${response.config.url}出现错误`)
    return Promise.reject('接口错误')
  },
  error => {
    return Promise.reject(error)
  }
)

export default instance
