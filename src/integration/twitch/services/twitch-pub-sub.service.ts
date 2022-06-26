import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { WebSocket, MessageEvent } from 'ws';
import { ITwitchRedemption } from '../dto/twitch-redemption.dto';
import { TwitchPubSubMessage } from '../dto/twitch-pub-sub.dto';

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
  nonce: string;
  data?: {
    [k: string]: string;
  };
}

interface Callbacks {
  onSuccess: (data: TwitchPubSubMessage) => void;
  onError: () => void;
}

const PING_INTERVAL = 1000 * 10;
const SOCKET_MAX_LISTENERS = 45;

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

      this.ws.addEventListener('open', this.onOpen.bind(this, resolveEmpty));
      this.ws.addEventListener('error', this.onPubSubError);
      this.ws.addEventListener('message', this.onPubSubResponse);
      this.ws.addEventListener('close', this.onPubSubClose.bind(this, reject));
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

    return new Promise((resolve, reject) => {
      this.sendMessage(
        REQUEST_MESSAGE_TYPE.LISTEN,
        {
          topics: [`${topic}.${channelId}`],
          auth_token: accessToken,
        },
        { onError: reject, onSuccess: resolve },
      );
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

  private sendMessage(
    type: REQUEST_MESSAGE_TYPE,
    payload?: any,
    callbacks?: Callbacks,
  ) {
    const nonce = Math.random().toString();
    const message: TwitchPubSubRequestMessageInterface = {
      type: type,
      nonce,
    };
    if (payload) {
      message.data = {
        ...payload,
      };
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (callbacks) {
        const { onSuccess, onError } = callbacks;
        const callback = (event: MessageEvent) => {
          const data = this.parsePubSubResponse(event);

          if (data.nonce === nonce) {
            data.error ? onError() : onSuccess(data);
            this.ws.removeEventListener('message', callback);
          }
        };

        this.ws.addEventListener('message', callback);
      }

      this.ws.send(JSON.stringify(message));
    }
  }

  private onPubSubError = (error: any) => {
    console.log(error);
  };

  private onPubSubClose = (reject: any) => {
    console.log('twitch pub sub closed');
    if (this.pingHandle) {
      clearInterval(this.pingHandle);
    }
    this.ws = undefined;
    reject();
  };

  private parsePubSubResponse = (event: MessageEvent): TwitchPubSubMessage => {
    return JSON.parse(event.data as string);
  };

  private onPubSubResponse = (event: MessageEvent) => {
    const twitchPubSubMessage = this.parsePubSubResponse(event);
    const { data, type, error } = twitchPubSubMessage;
    // console.log(twitchPubSubMessage);
    console.log(`[PubSub Response Type] ${type}`);

    if (error === 'ERR_BADAUTH') {
      console.log(twitchPubSubMessage);
      return;
    }

    if (data && type === 'MESSAGE') {
      this.handleMessage(data.topic, JSON.parse(data.message));
    }
  };

  private handleMessage(topic: string, message: any) {
    const [type] = topic.split('.');

    if (type === 'channel-points-channel-v1') {
      this.$redemption.next(message.data.redemption);
    }
  }
}
