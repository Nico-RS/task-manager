export class UserTokenDto {
  email: string;
  sub: number;
  roles: string[];
  iat: number;
}
