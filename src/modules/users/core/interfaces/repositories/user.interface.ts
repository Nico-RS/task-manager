import { User } from '../../entities/user.entity';

export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  createUser(user: Partial<User>): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<Partial<User>>;
  deleteUser(id: string): Promise<boolean>;
}
