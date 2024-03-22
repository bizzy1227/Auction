import { AddUserDto } from '../dto/add-user.dto';
import { User } from '../models/user.model';

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  public async addUser({ name }: AddUserDto): Promise<User> {
    try {
      const result = await User.create({
        name,
      });
      
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService.getInstance();