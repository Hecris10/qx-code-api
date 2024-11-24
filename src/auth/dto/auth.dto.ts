import { CreateUserDto } from 'src/user/dto/create-user.dto';

export type UserAuth = Omit<CreateUserDto, 'password'> & { id: number };
