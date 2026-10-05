import { NextRequest, NextResponse } from 'next/server';
import { confirmBooking, getBookingById } from '@/lib/bookings';

// POST /api/bookings/[id]/confirm — Admin confirms a pending booking
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await getBookingById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    if (existing.status === 'confirmed') {
      return NextResponse.json({ message: 'Booking already confirmed.', booking: existing });
    }

    const updated = await confirmBooking(id);
    return NextResponse.json({ message: 'Payment confirmed. Customer can now access contact info.', booking: updated });
  } catch (err) {
    console.error('Error confirming booking:', err);
    return NextResponse.json({ error: 'Failed to confirm booking.' }, { status: 500 });
  }
}
