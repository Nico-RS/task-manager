import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserService } from './core/services/user.service';
import { UserRepository } from './infrastructure/reporitories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './core/entities/user.entity';

const services = [UserService];
const interfaces = [{ provide: 'IUserRepository', useClass: UserRepository }];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UserController],
  providers: [...services, ...interfaces],
})
export class UserModule {}
