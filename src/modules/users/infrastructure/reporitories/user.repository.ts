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

  async getUserById(id: string): Promise<User> {
    return this.entityManager
      .getRepository(User)
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.entityManager
      .getRepository(User)
      .createQueryBuilder()
      .where('email = :email', { email })
      .getOne();
  }

  async createUser(user: User): Promise<User> {
    return this.entityManager.getRepository(User).save(user);
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    await this.entityManager
      .getRepository(User)
      .createQueryBuilder()
      .update()
      .set(user)
      .where('id = :id', { id })
      .execute();

    return this.entityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.entityManager
      .getRepository(User)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return result.affected > 0;
  }
}
