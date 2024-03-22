import { Sequelize } from 'sequelize';
import { Item } from '../models/item.model';

export class ItemService {
  private static instance: ItemService;

  private constructor() {}

  public static getInstance(): ItemService {
    if (!ItemService.instance) {
      ItemService.instance = new ItemService();
    }

    return ItemService.instance;
  }

  public async getList(): Promise<Item[]> {
    try {
      const list = await Item.findAll({
        attributes: [
          'id',
          'name',
          'status',
          'start_price',
          [Sequelize.literal('(SELECT price FROM bids WHERE bids.item_id = items.id ORDER BY price DESC LIMIT 1)'), 'price'],
          [Sequelize.literal('(SELECT user_id FROM bids WHERE bids.item_id = items.id ORDER BY price DESC LIMIT 1)'), 'owner_id'] 
        ],
      });
      return list;
    } catch (error) {
      console.error('Error while get item list:', error);
      throw error;
    }
  }

  public async addItem({ name, start_price, start_time, end_time, user_id }: {
    name: string,
    start_price: number,
    start_time: Date,
    end_time: Date,
    user_id: number 
  }): Promise<Item> {
    try {
      const result = await Item.create({
        name,
        start_price,
        start_time,
        end_time,
        owner_id: +user_id,
        status: StatusEnum.NOT_STARTED,
      });
      
      return result;
    } catch (error) {
      console.error('Error while add item:', error);
      throw error;
    }
  }
}

export default ItemService.getInstance();