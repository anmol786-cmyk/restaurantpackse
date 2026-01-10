/**
 * WhatsApp Configuration Helper
 * Manages WhatsApp phone numbers and configuration from environment variables
 */

import type { WhatsAppConfig, WhatsAppMessageContext } from '@/types/whatsapp';

/**
 * Gets WhatsApp configuration from environment variables
 * @returns WhatsAppConfig object with phone numbers and business name
 */
export function getWhatsAppConfig(): WhatsAppConfig {
  return {
    phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '',
    businessName:
      process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NAME || 'Anmol Wholesale',
    contextPhones: {
      product: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_PRODUCT,
      orders: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_ORDERS,
      support: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_SUPPORT,
    },
  };
}

/**
 * Gets the appropriate WhatsApp phone number for the given context
 * Falls back to the default phone number if context-specific number is not set
 * @param context - The message context (product, orders, support)
 * @returns Phone number for the specified context
 */
export function getWhatsAppPhone(
  context: WhatsAppMessageContext = 'product'
): string {
  const config = getWhatsAppConfig();

  // Return context-specific phone if available
  if (context in (config.contextPhones || {})) {
    const contextPhone = config.contextPhones?.[context as keyof typeof config.contextPhones];
    if (contextPhone) return contextPhone;
  }

  // Fall back to default phone
  return config.phone;
}

/**
 * Validates that WhatsApp configuration is properly set
 * @returns true if configuration is valid, false otherwise
 */
export function validateWhatsAppConfig(): boolean {
  const config = getWhatsAppConfig();
  return config.phone.length > 0;
}

/**
 * Gets the business name from configuration
 * @returns Business name
 */
export function getWhatsAppBusinessName(): string {
  const config = getWhatsAppConfig();
  return config.businessName;
}
