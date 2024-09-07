import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AppService {
  
  constructor (
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async getUsernameFromPayload(request: Request): Promise<object> {
    const token = request.cookies.jwt
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('JWT_SK') })
      if (!payload) {
        throw new ConflictException('Error in verify session')
      }
      return payload.username
    } catch(err) {
      const message = err.message || 'Internal Server Error (AppService:getPayloadHTTP)'
      throw new ConflictException(message)
    }
  }

}
