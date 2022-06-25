import { WebSocketGateway } from '@nestjs/websockets';
import { AbstractBidsGateway } from '../../abstract/services/abstract-bits.gateway';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../../../user/models/user.model';
import { TwitchPubSubService } from './twitch-pub-sub.service';
import { TwitchAuthDataModel } from '../models/twitch-auth-data.model';
import { TwitchRewardsService } from './twitch-rewards.service';
import { getBidFromRedemption } from '../utils/twitch-redemptions.utils';
import { getBidsRoom } from '../../abstract/utils/bids.utils';
import { ITwitchRedemption } from '../dto/twitch-redemption.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'twitch',
})
export class TwitchBidsGateway extends AbstractBidsGateway {
  constructor(
    @InjectModel(UserModel) private userModel: typeof UserModel,
    @InjectModel(TwitchAuthDataModel)
    private twitchAuthDataModel: typeof TwitchAuthDataModel,
    private twitchPubSubService: TwitchPubSubService,
    private twitchRewardsService: TwitchRewardsService,
  ) {
    super();
  }

  async getRoomId(userId: number): Promise<string> {
    const { twitchAuthId } = await this.userModel.findByPk(userId);

    return twitchAuthId;
  }

  async bidsConnect(channelId: string): Promise<void> {
    const queryOptions = {
      include: [{ model: TwitchAuthDataModel, include: ['rewardPresets'] }],
    };
    const {
      accessToken,
      settings: { rewardsPrefix, rewardPresets },
    } = await this.twitchAuthDataModel.findByPk(channelId, queryOptions);

    await Promise.all([
      this.twitchPubSubService.listen(channelId, accessToken),
      this.twitchRewardsService.openRewards(
        rewardPresets,
        rewardsPrefix,
        accessToken,
        channelId,
      ),
    ]);
  }

  async bidsDisconnect(channelId: string): Promise<void> {
    const { accessToken } = await this.twitchAuthDataModel.findByPk(channelId);

    this.twitchPubSubService.unlisten(channelId, accessToken);
    await this.twitchRewardsService.hideRewards(accessToken, channelId);
  }

  private handleRedemption = (redemption: ITwitchRedemption): void => {
    const bid = getBidFromRedemption(redemption);

    this.server.to(getBidsRoom(redemption.channel_id)).emit('Bid', bid);
  };

  override afterInit(server: any): any {
    super.afterInit(server);

    this.twitchPubSubService.connect();
    this.twitchPubSubService.$redemption.subscribe(this.handleRedemption);
  }
}
