export class CreateQrCodeControllerDto {
  qrCodeId: number;
  ip: string;
  userAgent: string;
  ip2: string;
  locale: string;
  referrer: string;
  screenResolution: string;
  timestamp: Date;
  pageUrl: string;
}

export class UpdateQrCodeControllerDto {
  qrCodeId?: number;
  ip?: string;
  userAgent?: string;
  ip2?: string;
  locale?: string;
  referrer?: string;
  screenResolution?: string;
  timestamp?: Date;
  pageUrl?: string;
}
