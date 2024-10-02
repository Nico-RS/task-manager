import { Module } from '@nestjs/common';
import { TaskController } from './infrastructure/controllers/task.controller';
import { TaskService } from './core/services/task.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './core/entities/task.entity';
import { TaskRepository } from './infrastructure/repositories/task.repository';
import { UserService } from '../users/core/services/user.service';
import { UserRepository } from '../users/infrastructure/reporitories/user.repository';
import { TwilioNotificator } from './infrastructure/notificators/twilio.notificator';

const services = [TaskService, UserService];
const interfaces = [
  { provide: 'ITaskRepository', useClass: TaskRepository },
  { provide: 'IUserRepository', useClass: UserRepository },
  { provide: 'ITwilioNotificator', useClass: TwilioNotificator },
];

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [...services, ...interfaces],
})
export class TaskModule {}
