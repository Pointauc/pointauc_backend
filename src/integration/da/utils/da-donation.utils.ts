import { DaDonationData } from '../dto/da-donation.dto';
import { IBid } from '../../abstract/dto/bids.dto';

export const getBidFromDaDonation = ({
  id,
  username,
  message,
  created_at,
  amount_in_user_currency,
}: DaDonationData): IBid => {
  return {
    id: id.toString(),
    username,
    message,
    timestamp: created_at,
    cost: Math.round(amount_in_user_currency),
    color: '#000000',
    isDonation: true,
  };
};
