import { NextRequest, NextResponse } from 'next/server';
import { rejectBooking, getBookingById } from '@/lib/bookings';

// POST /api/bookings/[id]/reject — Admin rejects a pending booking
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

    if (existing.status === 'rejected') {
      return NextResponse.json({ message: 'Booking already rejected.', booking: existing });
    }

    const updated = await rejectBooking(id);
    return NextResponse.json({ message: 'Booking rejected.', booking: updated });
  } catch (err) {
    console.error('Error rejecting booking:', err);
    return NextResponse.json({ error: 'Failed to reject booking.' }, { status: 500 });
  }
}
