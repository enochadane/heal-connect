import { Doctor, DoctorFilterOptions } from './types';
import { INITIAL_DOCTORS } from './mockData';
import { prisma } from './prisma';

// In-memory runtime cache/store to allow instant zero-config experience while Neon DB is configured
let memoryDoctors: Doctor[] = [...INITIAL_DOCTORS];

const isDatabaseConfigured = () => {
  return Boolean(
    prisma &&
    process.env.DATABASE_URL && 
    !process.env.DATABASE_URL.includes('user:password@endpoint.neon.tech') &&
    process.env.DATABASE_URL.startsWith('postgres')
  );
};

export async function getDoctors(options: DoctorFilterOptions = {}): Promise<Doctor[]> {
  const { search, specialization, location, maxFee, mode, day } = options;

  if (isDatabaseConfigured()) {
    try {
      const where: Record<string, any> = { isActive: true };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { education: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (specialization && specialization !== 'All Specializations') {
        where.specializations = { has: specialization };
      }

      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }

      if (maxFee) {
        where.consultationFee = { lte: Number(maxFee) };
      }

      if (mode && mode !== 'All Modes') {
        where.consultationModes = { has: mode };
      }

      if (day && day !== 'All Days') {
        where.availableDays = { has: day };
      }

      const dbDoctors = await prisma.doctor.findMany({
        where,
        orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
      });

      if (dbDoctors && dbDoctors.length > 0) {
        return dbDoctors.map((doc: any) => ({
          ...doc,
          createdAt: typeof doc.createdAt === 'object' ? doc.createdAt.toISOString() : doc.createdAt,
          updatedAt: typeof doc.updatedAt === 'object' ? doc.updatedAt.toISOString() : doc.updatedAt,
        }));
      }
    } catch (err) {
      console.warn('[DB] Prisma query failed, falling back to memory store:', err);
    }
  }

  // Fallback to memory store
  let filtered = [...memoryDoctors].filter((doc) => doc.isActive);

  if (search && search.trim()) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (doc) =>
        doc.name.toLowerCase().includes(s) ||
        doc.bio.toLowerCase().includes(s) ||
        doc.location.toLowerCase().includes(s) ||
        doc.education.toLowerCase().includes(s) ||
        doc.specializations.some((spec) => spec.toLowerCase().includes(s))
    );
  }

  if (specialization && specialization !== 'All Specializations') {
    filtered = filtered.filter((doc) =>
      doc.specializations.some((spec) => spec.toLowerCase() === specialization.toLowerCase())
    );
  }

  if (location && location.trim()) {
    const loc = location.toLowerCase();
    filtered = filtered.filter((doc) => doc.location.toLowerCase().includes(loc));
  }

  if (maxFee) {
    filtered = filtered.filter((doc) => doc.consultationFee <= Number(maxFee));
  }

  if (mode && mode !== 'All Modes') {
    filtered = filtered.filter((doc) =>
      doc.consultationModes.some((m) => m.toLowerCase() === mode.toLowerCase())
    );
  }

  if (day && day !== 'All Days') {
    filtered = filtered.filter((doc) =>
      doc.availableDays.some((d) => d.toLowerCase() === day.toLowerCase())
    );
  }

  return filtered;
}

export async function getAllDoctorsForAdmin(): Promise<Doctor[]> {
  if (isDatabaseConfigured()) {
    try {
      const dbDoctors = await prisma.doctor.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (dbDoctors && dbDoctors.length > 0) {
        return dbDoctors.map((doc: any) => ({
          ...doc,
          createdAt: typeof doc.createdAt === 'object' ? doc.createdAt.toISOString() : doc.createdAt,
          updatedAt: typeof doc.updatedAt === 'object' ? doc.updatedAt.toISOString() : doc.updatedAt,
        }));
      }
    } catch (err) {
      console.warn('[DB] Prisma query failed, falling back to memory store:', err);
    }
  }
  return memoryDoctors;
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  if (isDatabaseConfigured()) {
    try {
      const doc = await prisma.doctor.findUnique({
        where: { id },
      });
      if (doc) {
        return {
          ...doc,
          createdAt: typeof doc.createdAt === 'object' ? doc.createdAt.toISOString() : doc.createdAt,
          updatedAt: typeof doc.updatedAt === 'object' ? doc.updatedAt.toISOString() : doc.updatedAt,
        };
      }
    } catch (err) {
      console.warn('[DB] Prisma query failed, falling back to memory store:', err);
    }
  }
  const found = memoryDoctors.find((d) => d.id === id);
  return found || null;
}

