// Node Modules
import * as Router from 'koa-router';
import { Connection } from 'stardog';
// Libraries
import * as _ from 'lodash';
import config from '../config';

const router = new Router();
router.post('/', async ctx => {
  const { kind } = (ctx.request as any).body;
  const conn = new Connection();
  conn.setEndpoint(config.host);
  conn.setCredentials('admin', 'admin');
  const query = `SELECT ?product ?url ?name ?patents (GROUP_CONCAT(?img) AS ?imgs)
                 WHERE
                 {
                 ?product  product:kind  "${kind}";
                           product:img   ?img;
                           product:url   ?url;
                           product:name  ?name.
                   {
                     SELECT ?product (GROUP_CONCAT(?patent) AS ?patents)
                     WHERE
                     {
                       ?product product:patent ?patent.
                     }
                     GROUP BY ?product
                   }
                 }
                 GROUP BY ?product ?url ?name ?patents`;
  const response = await new Promise<any[]>((res, rej) => conn.query({ database: config.database, query }, ({ results }) => res(results.bindings)));
  ctx.body = formatResponse(response);
});

function formatResponse(response) {
  return response.map(x => {
    Object.keys(x).forEach(key => {
      x[key] = x[key].value;
      if (key === 'patents' || key === 'imgs') {
        if (!x[key]) {
          delete x[key];
        } else {
          x[key] = x[key].split(' ');
        }
      }
    });
    return x;
  }).filter(x => !_.isEmpty(x));
}

export default router;