/* eslint-disable no-constant-condition */
// eslint-disable-next-line no-unused-vars
import { ctxType } from '../../lib/type';

export default async (ctx: ctxType) => {
  ctx.log.write('script/example/index.ts start--');
  if (1) {
    await ctx.util.waitFor(1);
    ctx.log.writeArr([
      'example:',
      {
        name: 'example'
      }
    ]);
  }
  ctx.log.write('script/example/index.ts done.');
};
