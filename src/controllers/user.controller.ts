import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { AddUserDto } from '../dto/add-user.dto';
import userService from '../services/user.service';


class UserController {
  public static async addUser(req: Request, res: Response): Promise<void> {
    const addItemDto = new AddUserDto();
    addItemDto.name = req.body.name;
  
    const validationErrors = await validate(addItemDto);
    if (validationErrors.length > 0) {
      res.status(400).json({ message: "Bad request" });
      return;
    }
  
    try {
      const result = await userService.addUser(req.body);
      res.send(result);
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).send('Error adding user');
    }
  }
}

export default UserController;