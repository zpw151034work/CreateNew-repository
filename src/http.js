import axios from 'axios';
import CONFIG from '../config';
import tools from './tools.js';

import {Message} from 'element-ui'

axios.defaults.timeout = 5000;
// axios.defaults.baseURL = CONFIG.HTTP;

//http request 拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          tools.alert('错误请求')
          break;
        case 401:
          tools.alert('未授权，请重新登录')
          break;
        case 403:
          tools.alert('拒绝访问')
          break;
        case 404:
          tools.alert('请求错误,未找到该资源')
          break;
        case 405:
          tools.alert('请求方法未允许')
          break;
        case 408:
          tools.alert('请求超时')
          break;
        case 500:
          tools.alert('服务器端出错')
          break;
        case 501:
          tools.alert('网络未实现')
          break;
        case 502:
          tools.alert('网络错误')
          break;
        case 503:
          tools.alert('服务不可用')
          break;
        case 504:
          tools.alert('网络超时')
          break;
        case 505:
          tools.alert('http版本不支持该请求')
          break;
        default:
          tools.alert(`连接错误${err.response.status}`)
      }
    } else {
      tools.alert('连接到服务器失败')
    }
    return Promise.resolve(err.response)
})

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url,params={}, that, proxy){
  var timestamp=new Date().getTime();
  var sign = tools.getStorage('access_token');
  var app_key = '';

  if (proxy) {
    url = CONFIG.WXHTTP + url
  } else {
    url = CONFIG.HTTP + url;
  }

  return new Promise((resolve,reject) => {
    axios.get(url,{
      params: {
        ...params,
        timestamp,
        sign,
        app_key
      }
    })
    .then(response => {
      if (that && that.loading)  that.loading = false;
      resolve(response.data);
    })
    .catch(err => {
      if (that && that.loading)  that.loading = false;
      reject(err)
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {},that,proxy){
  var timestamp=new Date().getTime();
  var sign = tools.getStorage('access_token');
  var app_key = '';

  if (proxy) {
    url = CONFIG.WXHTTP + url
  } else {
    url = CONFIG.HTTP + url;
  }

  let form = new FormData();
  let newData = {
      ...data,
      timestamp,
      sign,
      app_key
     };
  Object.keys(newData).forEach(key => {
    form.append(key, newData[key]);
  })

   return new Promise((resolve,reject) => {
     axios.post(url, form)
          .then(response => {
            resolve(response.data);
          },err => {
            reject(err)
          })
   })
 }

 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

export const http = {
    fetch, post
}
