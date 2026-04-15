import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersService.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersService.findOne(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Plese check your login credentials');
    }
  }
}
