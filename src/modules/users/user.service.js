import bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository.js';
import prisma from '../../config/prisma.js';

export class UserService {
  static async listByTenant(tenantId) {
    return UserRepository.findAllByTenant(tenantId);
  }

  static async getById(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error('USER_NOT_FOUND');
    return user;
  }

  static async create({ name, email, password, role, tenantId }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('EMAIL_IN_USE');
    const hashedPassword = await bcrypt.hash(password, 12);
    return prisma.user.create({
      data: { name, email, password: hashedPassword, role, tenantId },
      select: { id: true, name: true, email: true, role: true, active: true },
    });
  }

  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    return UserRepository.update(id, data);
  }

  static async delete(id) {
    return UserRepository.delete(id);
  }
}
