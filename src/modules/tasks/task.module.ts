import { Module } from '@nestjs/common';
import { TaskController } from './infrastructure/controllers/task.controller';
import { TaskService } from './core/services/task.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './core/entities/task.entity';
import { TaskRepository } from './infrastructure/repositories/task.repository';
import { UserService } from '../users/core/services/user.service';
import { UserRepository } from '../users/infrastructure/reporitories/user.repository';

const services = [TaskService, UserService];
const interfaces = [
  { provide: 'ITaskRepository', useClass: TaskRepository },
  { provide: 'IUserRepository', useClass: UserRepository },
];

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [...services, ...interfaces],
})
export class TaskModule {}
