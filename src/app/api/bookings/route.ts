import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getBookings, getConfirmedBooking } from '@/lib/bookings';
import { getDoctorById } from '@/lib/db';

// POST /api/bookings — Submit a new booking request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      doctorId,
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      transactionReference,
      consultationDay,
      consultationMode,
    } = body;

    if (!doctorId || !customerName || !customerPhone || !customerEmail || !paymentMethod || !transactionReference) {
      return NextResponse.json(
        { error: 'All fields are required: doctorId, customerName, customerPhone, customerEmail, paymentMethod, transactionReference.' },
        { status: 400 }
      );
    }

    // Validate payment method
    const validMethods = ['cbe', 'abyssinia', 'telebirr'];
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method. Must be one of: cbe, abyssinia, telebirr.' },
        { status: 400 }
      );
    }

    // Get doctor to include name and fee info
    const doctor = await getDoctorById(doctorId);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found.' }, { status: 404 });
    }

    const booking = await createBooking({
      doctorId,
      doctorName: doctor.name,
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      transactionReference,
      amount: doctor.consultationFee,
      currency: doctor.currency,
      consultationDay: consultationDay || '',
      consultationMode: consultationMode || '',
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error('Error creating booking:', err);
    return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 });
  }
}

// GET /api/bookings — List all bookings (admin) or check status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('doctorId');
  const email = searchParams.get('email');

  // Check if a specific doctor is unlocked for a customer
  if (doctorId && email) {
    const confirmed = await getConfirmedBooking(doctorId, email);
    return NextResponse.json({
      unlocked: !!confirmed,
      booking: confirmed || null,
    });
  }

  // Otherwise return all bookings (for admin)
  const bookings = await getBookings();
  return NextResponse.json({ bookings });
}
