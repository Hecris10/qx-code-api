export class UpdateQRCodeDto {
  type?: string;
  content?: string;
  ssid?: string;
  password?: string;
  link?: string;
  logoId?: number;
}
export class UpdatePartialQrCodeDto {
  type?: string;
  content?: string;
  ssid?: string;
  password?: string;
  link?: string;
  name?: string;
  text?: string;
  logoId?: number;
}
