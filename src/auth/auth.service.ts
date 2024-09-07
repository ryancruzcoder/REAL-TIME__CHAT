import { ConflictException, Injectable } from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { Response } from 'express';
import { v4 as uuid } from 'uuid'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    private users: AuthDTO[] = []

    constructor( 
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
     ) { }

    verifyUser(user: AuthDTO): AuthDTO {
        const existUserList = this.users.filter(u => u.username === user.username)
        const now = Date.now()
        if (existUserList.length) {
            const existUser = existUserList[0]
            const difHours = (now - existUser.timestamp) / (1000 * 60 * 60)
            if (difHours >= 1) {
                this.users = this.users.filter(u => u.username !== user.username)
            } else {
                throw new ConflictException('There is already a user with this username')
            }
        }
        // Gera um número hexadecimal de 6 dígitos
        const corHex = '#' + Math.floor(Math.random() * 16777215).toString(16);
        // Adiciona zeros à esquerda se necessário para garantir que a cor tenha sempre 6 dígitos
        user.color = corHex.padStart(7, '#');
        user.id = uuid()
        user.timestamp = Date.now()
        this.users.push(user)
        return user
    }

    saveCookies(user: AuthDTO, response: Response): string {
        try {
            const payload = { sub: user.id, username: user.username, timestamp: user.timestamp }
            const token = this.jwtService.sign(payload)
            response.cookie('jwt', token, {
                httpOnly: true,
                secure: false,
                maxAge: +this.configService.get<number>('JWT_EI') * 1000
            })
            return token
        } catch(err) {
            const message = err.message || 'Internal Server Error (AuthService:saveCookies)'
            throw new ConflictException(message)
        }
    }

    takeColorUser(username: string): string {
        const fList = this.users.filter(u => u.username === username)
        const userFound = fList[0]
        return userFound.color
    }

}
