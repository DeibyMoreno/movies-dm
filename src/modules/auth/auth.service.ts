import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';
import { ConflictError } from '../../lib/errors/ConflictError.js';
import { UnauthorizedError } from '../../lib/errors/UnauthorizedError.js';
import type { RoleRepository } from '../role/role.repository.js';
import { UserMapper } from '../user/user.mapper.js';
import type { UserRepository } from '../user/user.repository.js';

import { AuthMapper, type AuthPayloadDTO } from './auth.mapper.js';

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) { }

  async login(email: string, password: string): Promise<AuthPayloadDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const roleName = await this.getRoleName(user.role_id);
    const token = this.generateToken(user.id, roleName);

    return AuthMapper.toAuthPayload(token, UserMapper.toPublicDTO(user));
  }

  async register(email: string, password: string, name: string): Promise<AuthPayloadDTO> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const defaultRole = await this.roleRepository.findByName('USER');
    if (!defaultRole) {
      throw new Error('Default role not found');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userRepository.create({
      email,
      password_hash: passwordHash,
      name,
      role_id: defaultRole.id,
    });

    const token = this.generateToken(user.id, defaultRole.name);
    return AuthMapper.toAuthPayload(token, UserMapper.toPublicDTO(user));
  }

  private async getRoleName(roleId: string): Promise<string> {
    const role = await this.roleRepository.findById(roleId);
    return role?.name ?? 'USER';
  }

  private generateToken(userId: string, role: string): string {
    const options: jwt.SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    };
    return jwt.sign({ id: userId, role }, env.JWT_SECRET, options);
  }
}