export async function createDoctor(data: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>): Promise<Doctor> {
  const newDoctor: Doctor = {
    ...data,
    id: `doc-${Date.now()}`,
    rating: 5.0,
    reviewCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isDatabaseConfigured()) {
    try {
      const created = await prisma.doctor.create({
        data: {
          name: data.name,
          title: data.title,
          email: data.email,
          phone: data.phone,
          bio: data.bio,
          specializations: data.specializations,
          experience: data.experience,
          education: data.education,
          hospitalAffiliation: data.hospitalAffiliation || null,
          location: data.location,
          consultationFee: data.consultationFee,
          currency: data.currency || 'USD',
          availableDays: data.availableDays,
          availableHours: data.availableHours,
          consultationModes: data.consultationModes,
          languages: data.languages,
          image: data.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
          isVerified: data.isVerified ?? true,
          isActive: data.isActive ?? true,
          isFeatured: data.isFeatured ?? false,
          rating: 5.0,
          reviewCount: 1,
        },
      });
      newDoctor.id = created.id;
    } catch (err) {
      console.error('[DB] Failed to save doctor in Prisma DB:', err);
    }
  }

  // Also add to memory store
  memoryDoctors.unshift(newDoctor);
  return newDoctor;
}

export async function updateDoctor(id: string, data: Partial<Doctor>): Promise<Doctor | null> {
  if (isDatabaseConfigured()) {
    try {
      const updated = await prisma.doctor.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.title && { title: data.title }),
          ...(data.email && { email: data.email }),
          ...(data.phone && { phone: data.phone }),
          ...(data.bio && { bio: data.bio }),
          ...(data.specializations && { specializations: data.specializations }),
          ...(data.experience !== undefined && { experience: data.experience }),
          ...(data.education && { education: data.education }),
          ...(data.hospitalAffiliation !== undefined && { hospitalAffiliation: data.hospitalAffiliation }),
          ...(data.location && { location: data.location }),
          ...(data.consultationFee !== undefined && { consultationFee: data.consultationFee }),
          ...(data.currency && { currency: data.currency }),
          ...(data.availableDays && { availableDays: data.availableDays }),
          ...(data.availableHours && { availableHours: data.availableHours }),
          ...(data.consultationModes && { consultationModes: data.consultationModes }),
          ...(data.languages && { languages: data.languages }),
          ...(data.image && { image: data.image }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        },
      });
      return {
        ...updated,
        createdAt: typeof updated.createdAt === 'object' ? updated.createdAt.toISOString() : updated.createdAt,
        updatedAt: typeof updated.updatedAt === 'object' ? updated.updatedAt.toISOString() : updated.updatedAt,
      };
    } catch (err) {
      console.error('[DB] Failed to update doctor in Prisma DB:', err);
    }
  }

  const index = memoryDoctors.findIndex((d) => d.id === id);
  if (index !== -1) {
    memoryDoctors[index] = {
      ...memoryDoctors[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return memoryDoctors[index];
  }

  return null;
}

export async function deleteDoctor(id: string): Promise<boolean> {
  if (isDatabaseConfigured()) {
    try {
      await prisma.doctor.delete({
        where: { id },
      });
    } catch (err) {
      console.error('[DB] Failed to delete doctor in Prisma DB:', err);
    }
  }

  const initialLength = memoryDoctors.length;
  memoryDoctors = memoryDoctors.filter((d) => d.id !== id);
  return memoryDoctors.length < initialLength;
}
