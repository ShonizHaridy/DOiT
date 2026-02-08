import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('MAIL_HOST');
    const port = Number(this.configService.get<string>('MAIL_PORT') ?? 587);
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASSWORD');
    this.from =
      this.configService.get<string>('MAIL_FROM') ?? 'DOiT <noreply@doit.com>';

    if (!host || !user || !pass) {
      this.logger.warn(
        'Email transport not configured. Set MAIL_HOST/MAIL_USER/MAIL_PASSWORD.',
      );
      this.transporter = null;
      return;
    }

    const options: SMTPTransport.Options = {
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    };

    this.transporter = nodemailer.createTransport(options);
  }

  async sendOtp(
    to: string,
    code: string,
    expiresInMinutes: number,
  ): Promise<void> {
    const subject = 'Your DOiT OTP Code';
    const text = `Your DOiT OTP code is ${code}. It expires in ${expiresInMinutes} minutes.`;
    await this.sendMail(to, subject, text);
  }

  async sendAdminResetCode(to: string, code: string): Promise<void> {
    const subject = 'Your DOiT Admin Reset Code';
    const text = `Your DOiT admin reset code is ${code}.`;
    await this.sendMail(to, subject, text);
  }

  private async sendMail(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email transport is not configured');
    }

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      text,
    });
  }
}
