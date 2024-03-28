import { Sequelize } from 'sequelize';
import { Bid, initBidModel } from '../models/bid.model';
import { initItemModel, Item } from '../models/item.model';
import { initUserModel, User } from '../models/user.model';

class MysqlService {
  private sequelize!: Sequelize;
  private static instance: MysqlService;

  constructor() {
    this.connect();
  }

  public static getInstance(): MysqlService {
    if (!MysqlService.instance) {
      MysqlService.instance = new MysqlService();
    }

    return MysqlService.instance;
  }

  init(): void {
    this.initModels();
    this.setModelAssociations()
  }

  private initModels(): void {
    initItemModel(this.sequelize);
    initBidModel(this.sequelize);
    initUserModel(this.sequelize);
  }

  private setModelAssociations(): void {
    Item.hasMany(Bid, { foreignKey: 'item_id' });
    User.hasMany(Bid, { foreignKey: 'user_id' });
    Bid.belongsTo(Item, { foreignKey: 'item_id' });
    Bid.belongsTo(User, { foreignKey: 'user_id' });
  }

  getConnect(): Sequelize {
    return this.sequelize
  }

  connect(): void {    
    this.sequelize = new Sequelize('auction_db', 'root', 'root', {
      host: 'localhost',
      dialect: 'mysql',
      logging: false
    });
  }

  async closeConnection(): Promise<void> {
    await this.sequelize.close();
    console.log('Database connection closed.');
  }
}

export default MysqlService.getInstance();
