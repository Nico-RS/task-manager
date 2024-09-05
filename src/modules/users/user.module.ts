import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserService } from './core/services/user.service';
import { UserRepository } from './infrastructure/reporitories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './core/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

const services = [UserService];
const interfaces = [{ provide: 'IUserRepository', useClass: UserRepository }];

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [JwtService, ...services, ...interfaces],
  exports: [UserService],
})
export class UserModule {}
