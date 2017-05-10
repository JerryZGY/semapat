// Node Modules
import * as Router from 'koa-router';
// Routers
import search from './search';
import details from './details';

const router = new Router();
router
    .use('/api/search', search.routes())
    .use('/api/details', details.routes());

export default router;