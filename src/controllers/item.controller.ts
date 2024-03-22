import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { AddItemDto } from '../dto/add-item.dto';
import itemService from '../services/item.service';


class ItemController {
  public static async getList(req: Request, res: Response): Promise<void> {
    const result = await itemService.getList();    
    res.send(result);
  }

  public static async addItem(req: Request, res: Response): Promise<void> {
    const addItemDto = new AddItemDto();
    addItemDto.name = req.body.name;
    addItemDto.start_price = req.body.start_price;
    addItemDto.start_time = req.body.start_time;
    addItemDto.end_time = req.body.end_time;
  
    const validationErrors = await validate(addItemDto);
    if (validationErrors.length > 0) {
      res.status(400).json({ message: "Bad request" });
      return;
    }
  
    try {
      const result = await itemService.addItem({...req.body, user_id: req.header('X-User-ID')});
      res.send(result);
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).send('Error adding item');
    }
  }
}

export default ItemController;