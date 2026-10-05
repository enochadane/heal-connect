'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Doctor } from '@/lib/types';
import { INITIAL_DOCTORS } from '@/lib/mockData';
import DoctorCard from '@/components/DoctorCard';
import SearchBar from '@/components/SearchBar';
import ContactModal from '@/components/ContactModal';
import { Stethoscope, Users, Sparkles, FilterX, Lock } from 'lucide-react';

function DoctorsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters state initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [maxFee, setMaxFee] = useState(searchParams.get('maxFee') || '');
  const [mode, setMode] = useState(searchParams.get('mode') || '');
  const [currency, setCurrency] = useState(searchParams.get('currency') || '');

  // Fetch doctors whenever filters change
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (specialization) params.set('specialization', specialization);
        if (location) params.set('location', location);
        if (maxFee) params.set('maxFee', maxFee);
        if (mode) params.set('mode', mode);
        if (currency) params.set('currency', currency);

        const res = await fetch(`/api/doctors?${params.toString()}`);
        const data = await res.json();
        if (data.doctors) {
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.error('Error loading doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [search, specialization, location, maxFee, mode, currency]);

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('');
    setLocation('');
    setMaxFee('');
    setMode('');
    setCurrency('');
    router.push('/doctors');
  };

  const handleOpenContact = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold">
          <Stethoscope className="w-3.5 h-3.5 text-brand-600" />
          <span>FIND THE RIGHT PROFESSIONAL FOR YOU</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Psychiatrist Discovery
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Browse verified psychiatrist profiles, view transparent fees in ETB or USD, and schedule your consultation securely. Professional contact information is unlocked upon booking payment.
        </p>

        {/* Protection disclaimer */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Professional phone numbers and email addresses remain hidden until payment is completed.</span>
        </div>
      </div>

      {/* Interactive Search & Filter Box */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        specialization={specialization}
        setSpecialization={setSpecialization}
        location={location}
        setLocation={setLocation}
        maxFee={maxFee}
        setMaxFee={setMaxFee}
        mode={mode}
        setMode={setMode}
        currency={currency}
        setCurrency={setCurrency}
        onReset={handleResetFilters}
      />

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 pt-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-600" />
          <span>
            Showing <strong className="text-slate-900">{doctors.length}</strong> available{' '}
            {doctors.length === 1 ? 'psychiatrist' : 'psychiatrists'}
            {currency ? ` in ${currency}` : ''}
          </span>
        </div>

        {loading && (
          <span className="text-xs text-brand-600 animate-pulse font-medium">
            Updating results...
          </span>
        )}
      </div>

      {/* Doctor Cards Grid */}
      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookClick={handleOpenContact}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-subtle max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FilterX className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Psychiatrists Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn’t find any doctors matching your exact filter criteria. Try adjusting your keywords, currency (ETB/USD), or resetting filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      <ContactModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading directory...</div>}>
      <DoctorsContent />
    </Suspense>
  );
}
