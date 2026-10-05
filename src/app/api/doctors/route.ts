import { NextRequest, NextResponse } from 'next/server';
import { getDoctors, createDoctor, getAllDoctorsForAdmin } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('all') === 'true';

    if (isAdmin) {
      const session = await getAdminSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const allDoctors = await getAllDoctorsForAdmin();
      return NextResponse.json({ doctors: allDoctors });
    }

    const search = searchParams.get('search') || undefined;
    const specialization = searchParams.get('specialization') || undefined;
    const location = searchParams.get('location') || undefined;
    const maxFee = searchParams.get('maxFee') ? Number(searchParams.get('maxFee')) : undefined;
    const mode = searchParams.get('mode') || undefined;
    const day = searchParams.get('day') || undefined;
    const currency = searchParams.get('currency') || undefined;

    const doctors = await getDoctors({
      search,
      specialization,
      location,
      maxFee,
      mode,
      day,
      currency,
    });

    return NextResponse.json({ doctors });
  } catch (err: any) {
    console.error('Error fetching doctors:', err);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();

    // Validation
    if (!body.name || !body.email || !body.phone || !body.bio) {
      return NextResponse.json(
        { error: 'Name, email, phone, and bio are required fields.' },
        { status: 400 }
      );
    }

    const doctor = await createDoctor({
      name: body.name,
      title: body.title || 'Consultant Psychiatrist',
      email: body.email,
      phone: body.phone,
      bio: body.bio,
      specializations: Array.isArray(body.specializations)
        ? body.specializations
        : body.specializations
        ? body.specializations.split(',').map((s: string) => s.trim())
        : ['General Psychiatry'],
      experience: Number(body.experience) || 5,
      education: body.education || 'MD in Psychiatry',
      hospitalAffiliation: body.hospitalAffiliation || null,
      location: body.location || 'Telehealth Available',
      consultationFee: Number(body.consultationFee) || 150,
      currency: body.currency || 'USD',
      availableDays: Array.isArray(body.availableDays)
        ? body.availableDays
        : body.availableDays
        ? body.availableDays.split(',').map((s: string) => s.trim())
        : ['Monday', 'Wednesday', 'Friday'],
      availableHours: body.availableHours || '9:00 AM - 5:00 PM',
      consultationModes: Array.isArray(body.consultationModes)
        ? body.consultationModes
        : ['Phone Call', 'Email', 'Video Consultation'],
      languages: Array.isArray(body.languages)
        ? body.languages
        : body.languages
        ? body.languages.split(',').map((s: string) => s.trim())
        : ['English'],
      image: body.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
      isVerified: body.isVerified !== undefined ? Boolean(body.isVerified) : true,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : false,
    });

    return NextResponse.json({ success: true, doctor }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating doctor:', err);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
