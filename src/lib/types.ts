export interface Doctor {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  specializations: string[];
  experience: number; // in years
  education: string;
  hospitalAffiliation?: string | null;
  location: string;
  consultationFee: number;
  currency: string;
  availableDays: string[];
  availableHours: string;
  consultationModes: string[];
  languages: string[];
  image: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPERADMIN';
}

export interface BookingRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: 'cbe' | 'abyssinia' | 'telebirr';
  transactionReference: string;
  amount: number;
  currency: string;
  consultationDay: string;
  consultationMode: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
  confirmedAt?: string;
}

export interface PaymentAccount {
  name: string;
  label: string;
  accountName: string;
  accountNumber: string;
  icon: string;
}

export interface DoctorFilterOptions {
  search?: string;
  specialization?: string;
  location?: string;
  maxFee?: number;
  mode?: string;
  day?: string;
  currency?: string;
}
