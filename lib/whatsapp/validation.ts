/**
 * WhatsApp Order Validation Functions
 * Validates customer data and shipping addresses before order creation
 */

import type {
  ValidationResult,
  WhatsAppCustomerData,
  WhatsAppShippingAddress,
} from '@/types/whatsapp';

/**
 * Validates customer data (name, email, phone)
 * @param data - Customer data to validate
 * @returns Validation result with errors if any
 */
export function validateCustomerData(
  data: Partial<WhatsAppCustomerData>
): ValidationResult {
  const errors: string[] = [];

  if (!data.firstName?.trim()) {
    errors.push('First name is required');
  }

  if (!data.lastName?.trim()) {
    errors.push('Last name is required');
  }

  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.phone?.trim()) {
    errors.push('Phone number is required');
  } else if (!isValidPhone(data.phone)) {
    errors.push('Valid phone number is required (10-15 digits)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates shipping address data
 * @param data - Shipping address to validate
 * @returns Validation result with errors if any
 */
export function validateShippingAddress(
  data: Partial<WhatsAppShippingAddress>
): ValidationResult {
  const errors: string[] = [];

  if (!data.address_1?.trim()) {
    errors.push('Street address is required');
  }

  if (!data.city?.trim()) {
    errors.push('City is required');
  }

  if (!data.postcode?.trim()) {
    errors.push('Postcode is required');
  }

  if (!data.country?.trim()) {
    errors.push('Country is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns true if email is valid
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone number format
 * Accepts international format with or without + prefix
 * Must be 10-15 digits
 * @param phone - Phone number to validate
 * @returns true if phone is valid
 */
function isValidPhone(phone: string): boolean {
  // Remove spaces, hyphens, parentheses, and plus sign
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');

  // Check if it contains only digits and has appropriate length
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * Validates phone number for WhatsApp URL (must be digits only, no + or spaces)
 * @param phone - Phone number to validate
 * @returns true if phone number is valid for WhatsApp
 */
export function validateWhatsAppPhoneNumber(phone: string): boolean {
  // WhatsApp phone numbers must be digits only, 10-15 characters
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Cleans phone number for WhatsApp URL
 * Removes +, spaces, hyphens, parentheses
 * @param phone - Phone number to clean
 * @returns Cleaned phone number (digits only)
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)\+]/g, '');
}

/**
 * Validates that a message is not too long for WhatsApp URL
 * WhatsApp URL has a limit of approximately 4096 characters
 * @param message - Message to validate
 * @returns true if message length is acceptable
 */
export function validateMessageLength(message: string): boolean {
  const MAX_LENGTH = 4000; // Conservative limit to account for URL encoding
  return message.length <= MAX_LENGTH;
}
