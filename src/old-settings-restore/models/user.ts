import mongoose from 'mongoose';

export interface UserTwitchToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}

export interface IUserDonationAlertsToken {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface UserDonationAlertsInterface {
  token: IUserDonationAlertsToken;
  userId: number;
  userCode: string;
  userName: string;
  socketConnectionToken: string;
  clientId?: string;
  newDonationsChannelToken?: string;
}

export interface IUserAucSettings {
  startTime?: number;
  timeStep?: number;
  isAutoincrementActive?: boolean;
  autoincrementTime?: number;
  isBuyoutVisible?: boolean;
  background: string | null;
  purchaseSort?: number;
  marblesAuc?: boolean;
  marbleRate?: number;
  marbleCategory?: number;
  maxTime?: number;
  isMaxTimeActive?: boolean;
}

export interface RewardSetting {
  title?: string;
  cost: number;
  color: string;
}

export interface IUserIntegration {
  twitch: {
    isRefundAvailable?: boolean;
    dynamicRewards?: boolean;
    rewardsPrefix?: string;
    rewards?: RewardSetting[];
  };
  da: {
    pointsRate?: number;
    isIncrementActive?: boolean;
    incrementTime?: number;
  };
}

export interface IDonationAlertsToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface EmoteData {
  image: string;
  code: string;
}

export interface SkipEmotes {
  skip?: EmoteData;
  safe?: EmoteData;
}

export interface ITwitchUser {
  _id?: string;
  username: string;
  channelId: string;
  twitchToken?: UserTwitchToken;
}

export interface IUser extends ITwitchUser {
  donationAlerts?: UserDonationAlertsInterface;
  daToken?: IDonationAlertsToken;
  settings: IUserAucSettings;
  integration: IUserIntegration;
  skipEmotes?: SkipEmotes;
}

const User = new mongoose.Schema({
  username: String,
  channelId: String,
  twitchToken: {
    access_token: String,
    expires_in: Number,
    refresh_token: String,
    scope: [String],
    token_type: String,
  },
  daToken: {
    access_token: String,
    expires_in: Number,
    refresh_token: String,
    token_type: String,
  },
  settings: {
    startTime: Number,
    timeStep: Number,
    isAutoincrementActive: Boolean,
    autoincrementTime: Number,
    isBuyoutVisible: Boolean,
    background: String,
    purchaseSort: Number,
    marblesAuc: Boolean,
    marbleRate: Number,
    marbleCategory: Number,
    showChances: Boolean,
    maxTime: Number,
    isMaxTimeActive: Boolean,
    isNewSlotIncrement: Boolean,
    newSlotIncrement: Number,
  },
  integration: {
    twitch: {
      alwaysAddNew: { type: Boolean, default: false },
      isRefundAvailable: { type: Boolean, default: false },
      dynamicRewards: { type: Boolean, default: false },
      rewardsPrefix: { type: String, default: 'Ставка' },
      rewards: {
        type: [{ cost: Number, color: String }],
        default: [{ cost: 5000, color: '#F57D07' }],
      },
    },
    da: {
      pointsRate: { type: Number, default: 1 },
      isIncrementActive: { type: Boolean, default: false },
      incrementTime: { type: Number, default: 30 },
    },
  },
  skipEmotes: {
    skip: {
      image: String,
      code: String,
    },
    safe: {
      image: String,
      code: String,
    },
  },
});

export default mongoose.model<IUser & mongoose.Document>(
  'users-experiment',
  User,
);
