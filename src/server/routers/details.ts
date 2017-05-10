// Node Modules
import * as Router from 'koa-router';
import { Connection } from 'stardog';
// Libraries
import config from '../config';

const router = new Router();
router.post('/', async ctx => {
  const { subject } = (ctx.request as any).body;
  const conn = new Connection();
  conn.setEndpoint(config.host);
  conn.setCredentials('admin', 'admin');
  const query = `SELECT * WHERE { <${subject}> ?o ?p }`;
  const response = await new Promise<any[]>((res, rej) => conn.query({ database: config.database, query }, ({ results }) => res(results.bindings)));
  ctx.body = formatResponse(response);
});

function formatResponse(response) {
  return response.map(x => ({ key: x.o.value, value: x.p.value }));
}

export default router;