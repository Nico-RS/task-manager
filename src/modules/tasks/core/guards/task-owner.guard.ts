import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TaskService } from '../services/task.services';
import { JwtService } from '@nestjs/jwt';
import { UserTokenDto } from '../../dtos/token.dto';
import { Role } from 'src/modules/users/core/enum/user.enum';

@Injectable()
export class TaskOwnerGuard implements CanActivate {
  constructor(
    private readonly taskService: TaskService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserTokenDto = request.user;

    const isAdmin = user.roles.includes(Role.ADMIN);
    if (isAdmin) return true;

    const taskId: number = parseInt(request.params.taskId);
    const assignedUser: number = parseInt(request.params.assignedUser);

    if (!taskId && !assignedUser) {
      throw new UnauthorizedException('Task ID or assigned user is missing');
    }

    if (taskId) {
      const task = await this.taskService.getTaskById(taskId);
      if (!task) throw new UnauthorizedException('Task not found');

      if (task.assignedUser !== user.sub)
        throw new UnauthorizedException('You do not own this task');
    }

    if (assignedUser) {
      const tasks = await this.taskService.getTaskByUserId(assignedUser);
      if (!tasks || tasks.length === 0)
        throw new UnauthorizedException('No tasks found for this user');

      if (assignedUser !== user.sub)
        throw new UnauthorizedException('You do not own these tasks');
    }

    return true;
  }
}
