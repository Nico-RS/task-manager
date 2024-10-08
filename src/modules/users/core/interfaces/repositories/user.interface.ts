import { PaginationResult } from '../../../../../core/interfaces/pagination-result.interface';
import { User } from '../../entities/user.entity';

export interface IUserRepository {
  getAllUsers(page: number, limit: number): Promise<PaginationResult<User>>;
  getUserById(userId: number): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  createUser(user: Partial<User>): Promise<User>;
  updateUser(userId: number, user: Partial<User>): Promise<Partial<User>>;
  deleteUser(userId: number): Promise<boolean>;
}
