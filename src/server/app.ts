// Node Modules
import * as Koa from 'koa';
import * as path from 'path';
import * as json from 'koa-json';
import * as serve from 'koa-static';
import * as bodyParser from 'koa-bodyparser';
// Routers
import router from './routers/index';
// Libraries
import config from './config';

const app = new Koa();

app
  .use(serve(path.resolve('./dist')))
  .use(bodyParser())
  .use(json())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(config.port);

console.log(`listening on port: ${config.port}`);

export default app;