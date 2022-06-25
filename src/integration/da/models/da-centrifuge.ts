import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import Centrifuge = require('centrifuge');
import { WebSocket } from 'ws';
import { DaCentrifugeDonationEvent } from '../dto/da-donation.dto';

const DA_CENTRIFUGE_URL =
  'wss://centrifugo.donationalerts.com/connection/websocket';
const DA_SUBSCRIBE_URL =
  'https://www.donationalerts.com/api/v1/centrifuge/subscribe';
const RECONNECTION_DELAY_MIN = 1000;
const RECONNECTION_DELAY_MAX = 5000;

@Injectable()
export class DaCentrifuge {
  $donation = new Subject<DaCentrifugeDonationEvent>();
  private centrifugeClient?: Centrifuge;

  constructor(private daSocketConnectionToken: string, private id: string) {}

  async connect(accessToken: string) {
    console.log('centrifuge connect');
    this.closeConnection();

    return new Promise((resolve, reject) => {
      this.centrifugeClient = new Centrifuge(DA_CENTRIFUGE_URL, {
        subscribeEndpoint: DA_SUBSCRIBE_URL,
        subscribeHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        minRetry: RECONNECTION_DELAY_MIN,
        maxRetry: RECONNECTION_DELAY_MAX,
        websocket: WebSocket,
      });

      this.centrifugeClient.setToken(this.daSocketConnectionToken);

      this.centrifugeClient.on('connect', () => {
        console.log('connect');
      });
      this.centrifugeClient.on('disconnect', (err) => {
        console.log('disconnect');
        reject(err);
      });
      this.centrifugeClient.on('error', (err) => {
        console.log('error');
        reject(err);
      });

      this.centrifugeClient.connect();

      const subCallbacks = {
        publish: (message?: any) => {
          if (message?.data?.message_type) {
            this.$donation.next({ ...message, authId: this.id });
          }
        },
        join: () => {
          console.log('channel join');
        },
        subscribe: () => {
          console.log('channel subscribe');
          resolve(true);
        },
        error: (err: unknown) => {
          console.log('channel subscribe error');
          reject(err);
        },
        unsubscribe: () => {
          console.log('channel unsubscribe');
        },
      };

      this.centrifugeClient.subscribe(
        `$alerts:donation_${this.id}`,
        subCallbacks,
      );
    });
  }

  closeConnection() {
    this.centrifugeClient?.disconnect();
  }
}
