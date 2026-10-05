import { BookingRequest } from './types';

// In-memory bookings store with globalThis persistence for Next.js hot-reloading
const globalForBookings = globalThis as unknown as {
  memoryBookings: BookingRequest[] | undefined;
};

const initialBookings: BookingRequest[] = [
  {
    id: 'BK-108291',
    doctorId: 'doc-2',
    doctorName: 'Dr. Dawit Abebe, MD',
    customerName: 'Bethlehem Tadesse',
    customerPhone: '+251 91 184 9201',
    customerEmail: 'bethlehem.t@example.com',
    paymentMethod: 'cbe',
    transactionReference: 'FT2409823901',
    amount: 2800,
    currency: 'ETB',
    consultationDay: 'Wednesday',
    consultationMode: 'Video Consultation',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    confirmedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'BK-108292',
    doctorId: 'doc-4',
    doctorName: 'Dr. Bethlehem Mengistu, MD',
    customerName: 'Ermias Kebede',
    customerPhone: '+251 92 455 6789',
    customerEmail: 'ermias.kebede@example.com',
    paymentMethod: 'telebirr',
    transactionReference: 'TB98234710',
    amount: 2500,
    currency: 'ETB',
    consultationDay: 'Thursday',
    consultationMode: 'In-Person',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

let memoryBookings: BookingRequest[] = globalForBookings.memoryBookings ?? initialBookings;

if (process.env.NODE_ENV !== 'production') {
  globalForBookings.memoryBookings = memoryBookings;
}

export async function createBooking(
  data: Omit<BookingRequest, 'id' | 'status' | 'createdAt' | 'confirmedAt'>
): Promise<BookingRequest> {
  const booking: BookingRequest = {
    ...data,
    id: `BK-${Date.now().toString().slice(-6)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  memoryBookings.unshift(booking);
  return booking;
}

export async function getBookings(): Promise<BookingRequest[]> {
  return memoryBookings;
}

export async function getBookingById(id: string): Promise<BookingRequest | null> {
  return memoryBookings.find((b) => b.id === id) || null;
}

export async function getBookingsByEmail(email: string): Promise<BookingRequest[]> {
  return memoryBookings.filter(
    (b) => b.customerEmail.toLowerCase() === email.toLowerCase()
  );
}

export async function getConfirmedBooking(doctorId: string, email: string): Promise<BookingRequest | null> {
  return (
    memoryBookings.find(
      (b) =>
        b.doctorId === doctorId &&
        b.customerEmail.toLowerCase() === email.toLowerCase() &&
        b.status === 'confirmed'
    ) || null
  );
}

export async function confirmBooking(id: string): Promise<BookingRequest | null> {
  const index = memoryBookings.findIndex((b) => b.id === id);
  if (index === -1) return null;
  memoryBookings[index] = {
    ...memoryBookings[index],
    status: 'confirmed',
    confirmedAt: new Date().toISOString(),
  };
  return memoryBookings[index];
}

export async function rejectBooking(id: string): Promise<BookingRequest | null> {
  const index = memoryBookings.findIndex((b) => b.id === id);
  if (index === -1) return null;
  memoryBookings[index] = {
    ...memoryBookings[index],
    status: 'rejected',
  };
  return memoryBookings[index];
}
