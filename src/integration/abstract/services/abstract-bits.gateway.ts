import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { userCookieSession } from '../../../core/constants/userCookieSession.constants';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../../../user/models/user.model';

export class AbstractBidsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

  @SubscribeMessage('test')
  handleTest(@ConnectedSocket() client: Socket): WsResponse {
    return { event: 'test event', data: 'ok hdfghdh' };
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const cookie = client.handshake.query.cookie;
    const req = {
      connection: { encrypted: false },
      headers: { cookie },
    } as any;
    const res = { getHeader: () => ({}), setHeader: () => ({}) } as any;

    await new Promise((resolve) =>
      userCookieSession(req, res, async () => {
        const user = await this.userModel.findByPk(req.session.userId);

        if (!user) {
          client.disconnect();
        }

        resolve(null);
      }),
    );
  }
}
