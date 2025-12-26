import { ConflictException, Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginLogService } from '../logs/login-log.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => LoginLogService)) private loginLogService: LoginLogService,
  ) { }

  async register(email: string, password: string, firstName: string, lastName: string) {
    const exists = await this.usersRepo.findOne({ where: { email }, select: ['id'] });
    if (exists) throw new ConflictException('Email already exists');
    // Check if any user exists more efficiently than count()
    const anyUser = await this.usersRepo.findOne({ select: ['id'] });
    const isFirstUser = !anyUser;

    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersRepo.save({
      email,
      password: hash,
      firstName,
      lastName,
      role: isFirstUser ? 'admin' : 'user'
    });

    // Create login log in background (non-blocking)
    this.loginLogService.createLoginLog(user, 'register').catch(err => {
      console.error('Failed to create register log:', err);
    });

    return { id: user.id, email: user.email, role: user.role };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

    // Create login log in background (non-blocking)
    this.loginLogService.createLoginLog(user, 'login').catch(err => {
      console.error('Failed to create login log:', err);
    });

    const { password: _, ...profile } = user;
    return {
      access_token: token,
      user: profile
    };
  }

  async logout(userId: number) {
    // Non-blocking lookup and log creation
    this.usersRepo.findOne({ where: { id: userId }, select: ['id', 'email', 'role', 'firstName', 'lastName'] }).then(user => {
      if (user) {
        this.loginLogService.createLoginLog(user as User, 'logout').catch(() => { });
      }
    }).catch(() => { });
    return { message: 'Logged out' };
  }
}
