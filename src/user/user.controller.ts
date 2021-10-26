import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserDto } from './user.dto';
import { UserDocument } from './user.schema';
import { UserService } from './user.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @Post()
  async createUser(@Body() userDto: UserDto): Promise<UserDocument> {
    console.log(`[Req][user controller] createUser`);
    return this.userService.create(userDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response): Promise<any> {
    console.log(`[Req][user controller] login`);
    const tokenObj = await this.authService.login(req.user);
    res.set('access_token', tokenObj.access_token);
    return {
      success: tokenObj != null ? true : false,
      result: {
        access_token: tokenObj.access_token,
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('confirm')
  async confirm(): Promise<any> {
    console.log(`[Req][user controller] confirm`);
    return {
      success: true,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUser(@Request() req) {
    console.log(`[Req][user controller] findUser`);
    return this.userService.findOne(req.user.username);
  }
}
