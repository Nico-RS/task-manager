import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/modules/users/core/enum/user.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
