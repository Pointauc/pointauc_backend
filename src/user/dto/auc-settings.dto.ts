export interface AucSettingsDto {
  startTime: number;
  timeStep: number;
  isAutoincrementActive: boolean;
  autoincrementTime: number;
  isBuyoutVisible: boolean;
  background: string | null;
  purchaseSort: number;
  marblesAuc: boolean;
  marbleRate: number;
  marbleCategory: number;
  maxTime: number;
  isMaxTimeActive: boolean;
}
