import Log from './Log';
import Util from './Util';
import config from '../config/config.default';

import { Sequelize, Model, ModelCtor } from 'sequelize';
import modelIndex from '../model';

class Db {
  log: Log;
  util: Util;
  sequelize: Sequelize;
  isLoaded: boolean;
  dbConfig: { dbname: string; username: string; password: string; host: string; port: number; };
  constructor() {
    this.log = new Log();
    this.util = new Util();

    this.dbConfig = config.mysql;
    this.isLoaded = false;
    this.sequelize = new Sequelize(this.dbConfig.dbname, this.dbConfig.username, this.dbConfig.password, {
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
    } else {
      this.log.write('db model is loaded', { fname: 'plugin db - checkModelLoaded - ' });
    }
    return this.isLoaded;
  }

  async getModel(modelName: string): Promise<ModelCtor<Model>>  {
    await this.util.retryDo(() => {
      this.checkModelLoaded();
    }, 20, 1000);
    return this.sequelize.model(modelName);
  }
}

export default Db;
