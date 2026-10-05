export function formatFee(fee: number, currency: string = 'USD'): string {
  const curr = (currency || 'USD').toUpperCase();
  const formattedAmount = Number(fee || 0).toLocaleString();

  if (curr === 'ETB') {
    return `${formattedAmount} ETB`;
  }
  if (curr === 'USD') {
    return `$${formattedAmount} USD`;
  }
  return `${formattedAmount} ${curr}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return 'Protected Phone Number';
  // Keep country prefix if detectable, mask the rest
  const trimmed = phone.trim();
  if (trimmed.startsWith('+251')) {
    return '+251 9• ••• ••••';
  }
  if (trimmed.startsWith('+1')) {
    return '+1 (•••) •••-••••';
  }
  return '••••••••••••';
}

export function maskEmail(email: string): string {
  if (!email) return 'Protected Email Address';
  const parts = email.split('@');
  if (parts.length === 2) {
    const name = parts[0];
    const domain = parts[1];
    const visibleName = name.length > 2 ? `${name[0]}••••${name[name.length - 1]}` : '••••';
    const domainParts = domain.split('.');
    const ext = domainParts.length > 1 ? `.${domainParts[domainParts.length - 1]}` : '';
    return `${visibleName}@••••${ext}`;
  }
  return '••••••••@••••.com';
}

const CUSTOMER_EMAIL_KEY = 'healconnect_customer_email';

/**
 * Store the customer's email in localStorage after a booking is submitted.
 * This email is used to check unlock status via the API.
 */
export function setCustomerEmail(email: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOMER_EMAIL_KEY, email.toLowerCase());
  } catch {
    // localStorage unavailable
  }
}

/**
 * Retrieve the stored customer email for unlock checks.
 */
export function getCustomerEmail(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(CUSTOMER_EMAIL_KEY);
  } catch {
    return null;
  }
}

/**
 * Check if a doctor's contact info is unlocked for the current customer.
 * Calls the bookings API to verify admin-confirmed payment status.
 */
export async function checkDoctorUnlocked(doctorId: string): Promise<boolean> {
  const email = getCustomerEmail();
  if (!email) return false;
  try {
    const res = await fetch(`/api/bookings?doctorId=${doctorId}&email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.unlocked === true;
  } catch {
    return false;
  }
}
