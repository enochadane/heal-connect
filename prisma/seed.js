const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const SEED_DOCTORS = [
  {
    name: 'Dr. Sarah Jenkins, MD',
    title: 'Board-Certified Adult Psychiatrist',
    email: 'sarah.jenkins@healconnect.med',
    phone: '+1 (555) 234-8901',
    bio: 'Dr. Jenkins specializes in mood disorders, treatment-resistant depression, and adult ADHD. With over 14 years of clinical practice, she combines evidence-based psychopharmacology with supportive cognitive behavioral strategies.',
    specializations: ['Depression', 'Anxiety & Panic', 'Adult ADHD', 'Bipolar Disorder'],
    experience: 14,
    education: 'Johns Hopkins University School of Medicine (MD), Columbia Psychiatry Residency',
    hospitalAffiliation: 'Metropolitan Health Center',
    location: 'New York, NY (In-Person & Telehealth)',
    consultationFee: 180,
    currency: 'USD',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableHours: '9:00 AM - 4:30 PM EST',
    consultationModes: ['Phone Call', 'Video Consultation', 'In-Person'],
    languages: ['English', 'Spanish'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewCount: 48,
    isVerified: true,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Dr. Marcus Vance, MD, PhD',
    title: 'Neuropsychiatrist & Sleep Medicine Specialist',
    email: 'm.vance@healconnect.med',
    phone: '+1 (555) 345-6789',
    bio: 'Dr. Vance focuses on the intersection of neurological wellness, insomnia, and trauma-related stress. He takes a holistic, biological, and compassionate approach to mental clarity and emotional regulation.',
    specializations: ['PTSD & Trauma', 'Sleep & Insomnia', 'Stress Management', 'Anxiety'],
    experience: 18,
    education: 'Stanford University School of Medicine (MD/PhD), UCSF Fellow',
    hospitalAffiliation: 'Pacific Neuroscience Institute',
    location: 'San Francisco, CA (Telehealth available nationwide)',
    consultationFee: 220,
    currency: 'USD',
    availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    availableHours: '10:00 AM - 6:00 PM PST',
    consultationModes: ['Video Consultation', 'Phone Call'],
    languages: ['English'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 36,
    isVerified: true,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Dr. Elena Rostova, MD',
    title: 'Child & Adolescent Psychiatrist',
    email: 'elena.rostova@healconnect.med',
    phone: '+1 (555) 456-7890',
    bio: 'Dedicated to helping young people and families navigate behavioral challenges, developmental conditions, school anxiety, and emotional resilience with empathetic, family-centered care.',
    specializations: ['Child & Adolescent', 'Autism Spectrum Support', 'Social Anxiety', 'ADHD'],
    experience: 11,
    education: 'Yale School of Medicine (MD), Boston Children’s Hospital Fellowship',
    hospitalAffiliation: 'Northwestern Memorial Care',
    location: 'Chicago, IL (In-Person & Telehealth)',
    consultationFee: 160,
    currency: 'USD',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableHours: '1:00 PM - 7:00 PM CST',
    consultationModes: ['Video Consultation', 'Phone Call', 'In-Person'],
    languages: ['English', 'Russian'],
    image: 'https://images.unsplash.com/photo-1594824813533-46953a0058b2?w=500&auto=format&fit=crop&q=80',
    rating: 4.88,
    reviewCount: 29,
    isVerified: true,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Dr. Dawit Abebe, MD',
    title: 'Consultant Psychiatrist & Addiction Medicine',
    email: 'dawit.abebe@healconnect.med',
    phone: '+1 (555) 567-8901',
    bio: 'Dr. Abebe provides compassionate psychiatric evaluations and evidence-based addiction recovery consultations, dual diagnosis treatment, and grief counseling tailored to cultural contexts.',
    specializations: ['Addiction Recovery', 'Dual Diagnosis', 'Grief & Loss', 'Depression'],
    experience: 16,
    education: 'Addis Ababa University (MD), University of Washington Psychiatry Residency',
    hospitalAffiliation: 'Evergreen Health Alliance',
    location: 'Seattle, WA (Telehealth & Hybrid)',
    consultationFee: 150,
    currency: 'USD',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    availableHours: '8:00 AM - 3:30 PM PST',
    consultationModes: ['Phone Call', 'Video Consultation'],
    languages: ['English', 'Amharic'],
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80',
    rating: 4.96,
    reviewCount: 52,
    isVerified: true,
    isActive: true,
    isFeatured: true,
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create or update Default Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@healconnect.com';
  const rawPassword = process.env.ADMIN_PASSWORD || 'admin123password';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: 'Platform Administrator',
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Platform Administrator',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin created: ${adminEmail}`);

  // 2. Seed Initial Doctors
  for (const doc of SEED_DOCTORS) {
    const existing = await prisma.doctor.findFirst({
      where: { email: doc.email },
    });

    if (!existing) {
      await prisma.doctor.create({ data: doc });
      console.log(`✅ Created doctor profile: ${doc.name}`);
    }
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding DB:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
