import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
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

  async sendAdminAlert(subject: string, text: string): Promise<void> {
    const configuredRecipientsRaw =
      this.configService.get<string>('ADMIN_ALERT_EMAILS') || '';

    const configuredRecipients = configuredRecipientsRaw
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

    let recipients = [...new Set(configuredRecipients)];

    if (!recipients.length) {
      const admins = await this.prisma.admin.findMany({
        select: { email: true },
      });
      recipients = Array.from(
        new Set(
          admins
            .map((admin) => admin.email?.trim())
            .filter((email): email is string => !!email),
        ),
      );
    }

    if (!recipients.length) {
      const fallback = this.configService.get<string>('ADMIN_EMAIL') || '';
      recipients = fallback
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);
    }

    if (!recipients.length) {
      this.logger.warn(
        'Admin alert email recipients are not configured. Set ADMIN_EMAIL / ADMIN_ALERT_EMAILS or ensure an admin has an email.',
      );
      return;
    }

    await this.sendMail(recipients.join(','), subject, text);
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
