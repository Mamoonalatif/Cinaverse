import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const exists = await this.usersRepo.findOne({ where: { email } });
    if (exists) throw new UnauthorizedException('Email already exists');
    
    // First user becomes admin automatically
    const userCount = await this.usersRepo.count();
    const hash = await bcrypt.hash(password, 10);
    
    const user = await this.usersRepo.save({ 
      email, 
      password: hash,
      role: userCount === 0 ? 'admin' : 'user'
    });
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return { access_token: token };
  }
}
