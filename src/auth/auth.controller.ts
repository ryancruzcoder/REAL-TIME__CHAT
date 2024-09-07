import { Body, ConflictException, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('/join')
    async join(@Res() res: Response, @Body() user: AuthDTO, @Req() request: Request): Promise<void> {
        try {
            const userDTO = await this.authService.verifyUser(user)
            if (!userDTO){
                throw new ConflictException('Error in user verification')
            }
            const token = await this.authService.saveCookies(userDTO, res)
            res.redirect('/chat/')
        } catch(err) {
            const message = err.message || 'Internal Server Error (AuthController:join)'
            res.render('index', {
                alertType: 'danger',
                alertText: message
            })
        }
    }

}
