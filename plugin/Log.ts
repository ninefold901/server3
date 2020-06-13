import fs from 'fs';
import path from 'path';
import moment from 'moment';

type logConfigType = {
  fname?: string;
};

class Log {
  logPath: string;
  constructor() {
    this.logPath = path.resolve(__dirname, '../log/app-log.log');
  }

  _getArchiveName(stat: any, name: string) {
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
    } catch (e) {
      console.log(`[plugin error]tidy file:\n${e.message}`);
      return;
    }
  }

  write(msg: string, config?: logConfigType) {
    this._tidyFile();
    const { fname } = config || {};
    const fnameStr = fname ? ` [${fname}]` : '';

    const now = moment().format('YYYYMMDD-HH:mm:ss');
    const str = `###${now}###${fnameStr} ${msg}`;
    console.log(str);
    fs.writeFileSync(this.logPath, `${str}\n`, { flag: 'a' });
  }

  writeObj(obj: object, config?: logConfigType) {
    const msg = JSON.stringify(obj);
    this.write(msg, config);
  }

  writeArr(arr: (string | object)[], config?: logConfigType) {
    const tmp = arr.map(one => {
      if (typeof one === 'string') {
        return one;
      } else if (typeof one === 'object') {
        return JSON.stringify(one);
      }
    });
    this.write(tmp.join(''), config);
  }

  throw(msg: string, config?: logConfigType) {
    this.write(' -- throw error: -- ' + msg, config);
    throw new Error(msg);
  }
  
}

export default Log;
