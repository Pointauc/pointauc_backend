import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { userCookieSession } from '../../../core/constants/userCookieSession.constants';
import {
  getBidsRoom,
  getIdFromBidsRoom,
  isBidsRoom,
} from '../utils/bids.utils';

export abstract class AbstractBidsGateway
  implements OnGatewayConnection, OnGatewayInit
{
  @WebSocketServer()
  server: Namespace;

  private readyRooms = new Set<string>();

  abstract getRoomId(userId: number): string | Promise<string>;
  abstract bidsConnect(id: string): Promise<void> | void;
  abstract bidsDisconnect(id: string): Promise<void> | void;

  onRoomCreate = async (roomKey: string): Promise<void> => {
    if (isBidsRoom(roomKey)) {
      try {
        console.log('try connect');
        await this.bidsConnect(getIdFromBidsRoom(roomKey));

        this.readyRooms.add(roomKey);
        this.server.to(roomKey).emit('bidsStateChange', { state: true });
      } catch (e) {
        this.server
          .to(roomKey)
          .emit('bidsStateChange', { error: e.message, state: false });
        this.server.socketsLeave(roomKey);
      }
    }
  };

  onRoomDelete = async (roomKey: string): Promise<void> => {
    if (isBidsRoom(roomKey)) {
      try {
        await this.bidsDisconnect(getIdFromBidsRoom(roomKey));

        this.readyRooms.delete(roomKey);
      } catch (e) {}
    }
  };

  @SubscribeMessage('bidsSubscribe')
  async subscribe(@ConnectedSocket() client: Socket) {
    const id = await this.getRoomId(client.data.userId);
    const room = getBidsRoom(id);

    if (this.readyRooms.has(room)) {
      client.emit('bidsStateChange', { state: true });
    }

    client.join(room);
  }

  @SubscribeMessage('bidsUnsubscribe')
  async unsubscribe(@ConnectedSocket() client: Socket) {
    const id = await this.getRoomId(client.data.userId);

    client.leave(getBidsRoom(id));

    return { event: 'bidsStateChange', data: { state: false } };
  }

  async handleConnection(client: Socket): Promise<void> {
    const cookie = client.handshake.query.cookie;
    const req = {
      connection: { encrypted: false },
      headers: { cookie },
    } as any;
    const res = { getHeader: () => ({}), setHeader: () => ({}) } as any;

    await new Promise((resolve) =>
      userCookieSession(req, res, async () => {
        client.data.userId = req.session.userId;

        resolve(null);
      }),
    );
  }

  afterInit(server: any): any {
    server.adapter.on('create-room', this.onRoomCreate);
    server.adapter.on('delete-room', this.onRoomDelete);
  }
}
