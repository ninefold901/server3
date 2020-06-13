import { pluginList } from './basic';

class Example {
  constructor() {
    pluginList.log.write('[plugin]Example loaded.');
  }
  test() {
    console.log('plugin example test');
  }
}

export default Example;
