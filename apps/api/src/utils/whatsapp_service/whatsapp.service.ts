// src/whatsapp/whatsapp.service.ts
import { Injectable, Logger } from '@nestjs/common';

export interface WhatsAppMessage {
  to: string; // Phone number in E.164 format (e.g., +1234567890)
  message: string;
  templateId?: string; // For template messages
  variables?: Record<string, string>; // Template variables
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  /**
   * Sends a WhatsApp message (placeholder implementation).
   *
   * TODO: Implement WhatsApp Cloud API integration.
   *
   * @param message - Destination and message payload.
   * @throws Error currently always throws because the integration is not implemented yet.
   */
  async sendMessage(message: WhatsAppMessage): Promise<void> {
    this.logger.log(
      `[PLACEHOLDER] Would send WhatsApp message to: ${message.to}`,
    );
    this.logger.debug(`[PLACEHOLDER] Message: ${message.message}`);

    // TODO: Implement WhatsApp Cloud API integration
    // Example structure:
    // 1. Initialize WhatsApp Cloud API client
    // 2. Format phone number to E.164
    // 3. Send message via API
    // 4. Handle errors and retries
    // 5. Log success/failure

    // Placeholder implementation - will be replaced with actual WhatsApp API
    await Promise.resolve();
    throw new Error('WhatsApp service not yet implemented');
  }

  /**
   * Sends a partnership invitation message via WhatsApp.
   *
   * Currently delegates to {@link sendMessage}, so it will also throw until WhatsApp integration is implemented.
   *
   * @param phoneNumber - Recipient phone number (expected E.164).
   * @param inviterName - Name of the inviter to include in the message.
   * @param invitationLink - Deep link / URL to view the invitation.
   * @param note - Optional note from the inviter.
   */
  async sendPartnershipInvitation(
    phoneNumber: string,
    inviterName: string,
    invitationLink: string,
    note?: string,
  ): Promise<void> {
    const message = `Hello! ${inviterName} has invited you to partner on Tipper.\n\n${
      note ? `${note}\n\n` : ''
    }View and respond to the invitation: ${invitationLink}`;

    await this.sendMessage({
      to: phoneNumber,
      message,
    });
  }

  /**
   * Formats a phone number to E.164.
   *
   * TODO: Implement phone number validation and formatting.
   *
   * @param phone - Raw phone number string.
   * @returns Phone number string (currently returned unchanged).
   */
  private formatPhoneNumber(phone: string): string {
    // TODO: Implement phone number formatting
    // Remove spaces, dashes, parentheses
    // Add country code if missing
    // Validate format
    return phone;
  }
}
