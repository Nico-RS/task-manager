import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IUserRepository } from '../../core/interfaces/repositories';
import { User } from '../../core/entities/user.entity';
import { PaginationResult } from '../../../../core/interfaces/pagination-result.interface';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<PaginationResult<User>> {
    const [data, total] = await this.entityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.roles'])
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async getUserById(userId: number): Promise<User> {
    return this.entityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.roles']) // Excluir el campo 'password'
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.entityManager
      .getRepository(User)
      .createQueryBuilder()
      .where('email = :email', { email })
      .getOne();
  }

  async createUser(userData: User): Promise<User> {
    const user = this.entityManager.create(User, userData);
    return this.entityManager.getRepository(User).save(user);
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    const existingUser = await this.entityManager.getRepository(User).findOne({
      where: { id: userId },
    });

    if (!existingUser) throw new Error('User not found');

    Object.assign(existingUser, userData);

    await this.entityManager.getRepository(User).save(existingUser);

    return this.entityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.roles'])
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async deleteUser(userId: number): Promise<boolean> {
    const result = await this.entityManager
      .getRepository(User)
      .createQueryBuilder()
      .delete()
      .where('id = :userId', { userId })
      .execute();

    return result.affected > 0;
  }
}
