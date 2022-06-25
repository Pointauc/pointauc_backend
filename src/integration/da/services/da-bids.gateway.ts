import { WebSocketGateway } from '@nestjs/websockets';
import { AbstractBidsGateway } from '../../abstract/services/abstract-bits.gateway';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../../../user/models/user.model';
import { DaAuthModel } from '../models/da-auth.model';
import { DaCentrifuge } from '../models/da-centrifuge';
import { DaCentrifugeDonationEvent } from '../dto/da-donation.dto';
import { getBidsRoom } from '../../abstract/utils/bids.utils';
import { getBidFromDaDonation } from '../utils/da-donation.utils';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'da',
})
export class DaBidsGateway extends AbstractBidsGateway {
  private centrifugeClients = new Map<string, DaCentrifuge>();

  constructor(
    @InjectModel(UserModel) private userModel: typeof UserModel,
    @InjectModel(DaAuthModel) private daAuthModel: typeof DaAuthModel,
  ) {
    super();
  }

  async bidsConnect(daAuthId: string): Promise<void> {
    const { accessToken, socketConnectionToken } =
      await this.daAuthModel.findByPk(daAuthId);

    const centrifuge = new DaCentrifuge(socketConnectionToken, daAuthId);

    await centrifuge.connect(accessToken);
    this.centrifugeClients.set(daAuthId, centrifuge);
    centrifuge.$donation.subscribe(this.handleDonation);
  }

  bidsDisconnect(daAuthId: string): void {
    const centrifuge = this.centrifugeClients.get(daAuthId);

    if (centrifuge) {
      centrifuge.closeConnection();
      this.centrifugeClients.delete(daAuthId);
    }
  }

  async getRoomId(userId: number): Promise<string> {
    const { daAuthId } = await this.userModel.findByPk(userId);

    return daAuthId;
  }

  private handleDonation = ({ data, authId }: DaCentrifugeDonationEvent) => {
    const bid = getBidFromDaDonation(data);

    this.server.to(getBidsRoom(authId)).emit('Bid', bid);
  };
}
