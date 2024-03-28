import Server from './server';
import MysqlService from './services/mysql.service';

(async () => {
  await MysqlService.init();

  const api = new Server();

  api.start(3000);
})();
