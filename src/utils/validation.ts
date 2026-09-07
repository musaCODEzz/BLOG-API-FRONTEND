/**
 * Validation utility to ensure only real, valid email addresses are used.
 * Blocks malformed formats and disposable / temporary email domains.
 */

const BLOCKED_DISPOSABLE_DOMAINS = new Set([
  'tempmail.com',
  'throwaway.com',
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'trashmail.com',
  'sharklasers.com',
  'yopmail.com',
  'dispostable.com',
  'getairmail.com',
  'fake.com',
  'test.com',
  'temp-mail.org',
  'burnermail.io',
  'nada.ltd',
]);

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateRealEmail = (email: string): ValidationResult => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return { isValid: false, error: 'Email address is required.' };
  }

  // 1. Strict RFC 5322 regex format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address (e.g. name@gmail.com).',
    };
  }

  // 2. Extract domain
  const parts = cleanEmail.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid email structure.' };
  }
  const domain = parts[1];

  // 3. Block throwaway / temporary domains
  if (BLOCKED_DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Disposable or temporary email addresses are not allowed. Please use a real provider (Gmail, Outlook, Yahoo, Proton, etc.).',
    };
  }

  // 4. Ensure domain has a legitimate top-level domain (at least 2 letters)
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) {
    return {
      isValid: false,
      error: 'Please enter an email with a valid domain extension (.com, .org, .io, etc.).',
    };
  }

  return { isValid: true };
};
