import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TwilioNotificator {
  constructor() {}
  async sendSMS(message) {
    Logger.log(`Task status updated: ${message}`);
  }
}
