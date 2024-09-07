import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean>  {
    const response = context.switchToHttp().getResponse<Response>()
    const request = context.switchToHttp().getRequest<Request>()
    if (!request.cookies.jwt){
      response.redirect('/')
      return false
    }
    const token = request.cookies.jwt
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('JWT_SK') })
      if (!payload) {
        throw new ConflictException('Error in verify session')
      }
      request['user'] = payload
    } catch(err) {
      response.redirect('/')
      return false
    }
    
    return true
  }
}
