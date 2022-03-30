import Http from '../utils/httpCore/utils/http'
import { message } from 'ant-design-vue'
import { v4 as uuidv4 } from 'uuid'
import { encryptsm3, encryptsm4, decryptsm4 } from '../utils/utils'
import { router } from '../router'

let isDev = process.env.NODE_ENV === 'development'
// 是否使用本地接口调试
const LocalInterfaceDebugging = isDev ? false : false

let baseURL = ''
if (LocalInterfaceDebugging) {
  // 静春
  baseURL = 'http://192.168.199.243:7039'
  // 安成
  // baseURL = "http://192.168.199.24:7039";
} else {
  baseURL = window.g.APP_BASE_URL
}

// 纳入导入 上传文件 api接口地址
export let baseUploadUrl = LocalInterfaceDebugging
  ? baseURL + '/tbMbJoinDetail/onImportPatBaseExcelData'
  : window.g.APP_FILE_BASE_URL + '/ygt-richdiseases/tbMbJoinDetail/onImportPatBaseExcelData'
// isDev
//   ? "/api/tbMbJoinDetail/onImportPatBaseExcelData"
//   : window.g.APP_FILE_BASE_URL + "/tbMbJoinDetail/onImportPatBaseExcelData";

// 接口白名单
const whiteList = ['/ygt-user/user/login', '/ygt-api/general/getToken', '/ygt-user/user/logout']

const options = {
  axiosOptions: {
    baseURL,
    retry: 0,
    timeout: 20000,
  },
  // 请求拦截器
  requestInterceptorSuccessCb: (config) => {
    if (LocalInterfaceDebugging) {
      config.url = config.url.replace(/(\/ygt-richdiseases|\/ygt-registry-manage)/g, '')
      return config
    } else {
      return encryption(config)
    }
  },
  // 响应拦截器
  responseInterceptorSuccessCb: (res) => {
    if (LocalInterfaceDebugging) {
      consoleRes(res)
      return res.data
    }
    if (whiteList.indexOf(res.config.url) === -1) {
      res.data = JSON.parse(decryptsm4(res.data))
    }
    if (res.data.code === 0) {
      consoleRes(res)
      return res.data
    } else {
      consoleRes(res)
      message.error(res?.data?.desc || '操作失败!')
      console.error(`__http__ error`, res.data)
      return res.data
    }
  },
  responseInterceptorErrorCb: (error, code, msg) => {
    if (code === 401) {
      message.error(error?.response?.data?.desc || '操作失败!')
      sessionStorage.clear()
      console.error(`__http__ error`, error.response)
      console.log('router', router)
      router.push('/login')
      // window?.location?.reload?.()
    }
    console.log('router', router)
    console.error(`__http__ error`, error.response)
    return error.response
  },
}

const encryption = (config) => {
  if (whiteList.indexOf(config.url) === -1) {
    //将appkey、token、timestamp、nonce、signature放入请求头中
    const appkey = sessionStorage.getItem('secretKey')
    const token = sessionStorage.getItem('token')
    const timestamp = new Date().getTime()
    // const timestamp = dayjs().unix()
    const nonce = uuidv4()
    config.headers.appkey = appkey
    config.headers.token = token
    config.headers.timestamp = timestamp
    config.headers.nonce = nonce
    let p = ''
    if (config.data) {
      p = encryptsm4(config.data)
    } else if (config.params) {
      // console.log("config.params :>> ", config.params);
      if (config.params.pageNum) {
        config.params.pageNum = JSON.stringify(config.params.pageNum)
      }
      if (config.params.pageSize) {
        config.params.pageSize = JSON.stringify(config.params.pageSize)
      }
      p = encryptsm4(config.params)
    }
    let signature = encryptsm3(
      (config.url + 'appkey=' + appkey + 'token=' + token + 'timestamp=' + timestamp + 'nonce=' + nonce + p).toLowerCase()
    ).toUpperCase()
    config.headers.signature = signature
  }
  return config
}

const consoleRes = (res) => {
  // setTimeout(() => {
  console.log(
    `%c${'/' + res.config.url.split('/')[res.config.url.split('/').length - 1]}`,
    'font-weight:bold',
    JSON.parse(JSON.stringify(res.data))
  )
  // }, 0)
}

// 实例化http
const http = new Http(options)

export default http
