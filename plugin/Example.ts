import Log from './Log';

class Example {
  log: Log;
  constructor() {
    this.log = new Log();
    this.log.write('[plugin]Example loaded.');
  }
  test() {
    console.log('plugin example test');
  }
}

export default Example;
