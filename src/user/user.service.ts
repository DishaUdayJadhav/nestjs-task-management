import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    //hash
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const salt = await bcrypt.genSalt();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('salt', salt);
    console.log('hashedPassword', hashedPassword);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === '23505'
      ) {
        throw new ConflictException('Username already exists');
      }

      throw new InternalServerErrorException();
    }
  }
  //console.log(error.code);

  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }
}
