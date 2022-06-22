import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AbstractBidsGateway } from '../../abstract/services/abstract-bits.gateway';

@WebSocketGateway({
  cors: { origin: '*' },
  cookie: true,
})
export class TwitchBidsGateway extends AbstractBidsGateway {
  @SubscribeMessage('test1')
  handleTest1(): string {
    return 'ok hdfghdh';
  }
}
