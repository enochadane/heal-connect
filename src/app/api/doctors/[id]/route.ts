import { NextRequest, NextResponse } from 'next/server';
import { getDoctorById, updateDoctor, deleteDoctor } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { getConfirmedBooking } from '@/lib/bookings';
import { maskPhone, maskEmail } from '@/lib/formatters';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const doctor = await getDoctorById(id);

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const session = await getAdminSession();

    let isUnlocked = Boolean(session);
    if (!isUnlocked && email) {
      const confirmed = await getConfirmedBooking(id, email);
      if (confirmed) isUnlocked = true;
    }

    if (!isUnlocked) {
      return NextResponse.json({
        doctor: {
          ...doctor,
          phone: maskPhone(doctor.phone),
          email: maskEmail(doctor.email),
        },
      });
    }

    return NextResponse.json({ doctor });
  } catch (err: any) {
    console.error('Error fetching doctor:', err);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await updateDoctor(id, {
      ...body,
      ...(body.experience !== undefined && { experience: Number(body.experience) }),
      ...(body.consultationFee !== undefined && { consultationFee: Number(body.consultationFee) }),
      ...(body.specializations && !Array.isArray(body.specializations) && {
        specializations: body.specializations.split(',').map((s: string) => s.trim()),
      }),
      ...(body.availableDays && !Array.isArray(body.availableDays) && {
        availableDays: body.availableDays.split(',').map((s: string) => s.trim()),
      }),
      ...(body.languages && !Array.isArray(body.languages) && {
        languages: body.languages.split(',').map((s: string) => s.trim()),
      }),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, doctor: updated });
  } catch (err: any) {
    console.error('Error updating doctor:', err);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteDoctor(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting doctor:', err);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
