import { Bid } from '../models/bid.model';
import { Item } from '../models/item.model';

export class BidService {
  private static instance: BidService;

  private constructor() {}

  public static getInstance(): BidService {
    if (!BidService.instance) {
      BidService.instance = new BidService();
    }

    return BidService.instance;
  }

  public async addBid({ item_id, price, user_id }: { item_id: number, price: number, user_id: number }): Promise<Bid> {
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
        }]
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
        created_at: Date.now()
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default BidService.getInstance();