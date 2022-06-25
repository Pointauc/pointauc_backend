import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { WebSocket, MessageEvent } from 'ws';
import { ITwitchRedemption } from '../dto/twitch-redemption.dto';

export const TWITCH_TOPICS = {
  REDEMPTIONS: 'channel-points-channel-v1',
};

export enum REQUEST_MESSAGE_TYPE {
  LISTEN = 'LISTEN',
  UNLISTEN = 'UNLISTEN',
  PING = 'PING',
}

interface TwitchPubSubRequestMessageInterface {
  type: REQUEST_MESSAGE_TYPE;
  data?: {
    [k: string]: string;
  };
}

const PING_INTERVAL = 1000 * 10;

@Injectable()
export class TwitchPubSubService {
  private ws?: WebSocket;
  private pingHandle?: NodeJS.Timeout;

  $redemption = new Subject<ITwitchRedemption>();

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket('wss://pubsub-edge.twitch.tv');

      console.log('[TwitchPubSub] connecting');
      const resolveEmpty = () => resolve(null);

      this.ws.onopen = this.onOpen.bind(this, resolveEmpty);
      this.ws.onerror = this.onPubSubError;
      this.ws.onmessage = this.onPubSubResponse;
      this.ws.onclose = this.onPubSubClose.bind(this, reject);
    });
  }

  async listen(
    channelId: string,
    accessToken: string,
    topic = TWITCH_TOPICS.REDEMPTIONS,
  ) {
    console.log(`listen ${topic}.${channelId}`);

    if (!this.ws) {
      await this.connect();
    }

    this.sendMessage(REQUEST_MESSAGE_TYPE.LISTEN, {
      topics: [`${topic}.${channelId}`],
      auth_token: accessToken,
    });
  }

  unlisten(
    channelId: string,
    accessToken: string,
    topic = TWITCH_TOPICS.REDEMPTIONS,
  ) {
    console.log(`unlisten ${topic}.${channelId}`);

    this.sendMessage(REQUEST_MESSAGE_TYPE.UNLISTEN, {
      topics: [`${topic}.${channelId}`],
      auth_token: accessToken,
    });
  }

  private pingConnection = () => {
    this.sendMessage(REQUEST_MESSAGE_TYPE.PING);
  };

  private onOpen = (resolve: () => void) => {
    console.log('opened');
    this.pingConnection();
    this.pingHandle = setInterval(this.pingConnection, PING_INTERVAL);
    resolve();
  };

  private sendMessage(type: REQUEST_MESSAGE_TYPE, payload?: any) {
    const message: TwitchPubSubRequestMessageInterface = {
      type: type,
    };
    if (payload) {
      message.data = {
        ...payload,
      };
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private onPubSubError = (error: any) => {
    console.log(error);
  };

  private onPubSubClose = (reject: any) => {
    if (this.pingHandle) {
      clearInterval(this.pingHandle);
    }
    reject();
  };

  private onPubSubResponse = (event: MessageEvent) => {
    const twitchPubSubMessage = JSON.parse(event.data as string);
    const { data } = twitchPubSubMessage;
    console.log(`[PubSub Response Type] ${twitchPubSubMessage.type}`);

    if (twitchPubSubMessage.error === 'ERR_BADAUTH') {
      console.log(twitchPubSubMessage);
      return;
    }

    if (data && twitchPubSubMessage.type === 'Message') {
      this.handleMessage(data.topic, JSON.parse(data.message));
    }
  };

  private handleMessage(topic: string, message: any) {
    const [type] = topic.split('.');

    if (type === 'channel-points-channel-v1') {
      this.$redemption.next(message.data);
    }
  }
}
