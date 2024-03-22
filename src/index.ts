import Server from './server';
import MysqlService from './services/mysql.service';

(async () => {
  const db = new MysqlService();
  db.connect();
  db.init();

  const api = new Server();

  api.start(3000);
})();
