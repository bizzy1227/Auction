import express, { Express } from 'express';
import { checkUserIdHeader } from './middleware/check-user-id-header';
import { perMinuteLimiter, perSecondLimiter, perTenSecondsLimiter } from './middleware/limits';
import routes from './routes';
import './cron/index'; 

class Server {
  private app: Express;

  constructor() {
    this.app = express();
    this.config();
    this.middleware();
    this.routes();
  }
  

  private config(): void {
    this.app.use(express.json());
  }

  private middleware(): void {
    this.app.use('/bids', checkUserIdHeader);
    this.app.use('/items', checkUserIdHeader);

    this.app.use('/bids', perSecondLimiter);
    this.app.use('/bids', perTenSecondsLimiter);
    this.app.use('/bids', perMinuteLimiter);
  }

  private routes(): void {
    this.app.use('/', routes);
  }

  public start(port: number): void {
    this.app.use(checkUserIdHeader);
    this.app.listen(port, async () => {
      console.log(`API server is running on port ${port}`);
    });
  }
}

export default Server;
