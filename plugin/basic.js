'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var moment = _interopDefault(require('moment'));
var assert = _interopDefault(require('assert'));
var sequelize = require('sequelize');
var modelIndex = _interopDefault(require('../model'));
var fetch = _interopDefault(require('node-fetch'));
var axios = _interopDefault(require('axios'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class Log {
    constructor() {
        this.logPath = path.resolve(__dirname, '../log/app-log.log');
    }
    _getArchiveName(stat, name) {
        let arr = name.split('.');
        arr.splice(-1, 0, `${moment(stat.birthtime).format('YYYYMMDD')}`);
        return arr.join('.');
    }
    _tidyFile() {
        try {
            const stat = fs.statSync(this.logPath);
            if (!moment(stat.birthtime).isSame(moment(), 'day')) {
                fs.renameSync(this.logPath, this._getArchiveName(stat, this.logPath));
            }
        }
        catch (e) {
            console.log(`[plugin error]tidy file:\n${e.message}`);
            return;
        }
    }
    write(msg, config) {
        this._tidyFile();
        const { fname } = config || {};
        const fnameStr = fname ? ` [${fname}]` : '';
        const now = moment().format('YYYYMMDD-HH:mm:ss');
        const str = `###${now}###${fnameStr} ${msg}`;
        console.log(str);
        fs.writeFileSync(this.logPath, `${str}\n`, { flag: 'a' });
    }
    writeObj(obj, config) {
        const msg = JSON.stringify(obj);
        this.write(msg, config);
    }
    writeArr(arr, config) {
        const tmp = arr.map(one => {
            if (typeof one === 'string') {
                return one;
            }
            else if (typeof one === 'object') {
                return JSON.stringify(one);
            }
        });
        this.write(tmp.join(''), config);
    }
    throw(msg, config) {
        this.write(' -- throw error: -- ' + msg, config);
        throw new Error(msg);
    }
}

class Util {
    constructor() {
        this.log = new Log();
        // this.log.write('[plugin]Util loaded.');
    }
    _genLog(funName, msg) {
        return `[util] - ${funName}: ${msg}`;
    }
    waitForSec(sec) {
        assert(sec > 0, this._genLog('waitForSec', 'sec should > 0'));
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, sec * 1000);
        });
    }
    waitFor(cnt) {
        assert(cnt > 0, this._genLog('waitFor', 'cnt should > 0'));
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, cnt);
        });
    }
    genRandomStr(cnt) {
        const alph = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const rst = [];
        for (let i = 0; i < cnt; ++i) {
            const rnd = Math.floor(Math.random() * alph.length);
            rst.push(alph[rnd]);
        }
        return rst.join('');
    }
    retryDo(cb, retryTimes = 3, intervalTime = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let cnt = 0;
            // eslint-disable-next-line no-constant-condition
            while (1) {
                try {
                    yield cb();
                    return true;
                }
                catch (e) {
                    cnt++;
                    if (cnt >= retryTimes) {
                        throw e;
                    }
                    if (intervalTime > 0) {
                        yield this.waitFor(intervalTime);
                    }
                    this.log.write(this._genLog('retryDo', `retry for the ${cnt} time(s)...`));
                }
            }
            throw new Error(this._genLog('retryDo', 'you should not go here'));
        });
    }
}

var config = {
    host: '',
    port: 8111,
    mysql: {
        host: 'ip',
        port: 3306,
        dbname: '111',
        username: 'root',
        password: '111',
    }
};

class Db {
    constructor() {
        this.log = new Log();
        this.util = new Util();
        this.dbConfig = config.mysql;
        this.isLoaded = false;
        this.sequelize = new sequelize.Sequelize(this.dbConfig.dbname, this.dbConfig.username, this.dbConfig.password, {
            host: this.dbConfig.host,
            port: this.dbConfig.port,
            dialect: 'mysql',
        });
        this.sequelize
            .authenticate()
            .then(() => {
            this.log.write('[plugin]Db service loaded.');
            this.initModel();
            this.isLoaded = true;
        })
            .catch((err) => {
            this.log.writeObj(err);
        });
    }
    initModel() {
        modelIndex(this.sequelize);
    }
    checkModelLoaded() {
        if (!this.isLoaded) {
            this.log.throw('db model is not loaded', { fname: 'plugin db - checkModelLoaded - ' });
        }
        else {
            this.log.write('db model is loaded', { fname: 'plugin db - checkModelLoaded - ' });
        }
        return this.isLoaded;
    }
    getModel(modelName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.util.retryDo(() => {
                this.checkModelLoaded();
            }, 20, 1000);
            return this.sequelize.model(modelName);
        });
    }
}

class Example {
    constructor() {
        this.log = new Log();
        this.log.write('[plugin]Example loaded.');
    }
    test() {
        console.log('plugin example test');
    }
}

class Req {
    constructor() {
        this.log = new Log();
        this.log.write('[plugin]Req loaded.');
    }
    /**
     * 普通单纯的node-fetch库
     * @param url 请求地址
     * @param opt 请求选项
     */
    fetch(url, opt) {
        return fetch(url, opt);
    }
    /**
     * 包含基本状态展示、常用数据转换和错误处理的fetch方法
     * @param url 请求地址
     * @param opt 请求选项
     */
    fetch2(url, opt) {
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
    axios(url, opt) {
        return axios({
            method: opt.method,
            url,
            data: opt.body,
            headers: opt.headers,
            params: opt.params,
            timeout: opt.timeout,
            proxy: opt.proxy
        })
            .then(res => {
            return res.data;
        });
    }
}

// auto generated //
const pluginList = {
    db: new Db(),
    example: new Example(),
    log: new Log(),
    req: new Req(),
    util: new Util(),
};

exports.pluginList = pluginList;
