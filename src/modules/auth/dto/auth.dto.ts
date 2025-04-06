import { CreateUserDto } from '../../user/dto/create-user.dto';

export type UserAuth = Omit<CreateUserDto, 'password'> & { id: number };
