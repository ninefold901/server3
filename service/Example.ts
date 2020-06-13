import { ServiceBase } from '../lib/type';
import { Model, ModelCtor } from 'sequelize';

class Example extends ServiceBase {
  exampleModel: ModelCtor<Model> | null;
  
  constructor() {
    super();
    this.exampleModel = null;
  }
  async getModel() {
    if (!this.exampleModel) {
      this.exampleModel = await this.ctx.db.getModel('example');
    }
    return this.exampleModel;
  }

  async query() {
    await this.getModel();
    return (this.exampleModel as ModelCtor<Model>).findAll();
  }

  async create() {
    await this.getModel();
    return (this.exampleModel as ModelCtor<Model>).create({});
  }

  async update() {
    await this.getModel();
    return (this.exampleModel as ModelCtor<Model>).update({
      name: 'test'
    }, {
      where: {
        id: 1
      }
    });
  }

  async delete() {
    await this.getModel();
    return (this.exampleModel as ModelCtor<Model>).destroy({
      where: {
        id: 1
      }
    });
  }

  test(str: string) {
    return `test: 「${str}」, time: ${new Date().getTime()}`;
  }

  xxx() {
    const option = {
      method: 'POST',
      headers: {},
      body: JSON.stringify({
        
      })
    };
    return this.ctx.req.fetch2('', option)
      .then((res: any) => {
        this.ctx.log.writeObj(res); // for test
        if (!res.code) {
          return res.data;
        } else {
          this.ctx.log.write(`error: ${res.msg}`);
          return null;
        }
      });
  }
}

export default Example;
