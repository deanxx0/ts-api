import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserDto } from './user.dto';
import { UserDocument } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() userDto: UserDto): Promise<UserDocument> {
    console.log(`[user controller] createUser`);
    return this.userService.create(userDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
