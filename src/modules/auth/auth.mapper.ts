import type { UserDTO } from '../user/user.mapper.js';

export interface AuthPayloadDTO {
  token: string;
  user: UserDTO;
}

export class AuthMapper {
  static toAuthPayload(token: string, user: UserDTO): AuthPayloadDTO {
    return { token, user };
  }
}
