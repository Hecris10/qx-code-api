export class CreateQRCodeDto {
  name: string;
  text?: string;
  type: string;
  content: string;
  ssid?: string;
  password?: string;
  security?: string;
  link?: string;
  isControlled?: boolean;
  expirationDate?: Date;
}

export class UpdateQRCodeDto {
  type?: string;
  content?: string;
  ssid?: string;
  password?: string;
  security?: string;
  link?: string;
  logoId?: number;
  backgroundColor?: string;
  padding?: number;
  logoBackgroundColor?: string;
  logoBorderRadius?: number;
  logoPadding?: number;
  qrCodeBorderRadius?: number;
  isControlled?: boolean;
  expirationDate?: Date;
}

export class LogoQRCodeDto {
  logoId: number;
}

export class UpdatePartialQRCodeDto {
  name: string;
  logoId?: number;
  backgroundColor?: string;
  padding?: number;
  logoBackgroundColor?: string;
  logoBorderRadius?: number;
  logoPadding?: number;
  cornerType: QrCodeCornerType;
  dotsType: QrCodeDotType;
  cornersColor: string;
  nodesColor: string;
  isControlled?: boolean;
  expirationDate?: Date;
}

export type QrCodeDotType =
  (typeof QrCodeDotTypes)[keyof typeof QrCodeDotTypes];

export type QrCodeCornerType =
  (typeof QrCodeCornerTypes)[keyof typeof QrCodeCornerTypes];

export const QrCodeDotTypes = {
  dot: 'dot',
  dotSmall: 'dot-small',
  tile: 'tile',
  rounded: 'rounded',
  square: 'square',
  diamond: 'diamond',
  star: 'star',
  fluid: 'fluid',
  fluidLine: 'fluid-line',
  stripe: 'stripe',
  stripeRow: 'stripe-row',
  stripeColumn: 'stripe-column',
} as const;

export const QrCodeCornerTypes = {
  square: 'square',
  rounded: 'rounded',
  circle: 'circle',
  roundedCircle: 'rounded-circle',
  circleRounded: 'circle-rounded',
  circleStar: 'circle-star',
  circleDiamond: 'circle-diamond',
} as const;
