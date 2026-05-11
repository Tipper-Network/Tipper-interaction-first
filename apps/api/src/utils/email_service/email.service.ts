// src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

export interface EmailTemplate {
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend = new Resend(process.env.RESEND_API_KEY);

  /**
   * Sends a short-lived email verification code to a user via Resend.
   *
   * @param email - Recipient email address.
   * @param code - Verification code to include in the email body.
   * @returns The Resend send result.
   * @throws Any error thrown by the Resend client.
   */
  async sendVerificationCode(email: string, code: string) {
    this.logger.log(`Starting email verification process for: ${email}`);

    try {
      this.logger.debug(`Sending verification code to ${email} via Resend`);

      const result = await this.resend.emails.send({
        from: ' Tipper Verification <psyfer@tippernetwork.com>',
        to: email,
        subject: 'Your Verification Code',
        html: `
        <p>Your verification code is:</p>
        <h2>${code}</h2>
        <p>This code will expire in 1 hour.</p>
      `,
      });

      this.logger.log(
        `Email verification sent successfully to ${email}. Resend ID: ${result.data?.id}`,
      );
      this.logger.debug(
        `Email details - From: psyfer@tippernetwork.com, Subject: Your Verification Code`,
      );

      return result;
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw error;
    }
  }

  /**
   * Sends an email using a template and a variable map.
   *
   * Variables are substituted in both `subject` and `html` using `{{ key }}` placeholders.
   *
   * @param to - Recipient email address.
   * @param template - Subject/HTML template.
   * @param variables - Placeholder values to interpolate.
   * @returns The Resend send result.
   * @throws Any error thrown by the Resend client.
   */
  async sendEmail(
    to: string,
    template: EmailTemplate,
    variables: Record<string, string | number> = {},
  ) {
    this.logger.log(`Sending email to: ${to}`);

    try {
      let html = template.html;
      let subject = template.subject;
      // Replace variables in both subject and HTML
      Object.keys(variables).forEach((key) => {
        // Properly escape curly braces in regex: {{key}} becomes \{\{key\}\}
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        const value = String(variables[key] || '');
        html = html.replace(regex, value);
        subject = subject.replace(regex, value);
      });

      const result = await this.resend.emails.send({
        from: 'Psyfer from Tipper <psyfer@tippernetwork.com>',
        to,
        subject: subject,
        html,
      });

      this.logger.log(`Email sent to ${to}. Resend ID: ${result.data?.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw error;
    }
  }
}
