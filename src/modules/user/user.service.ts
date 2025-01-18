// src/user/user.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if the user already exists in the database by email or phone number
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    const existingPhoneNumber = await this.prisma.user.findUnique({
      where: { phoneNumber: createUserDto.phoneNumber },
    });

    if (existingEmail) {
      throw new ConflictException('User with this email already exists');
    }

    if (existingPhoneNumber) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    try {
      // Create the new user
      const newUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
          phoneNumber: createUserDto.phoneNumber,
        },
      });

      const { password, ...result } = newUser; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    } catch (error: any) {
      // Handle other errors
      throw new InternalServerErrorException(
        `Failed to create user: ${error.message}`,
      );
    }
  }
}
