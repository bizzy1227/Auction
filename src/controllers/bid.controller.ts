import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { AddBidDto } from '../dto/add-bid.dto';
import bidService from '../services/bid.service';


class BidController {
  public static async addBid(req: Request, res: Response): Promise<void> {
    const addBidDto = new AddBidDto();
    addBidDto.item_id = req.body.item_id;
    addBidDto.price = req.body.price;
  
    const validationErrors = await validate(addBidDto);
    if (validationErrors.length > 0) {
      res.status(400).json({ message: "Bad request" });
      return;
    }
  
    try {
      const result = await bidService.addBid({ ...req.body, user_id: req.header('X-User-ID') });
      res.send(result);
    } catch (error) {
      console.error('Error adding bid:', error);
      res.status(500).json({ message: (error as Error).message  });
    }
  }
}

export default BidController;