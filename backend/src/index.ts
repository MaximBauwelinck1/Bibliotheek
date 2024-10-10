// index.ts
import Koa from 'koa';
import { getLogger } from './core/logging';
import bodyParser from 'koa-bodyparser';
import installRest from './rest';
import { initializeData } from './data';
  
async function main(): Promise<void> {
  const app = new Koa();
  app.use(bodyParser()); 
  installRest(app);
  await initializeData(); 
  app.listen(9000, () => {
    getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
  });
}
main();

