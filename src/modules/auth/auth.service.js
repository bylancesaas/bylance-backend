import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';
import prisma from '../../config/prisma.js';

export class AuthService {
  static async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenant: {
          include: { modules: { where: { active: true } } },
        },
      },
    });

    if (!user) throw new Error('INVALID_CREDENTIALS');
    if (!user.active) throw new Error('USER_INACTIVE');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('INVALID_CREDENTIALS');

    // Check tenant is active (skip for super_admin)
    if (user.role !== 'super_admin' && user.tenant && !user.tenant.active) {
      throw new Error('TENANT_INACTIVE');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, tenantId: user.tenantId },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        tenant: user.tenant ? {
          id: user.tenant.id,
          name: user.tenant.name,
          slug: user.tenant.slug,
          logo: user.tenant.logo,
          iconBgColor: user.tenant.iconBgColor,
          primaryColor: user.tenant.primaryColor,
          secondaryColor: user.tenant.secondaryColor,
          businessType: user.tenant.businessType,
          vertical: user.tenant.vertical,
          modules: user.tenant.modules.map(m => m.module),
        } : null,
      },
    };
  }

  static async register({ name, email, password, tenantId, role }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('EMAIL_IN_USE');

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        tenantId: tenantId || null,
        role: role || 'mechanic',
      },
      select: { id: true, name: true, email: true, role: true, tenantId: true },
    });

    return user;
  }

  static async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, role: true, tenantId: true,
        tenant: {
          select: {
            id: true, name: true, slug: true, logo: true, iconBgColor: true,
            primaryColor: true, secondaryColor: true, businessType: true, vertical: true,
            modules: { where: { active: true }, select: { module: true } },
          },
        },
      },
    });

    if (user?.tenant) {
      user.tenant.modules = user.tenant.modules.map(m => m.module);
    }

    return user;
  }
}
