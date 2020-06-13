// auto generated //

import Examplecontroller from '../controller/Example';
export type controllerType = {
example: Examplecontroller,
};
export const controllerList: controllerType = {
example: new Examplecontroller(),
};

import Exampleservice from '../service/Example';
export type serviceType = {
[key: string]: any
example: Exampleservice,
};
export const serviceList: serviceType = {
example: new Exampleservice(),
};

import Dbplugin from '../plugin/Db';
import Exampleplugin from '../plugin/Example';
import Logplugin from '../plugin/Log';
import Reqplugin from '../plugin/Req';
import Utilplugin from '../plugin/Util';
export type pluginType = {
db: Dbplugin,
example: Exampleplugin,
log: Logplugin,
req: Reqplugin,
util: Utilplugin,
};
export const pluginList: pluginType = {
db: new Dbplugin(),
example: new Exampleplugin(),
log: new Logplugin(),
req: new Reqplugin(),
util: new Utilplugin(),
};


