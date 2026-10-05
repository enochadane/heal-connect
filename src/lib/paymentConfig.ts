/**
 * Payment Configuration
 * 
 * Configurable bank/mobile money accounts for manual transfer payments.
 * Real details can be configured via environment variables.
 */

export const PAYMENT_ACCOUNTS = {
  cbe: {
    name: 'cbe',
    label: 'Commercial Bank of Ethiopia (CBE)',
    accountName: process.env.NEXT_PUBLIC_CBE_ACCOUNT_NAME || 'HealConnect Health Services',
    accountNumber: process.env.NEXT_PUBLIC_CBE_ACCOUNT_NUMBER || '1000458921045',
    icon: 'building',
  },
  abyssinia: {
    name: 'abyssinia',
    label: 'Bank of Abyssinia',
    accountName: process.env.NEXT_PUBLIC_ABYSSINIA_ACCOUNT_NAME || 'HealConnect Health Services',
    accountNumber: process.env.NEXT_PUBLIC_ABYSSINIA_ACCOUNT_NUMBER || '84920184',
    icon: 'landmark',
  },
  telebirr: {
    name: 'telebirr',
    label: 'Telebirr',
    accountName: process.env.NEXT_PUBLIC_TELEBIRR_ACCOUNT_NAME || 'HealConnect Health Services',
    accountNumber: process.env.NEXT_PUBLIC_TELEBIRR_PHONE || '0911849201',
    icon: 'smartphone',
  },
} as const;

export type PaymentMethodKey = keyof typeof PAYMENT_ACCOUNTS;
