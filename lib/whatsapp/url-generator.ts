/**
 * WhatsApp URL Generator
 * Generates WhatsApp URLs with device detection and proper message encoding
 */

import type { DeviceType, WhatsAppUrlResult } from '@/types/whatsapp';
import {
  validateWhatsAppPhoneNumber,
  cleanPhoneNumber,
  validateMessageLength,
} from './validation';

/**
 * Detects if the user is on a mobile device
 * Uses navigator.userAgent for client-side detection
 * @returns Device type (mobile or desktop)
 */
export function detectDevice(): DeviceType {
  if (typeof window === 'undefined') {
    // Server-side: default to mobile for wa.me
    return 'mobile';
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Check for mobile patterns
  const mobilePatterns = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

  return mobilePatterns.test(userAgent.toLowerCase()) ? 'mobile' : 'desktop';
}

/**
 * Encodes a message for WhatsApp URL
 * Preserves WhatsApp markdown formatting (*bold*, ~strikethrough~)
 * Converts line breaks to %0A
 * @param message - Message to encode
 * @returns URL-encoded message
 */
export function encodeWhatsAppMessage(message: string): string {
  // First, ensure line breaks are normalized to \n
  const normalized = message.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Encode the entire message
  const encoded = encodeURIComponent(normalized);

  // The encodeURIComponent will handle line breaks properly
  // %0A is the encoded version of \n

  return encoded;
}

/**
 * Generates a WhatsApp URL based on device type
 * Mobile: wa.me format (opens in WhatsApp app)
 * Desktop: api.whatsapp.com format (opens in WhatsApp Web)
 * @param phone - Phone number (digits only, with country code)
 * @param message - Message to pre-fill
 * @param deviceType - Optional device type override
 * @returns WhatsApp URL Result with URL, message, and device type
 * @throws Error if phone number is invalid or message is too long
 */
export function generateWhatsAppUrl(
  phone: string,
  message: string,
  deviceType?: DeviceType
): WhatsAppUrlResult {
  // Clean phone number (remove spaces, hyphens, etc.)
  const cleanedPhone = cleanPhoneNumber(phone);

  // Validate phone number
  if (!validateWhatsAppPhoneNumber(cleanedPhone)) {
    throw new Error(
      'Invalid phone number format. Must be 10-15 digits with country code (no + or spaces)'
    );
  }

  // Validate message length
  if (!validateMessageLength(message)) {
    throw new Error(
      'Message is too long. Maximum length is 4000 characters.'
    );
  }

  // Detect device if not provided
  const device = deviceType || detectDevice();

  // Encode message for URL
  const encodedMessage = encodeWhatsAppMessage(message);

  // Build URL based on device type
  let url: string;

  if (device === 'mobile') {
    // Mobile: Use wa.me format
    // Format: https://wa.me/{phone}?text={message}
    url = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
  } else {
    // Desktop: Use api.whatsapp.com format
    // Format: https://api.whatsapp.com/send?phone={phone}&text={message}
    url = `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${encodedMessage}`;
  }

  return {
    url,
    message,
    deviceType: device,
  };
}

/**
 * Truncates a message to fit within WhatsApp URL limits
 * Adds "... (view full details in order link)" if truncated
 * @param message - Message to truncate
 * @param orderUrl - Optional order URL to append
 * @param maxLength - Maximum message length (default 3800 to leave room for suffix)
 * @returns Truncated message
 */
export function truncateMessage(
  message: string,
  orderUrl?: string,
  maxLength: number = 3800
): string {
  if (message.length <= maxLength) {
    return message;
  }

  const suffix = orderUrl
    ? `\n\n... (message truncated)\n\nView full order details: ${orderUrl}`
    : '\n\n... (message truncated)';

  const truncateAt = maxLength - suffix.length;
  const truncated = message.substring(0, truncateAt);

  return truncated + suffix;
}

/**
 * Validates and generates WhatsApp URL with error handling
 * Returns null instead of throwing if invalid
 * @param phone - Phone number
 * @param message - Message content
 * @param deviceType - Optional device type
 * @returns WhatsApp URL result or null if invalid
 */
export function safeGenerateWhatsAppUrl(
  phone: string,
  message: string,
  deviceType?: DeviceType
): WhatsAppUrlResult | null {
  try {
    return generateWhatsAppUrl(phone, message, deviceType);
  } catch (error) {
    console.error('Failed to generate WhatsApp URL:', error);
    return null;
  }
}
