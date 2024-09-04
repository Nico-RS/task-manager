import { Module } from '@nestjs/common';
import { TaskController } from './infrastructure/controllers/task.controller';
import { TaskService } from './core/services/task.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './core/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
