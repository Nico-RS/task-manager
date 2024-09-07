import { SetMetadata } from '@nestjs/common';
import { Role } from '../../../users/core/enums/user.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
