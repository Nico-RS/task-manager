import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IUserRepository } from '../../core/interfaces/repositories';
import { User } from '../../core/entities/user.entity';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.entityManager
      .getRepository(User)
      .createQueryBuilder()
      .select()
      .getMany();
  }

  async getUserById(userId: number): Promise<User> {
    return this.entityManager
      .getRepository(User)
      .createQueryBuilder()
      .where('id = :userId', { userId })
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
    const user = this.entityManager.create(User, userData);
    await this.entityManager
      .getRepository(User)
      .createQueryBuilder()
      .update()
      .set(user)
      .where('id = :userId', { userId })
      .execute();

    return this.entityManager
      .getRepository(User)
      .createQueryBuilder('user')
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
