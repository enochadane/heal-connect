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

const STORAGE_PREFIX = 'healconnect_paid_doc_';

export function isDoctorUnlocked(doctorId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${doctorId}`) === 'true';
  } catch {
    return false;
  }
}

export function unlockDoctor(doctorId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${doctorId}`, 'true');
    window.dispatchEvent(new Event('healconnect_doctor_unlocked'));
  } catch (err) {
    console.error('Failed to save unlocked doctor:', err);
  }
}
