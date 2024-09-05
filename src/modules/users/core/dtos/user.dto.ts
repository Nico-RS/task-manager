import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Role } from '../enum/user.enum';

export class CreateUserDto {
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(
    {},
    {
      message:
        'The password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

export class UpdateUserDto {
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsStrongPassword(
    {},
    {
      message:
        'The password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password?: string;
}

export class UserLoginDto {
  @IsEmail()
  email: string;

  @IsStrongPassword(
    {},
    {
      message:
        'The password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
