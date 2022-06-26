export interface TwitchPubSubMessage {
  type: string;
  error?: string;
  data: any;
  nonce: string;
}
