import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request, response } from 'express';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @Get()
  @Render('index')
  async index(@Req() request: Request, @Res() res: Response): Promise<object> {
    try {
      const username =  await this.appService.getUsernameFromPayload(request)
      if (username) {
        res.redirect('/chat/')
      }
    } catch(err) {
      return { }
    }
  }

  @Get('/chat/')
  @UseGuards(AuthGuard)
  @Render('chat')
  async chat(@Req() request: Request): Promise<object> {
    const username = await this.appService.getUsernameFromPayload(request)
    return { username }
  }

  @Get('/exit/')
  async exit(@Res() res: Response): Promise<void> {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false
    })
    return res.redirect('/')
  }

}
