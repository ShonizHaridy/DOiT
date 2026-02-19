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

  async sendPopupOfferEmail(
    to: string,
    payload: {
      amount: number;
      amountLabel?: string;
      voucherCode: string;
      headline?: string;
      subHeadline?: string;
    },
  ): Promise<void> {
    const normalizedCode = payload.voucherCode.trim().toUpperCase();
    const normalizedAmount = Number(payload.amount);
    const explicitAmountLabel = payload.amountLabel?.trim();
    const amountLabel = explicitAmountLabel
      ? explicitAmountLabel
      : Number.isFinite(normalizedAmount) && normalizedAmount > 0
      ? `${normalizedAmount}% Off`
      : 'Special Offer';
    const headline = payload.headline?.trim() || 'Your Discount Expires Soon!';
    const subHeadline =
      payload.subHeadline?.trim() ||
      "Don't miss out. Complete your purchase now and save big.";
    const ctaUrl =
      this.configService.get<string>('FRONTEND_URL') ?? 'https://doit.com';

    const subject = 'Your Discount Expires Soon!';
    const text = [
      headline,
      '',
      subHeadline,
      '',
      `LIMITED TIME OFFER - HURRY!`,
      amountLabel,
      `Code: ${normalizedCode}`,
      '',
      `Complete purchase: ${ctaUrl}`,
    ].join('\n');

    const html = `
      <div style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;padding:28px;">
          <h1 style="margin:0 0 14px;font-size:34px;line-height:1.2;text-align:center;font-weight:700;">${this.escapeHtml(
            headline,
          )}</h1>
          <p style="margin:0 0 22px;text-align:center;font-size:20px;line-height:1.5;color:#374151;">${this.escapeHtml(
            subHeadline,
          )}</p>

          <div style="border:2px solid #111827;border-radius:12px;padding:18px;text-align:center;margin:0 0 20px;">
            <p style="margin:0 0 10px;font-size:18px;font-weight:700;color:#111827;">LIMITED TIME OFFER - HURRY!</p>
            <p style="margin:0 0 12px;font-size:44px;line-height:1.1;font-weight:800;color:#111827;">${this.escapeHtml(
              amountLabel,
            )}</p>
            <div style="display:inline-block;border:2px dashed #9ca3af;border-radius:10px;padding:12px 18px;background:#f9fafb;">
              <span style="font-size:30px;letter-spacing:1px;font-weight:700;color:#111827;">${this.escapeHtml(
                normalizedCode,
              )}</span>
            </div>
            <p style="margin:12px 0 0;font-size:20px;color:#374151;">Use this code at checkout before it's gone.</p>
          </div>

          <div style="text-align:center;margin:0 0 20px;">
            <a href="${this.escapeHtml(
              ctaUrl,
            )}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:18px 28px;border-radius:10px;font-size:24px;font-weight:700;">Complete Purchase Now</a>
          </div>

          <p style="margin:0;text-align:center;font-size:18px;line-height:1.6;color:#111827;">
            Your discount code expires soon. Do not miss this opportunity to save on your favorite products.
          </p>
        </div>
      </div>
    `;

    await this.sendMail(to, subject, text, html);
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email transport is not configured');
    }

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      text,
      html,
    });
  }
}
