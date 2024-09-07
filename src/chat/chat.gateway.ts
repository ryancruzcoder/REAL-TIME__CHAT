import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class ChatGateway {

  constructor(
    private readonly authService: AuthService
  ) { }

  @WebSocketServer() server: Server;

  @SubscribeMessage('chat message')
  handleMessage(@MessageBody() data: { username: string, message: string}): void {
    const userColor = this.authService.takeColorUser(data.username)
    this.server.emit('chat message', { username: data.username, message: data.message, color: userColor});
  }
}
