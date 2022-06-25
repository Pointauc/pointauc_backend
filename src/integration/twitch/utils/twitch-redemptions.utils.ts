import { ITwitchRedemption } from '../dto/twitch-redemption.dto';
import { IBid } from '../../abstract/dto/bids.dto';
import { getRandomIntInclusive } from '../../../core/utils/number.utils';

export const getBidFromRedemption = ({
  id,
  user,
  reward,
  user_input,
  redeemed_at,
}: ITwitchRedemption): IBid => ({
  id,
  rewardId: reward.id,
  username: user.display_name,
  cost: Number(reward.cost),
  color: reward.background_color,
  message: user_input,
  timestamp: redeemed_at,
});

export const createMockBid = (bidPreset: Partial<IBid> = {}): IBid => {
  const randomValue = getRandomIntInclusive(1, 5);
  return {
    timestamp: new Date().toISOString(),
    cost: randomValue * 1000,
    username: 'username',
    message: `${
      getRandomIntInclusive(1, 5) > 1 ? '' : '-'
    }messageMock.${randomValue}`,
    color: '#333333',
    id: Math.random().toString(),
    ...bidPreset,
  };
};
