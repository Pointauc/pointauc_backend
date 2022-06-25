const bidsRoomPrefix = 'bids_';

export const getBidsRoom = (id: string): string => `${bidsRoomPrefix}${id}`;

export const isBidsRoom = (room: string): boolean =>
  room.startsWith(bidsRoomPrefix);

export const getIdFromBidsRoom = (room: string): string =>
  room.split(bidsRoomPrefix)[1];
