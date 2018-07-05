import React from 'react';
import axios from 'axios';
// import { isLocal } from 'utils';
// import { Modal } from 'antd';

function isLocal() {
    return process.env.NODE_ENV !== 'production';
}

/**
 * Ajax
 *
 * Ajax.req({ url, params, method })
 */
export default class Ajax {
  static getApi(api) {
    let url = eval(`CFG.api.${api}`);
    let arr = url.split('.');
    const reg = /^https?:\/\/|^\/\//; // http请求也不走本地mock数据
    if (isLocal() && arr[0] !== 'mock' && !reg.test(url)) {
      // console.log(isLocal());
      arr = api.split('.');
      url = './mock';
      arr.forEach(item => {
        url += '/' + item;
      });
      url += '.json';
    }
    return url;
  }

  static req(options, _params, _method) {
    // 兼容一下入参写法
    if (typeof options === 'string') {
      options = {
        url: options,
        params: _params || {},
        method: _method || 'get',
        ignoreError: false, // 忽略错误，不进行错误弹层提示
      };
    }
    let { url, params, method = 'get'} = options;
    url = Ajax.getApi(url);
    method = method.toLowerCase();
    params = {
      ...params,
      token: CFG.token,
    };
    // get 请求要用 params 包一层
    if (method === 'get') {
      params = {
        params
      };
    }

    // 发起请求
    return axios[method](url, params).then(resp => {
      return new Promise((resolve, reject) => {
        const respData = resp.data;
        const { code, data } = respData;
        if (code !== 0) {
          reject(respData);
        } else {
          resolve(data, respData);
        }
      });
    }).catch((error) => {
      let message = '系统繁忙，请稍后再试。';
      if (error.response) {
        console.warn('Ajax error.response', error.response);
      } else if (error.request) {
        console.warn('Ajax error.request', error.request);
      } else if (error.message) {
        console.warn('Ajax error.message', error.message);
      }
      console.warn('Ajax error', error);

      if (error.notice ) {
        message = error.notice;
      }

      // if (!options.ignoreError) {
      //   Modal.error({
      //     title: '抱歉',
      //     content: (
      //       <p>{message}</p>
      //     )
      //   });
      // }
    });

  }
}
