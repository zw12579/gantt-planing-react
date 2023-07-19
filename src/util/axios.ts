import {getToken} from "./tools";
import axios from "axios";

const contentType: string = 'application/json;charset=UTF-8'

class HttpRequest {

  baseUrl: string = ''

  queue: any = {}

  constructor(baseUrl = 'https://dwh_api.bimcc.net') {
    // const { pathname } = window.location;

    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig() {
    let config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': contentType,
        'bimcctoken': getToken(),
      }
    }
    return config
  }


  interceptors(instance:any, url:string) {
    let method: string = ''

    instance.interceptors.request.use((config: any) => {
      method = config.method
      this.queue[url] = true
      return config
    }, (error: any) => {
      return Promise.reject(error)
    })

    instance.interceptors.response.use((res: any) => {
      let { data } = res
      return data
    })

  }

  request(options: any) {
    // @ts-ignore
    const instance: any = axios.create({
      // @ts-ignore
      baseUrl: 'https://dwh_api.bimcc.net/',
      headers: {
        'Content-Type': contentType
      },
    })
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options, {
      cancelToken: ''
    })
  }

  destroy(url: string) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // console.log(this.queue, 'this.queue');
    }
  }

}

export default HttpRequest
