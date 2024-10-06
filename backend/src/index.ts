// index.ts
import Koa from 'koa';
import { getLogger } from './core/logging';
import bodyParser from 'koa-bodyparser';
import * as gebruikerService from './service/gebruikers';
import installRest from './rest';

const app = new Koa();
app.use(bodyParser()); 
  
installRest(app);

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
});