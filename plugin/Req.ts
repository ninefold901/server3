import fetch from 'node-fetch';
import axios from 'axios';
import Log from './Log';

class Req {
  log: Log;
  constructor() {
    this.log = new Log();
    this.log.write('[plugin]Req loaded.');
  }

  /**
   * 普通单纯的node-fetch库
   * @param url 请求地址
   * @param opt 请求选项
   */
  fetch(url: string, opt: any) {
    return fetch(url, opt);
  }

  /**
   * 包含基本状态展示、常用数据转换和错误处理的fetch方法
   * @param url 请求地址
   * @param opt 请求选项
   */
  fetch2(url: string, opt: any) {
    return fetch(url, opt)
      // .then((res) => {
      //   // for debug
      //   this.log.write(`status: ${res.status}, text: ${res.statusText}`, {
      //     fname: 'plugin - Req.fetch2'
      //   });
      //   return res;
      // })
      .then((res) => res.json())
      .catch((e) => {
        this.log.write(`error:\n${e.message}`, {
          fname: 'plugin - Req.fetch2'
        });
      });
  }

  axios(url: string, opt: any) {
    return axios({
      method: opt.method,
      url,
      data: opt.body,
      headers: opt.headers,
      params: opt.params,
      timeout: opt.timeout,
      proxy: opt.proxy
    })
      .then(res =>{
        return res.data;
      });
  }
}

export default Req;
