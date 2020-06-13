import {
  controllerType,
  serviceType,
  pluginType,
} from './auto-code'; // auto code位置统一
import { pluginType as basicPluginType } from '../plugin/basic';

/**
 * TYPE
 */
type ctxBaseType = {
  controller: controllerType;
  service: serviceType;
  request: any;
  response: any;
  config: any;
};
export type ctxType = ctxBaseType & pluginType & basicPluginType;

/**
 * BASE
 */

enum controllerErrnoEnum {
  SUCCESS = 0,
  VALIDATE_ERROR = 1,
  INTERNAL_ERROR = 2,
}

export class ControllerBase {
  _genLog(funName: string, msg: string) {
    return `[controller] - ${funName}: ${msg}`;
  }

  _assert(ctx: ctxType, judge: boolean, msg: string) {
    if (!judge) {
      ctx.response = {
        errno: controllerErrnoEnum.VALIDATE_ERROR,
        msg,
        data: null,
      };
      throw new Error('controller_assert');
    }
  }

  _resolve(ctx: ctxType, data: any) {
    ctx.response = {
      errno: controllerErrnoEnum.SUCCESS,
      msg: 'success',
      data,
    };
  }

  _reject(ctx: ctxType, msg: string) {
    ctx.response = {
      errno: controllerErrnoEnum.INTERNAL_ERROR,
      msg: 'internal error',
      data: msg,
    };
  }

  ctrl(ctx: ctxType, cb: Function) {
    return new Promise(async (resolve) => {
      try {
        await cb(this._assert, this._resolve);
      } catch (error) {
        if (error.message !== 'controller_assert') {
          this._reject(ctx, error.message);
        }
      }
      resolve();
    });
  }
}

export class ServiceBase {
  ctx!: ctxType;
  _genLog(funName: string, msg: string) {
    return `[service] - ${funName}: ${msg}`;
  }
}
