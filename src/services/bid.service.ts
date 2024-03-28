import { Sequelize } from 'sequelize';
import { Bid } from '../models/bid.model';
import { Item } from '../models/item.model';
import mysqlService from './mysql.service';


export class BidService {
  private static instance: BidService;
  private db: Sequelize;

  private constructor(connect: Sequelize) {    
    this.db = connect;
  }

  public static getInstance(): BidService {    
    if (!BidService.instance) {
      BidService.instance = new BidService(mysqlService.getConnect());
    }

    return BidService.instance;
  }

  public async addBid({ item_id, price, user_id }: { item_id: number, price: number, user_id: number }): Promise<Bid> {
    const transaction = await this.db.transaction();
    
    try {
      const item = await Item.findOne({
        attributes: ['status', 'start_price'],
        where: {
          id: item_id
        },
        include: [{
          model: Bid,
          attributes: ['price'],
          as: 'bids',
          order: [['price', 'DESC']],
          limit: 1
        }],
        transaction,
        lock: true
      });

      if (!item) {
        throw new Error('Item not found.');
      }

      if (item.status != StatusEnum.IN_PROGRESS) {
        throw new Error('Auction has not started yet.');
      }

      const lastBidPrice = item.dataValues.bids.length > 0 ? item.dataValues.bids[0].price : null;

      if (lastBidPrice && price <= lastBidPrice) {
        throw new Error('Bid price must be greater than the last bid price.');
      }

      if (!lastBidPrice && item.start_price >= price) {
        throw new Error('Bid price must be greater than the start price.');
      }

      const result = await Bid.create({
        item_id,
        price,
        user_id: +user_id,
        created_at: Date.now(),
      }, { transaction });

      await transaction.commit();

      return result;
    } catch (error) {            
      await transaction.rollback();
      throw error;
    }
  }
}

export default BidService.getInstance();