import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TaskStatus } from '../enums/task.enum';
import { User } from 'src/modules/users/core/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @Column({ name: 'assignedUser', nullable: false })
  assignedUser: number;

  @ManyToOne(() => User, (u) => u.tasks)
  @JoinColumn({ name: 'id' })
  user: User;
}
