import axios, { AxiosRequestConfig } from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitchRewardPresetDto } from '../dto/twitch-auth.dto';
import {
  ENDPOINTS,
  RedemptionStatus,
} from '../../../core/constants/api.constants';
import { ITwitchRedemption } from '../dto/twitch-redemption.dto';
import { IRewardsResponse, IRewardUpdate } from '../dto/twitch-reward.dto';

@Injectable()
export class TwitchRewardsService {
  private openedRewards: Map<string, string[]>;

  constructor(private configService: ConfigService) {
    this.openedRewards = new Map<string, string[]>();
  }

  private getCustomRewardsConfig = (
    accessToken: string,
    channelId: string,
  ): AxiosRequestConfig => ({
    params: {
      broadcaster_id: channelId,
    },
    headers: {
      'Client-ID': this.configService.get('TWITCH_CLIENT_ID'),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  createReward = async (
    { cost, color, is_enabled, title }: TwitchRewardPresetDto & IRewardUpdate,
    config: AxiosRequestConfig,
    commonTitle?: string,
  ): Promise<string> => {
    const reward = {
      title: title || `${commonTitle} ${cost}`,
      cost,
      background_color: color,
      is_user_input_required: true,
      is_enabled,
    };

    const {
      data: { data },
    } = await axios.post<IRewardsResponse>(
      ENDPOINTS.CUSTOM_REWARDS,
      reward,
      config,
    );

    return data[0].id;
  };

  updateReward = async (
    reward: IRewardUpdate,
    config: AxiosRequestConfig,
  ): Promise<string> => {
    const {
      data: { data },
    } = await axios.patch<IRewardsResponse>(
      ENDPOINTS.CUSTOM_REWARDS,
      reward,
      config,
    );

    return data[0].id;
  };

  createRewards = async (
    rewards: TwitchRewardPresetDto[],
    title: string,
    token: string,
    channelId: string,
    isEnabled = true,
  ): Promise<void> => {
    try {
      const config = this.getCustomRewardsConfig(token, channelId);

      const createdRewards = await Promise.all(
        rewards.map(({ color, cost }) =>
          this.createReward(
            { color, cost, is_enabled: isEnabled },
            config,
            title,
          ),
        ),
      );

      this.openedRewards.set(channelId, createdRewards);
    } catch (e) {
      throw new Error(e);
    }
  };

  setRewardVisibility = async (
    rewards: string[],
    token: string,
    channelId: string,
    enabled: boolean,
  ): Promise<void> => {
    try {
      const config = this.getCustomRewardsConfig(token, channelId);

      const createdRewards = await Promise.all(
        rewards.map((id) =>
          this.updateReward(
            { is_enabled: enabled },
            { ...config, params: { ...config.params, id } },
          ),
        ),
      );

      if (enabled) {
        this.openedRewards.set(channelId, createdRewards);
      } else {
        this.openedRewards.delete(channelId);
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  closeReward = async (
    id: string,
    config: AxiosRequestConfig,
  ): Promise<void> => {
    await axios.delete(ENDPOINTS.CUSTOM_REWARDS, {
      ...config,
      params: { ...config.params, id },
    });
  };

  closeRewards = async (token: string, channelId: string): Promise<boolean> => {
    const config = this.getCustomRewardsConfig(token, channelId);
    const rewards = await this.getCreatedRewards(token, channelId);

    if (rewards) {
      await Promise.all(rewards.map((id) => this.closeReward(id, config)));
    }

    this.openedRewards.delete(channelId);

    return !!rewards.length;
  };

  getCreatedRewards = async (
    token: string,
    channelId: string,
  ): Promise<string[]> => {
    const config = this.getCustomRewardsConfig(token, channelId);
    const {
      data: { data },
    } = await axios.get<IRewardsResponse>(ENDPOINTS.CUSTOM_REWARDS, {
      ...config,
      params: { ...config.params, only_manageable_rewards: true },
    });

    return data.map(({ id }) => id);
  };

  updateCreatedRewards = async (
    token: string,
    channelId: string,
  ): Promise<void> => {
    const config = this.getCustomRewardsConfig(token, channelId);
    config.params['only_manageable_rewards'] = true;

    const {
      data: { data },
    } = await axios.get<IRewardsResponse>(ENDPOINTS.CUSTOM_REWARDS, config);

    this.openedRewards.set(
      channelId,
      data.map(({ id }) => id),
    );
  };

  setRedemptionStatus = async (
    token: string,
    channelId: string,
    redemptionId: string,
    rewardId: string,
    status: RedemptionStatus,
  ) => {
    const config = this.getCustomRewardsConfig(token, channelId);
    config.params.id = redemptionId;
    config.params['reward_id'] = rewardId;

    await axios
      .patch(ENDPOINTS.CUSTOM_REDEMPTIONS, { status }, config)
      .catch((err) => console.log(err));
  };

  isAucRedemption = (
    channelId: string,
    redemption: ITwitchRedemption,
  ): boolean => {
    return Boolean(
      this.openedRewards.get(channelId)?.includes(redemption.reward.id),
    );
  };

  refreshRewards = async (
    rewards: TwitchRewardPresetDto[],
    title: string,
    token: string,
    channelId: string,
  ): Promise<void> => {
    const isRewardsOpened = this.openedRewards.has(channelId);
    const isClosed = await this.closeRewards(token, channelId);

    if (isClosed) {
      await this.createRewards(
        rewards,
        title,
        token,
        channelId,
        isRewardsOpened,
      );
    }
  };

  hideRewards = async (token: string, channelId: string): Promise<void> => {
    const rewards = await this.getCreatedRewards(token, channelId);

    await this.setRewardVisibility(rewards, token, channelId, false);
  };

  openRewards = async (
    rewards: TwitchRewardPresetDto[],
    title: string,
    token: string,
    channelId: string,
  ): Promise<void> => {
    const createdRewards = await this.getCreatedRewards(token, channelId);

    if (createdRewards.length) {
      await this.setRewardVisibility(createdRewards, token, channelId, true);
    } else {
      await this.createRewards(rewards, title, token, channelId);
    }
  };

  getRedemptions = async (
    rewardId: string,
    status: RedemptionStatus,
    token: string,
    channelId: string,
    after?: string,
  ): Promise<any> => {
    const config = this.getCustomRewardsConfig(token, channelId);

    config.params['reward_id'] = rewardId;
    config.params.status = status;
    config.params.after = after;

    try {
      const { data } = await axios.get(ENDPOINTS.CUSTOM_REDEMPTIONS, config);

      return data;
    } catch (e) {
      console.log(e);
    }
  };

  getAllRedemptions = async (
    rewardId: string,
    status: RedemptionStatus,
    token: string,
    channelId: string,
    previousRedemptions: any[] = [],
    after?: string,
  ): Promise<any> => {
    const {
      data,
      pagination: { cursor },
    } = await this.getRedemptions(rewardId, status, token, channelId, after);

    if (data.length) {
      return this.getAllRedemptions(
        rewardId,
        status,
        token,
        channelId,
        [...previousRedemptions, ...data],
        cursor,
      );
    } else {
      return previousRedemptions;
    }
  };
}
