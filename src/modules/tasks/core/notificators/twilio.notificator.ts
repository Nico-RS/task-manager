export interface ITwilioNotificator {
  sendSMS(message: string): Promise<void>;
}
