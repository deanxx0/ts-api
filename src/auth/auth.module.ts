import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
  ],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
