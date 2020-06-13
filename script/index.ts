/* eslint-disable no-constant-condition */
import { W } from '../lib/output';
import { ctxType } from '../lib/type';

import example from './example';

function main() {
  const w = new W();

  w.execute(async (ctx: ctxType) => {
    await example(ctx);
  });
}

main();
