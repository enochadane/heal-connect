'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Doctor } from '@/lib/types';
import { INITIAL_DOCTORS } from '@/lib/mockData';
import ContactModal from '@/components/ContactModal';
import { formatFee, maskPhone, maskEmail, checkDoctorUnlocked, getCustomerEmail } from '@/lib/formatters';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Building2, 
  Languages, 
  Phone, 
  Mail, 
  Video, 
  Award, 
  ArrowLeft, 
  Share2, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ExternalLink, 
  CalendarCheck, 
  Copy, 
  RefreshCw 
} from 'lucide-react';

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [checkingUnlock, setCheckingUnlock] = useState(false);

  const fetchDoctorProfile = useCallback(async () => {
    if (!id) return;
    try {
      const email = getCustomerEmail();
      const query = email ? `?email=${encodeURIComponent(email)}` : '';
      const res = await fetch(`/api/doctors/${id}${query}`);
      const data = await res.json();
      if (data.doctor) {
        setDoctor(data.doctor);
      } else {
        const found = INITIAL_DOCTORS.find((d) => d.id === id);
        setDoctor(found || null);
      }
    } catch (err) {
      console.warn('API error, falling back to mock data:', err);
      const found = INITIAL_DOCTORS.find((d) => d.id === id);
      setDoctor(found || null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDoctorProfile();
  }, [fetchDoctorProfile]);

  const refreshUnlockStatus = useCallback(async () => {
    if (!id) return;
    setCheckingUnlock(true);
    try {
      const isUnlocked = await checkDoctorUnlocked(id);
      setUnlocked(isUnlocked);
      if (isUnlocked) {
        await fetchDoctorProfile();
      }
    } catch {
      // silently fail
    } finally {
      setCheckingUnlock(false);
    }
  }, [id, fetchDoctorProfile]);

  useEffect(() => {
    refreshUnlockStatus();
  }, [refreshUnlockStatus]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500">Loading profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Profile Not Found</h2>
        <p className="text-sm text-slate-600">
          The requested professional profile could not be found or may have been deactivated.
        </p>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumbs & Back Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span>/</span>
          <Link href="/doctors" className="hover:text-brand-700">Find Professionals</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{doctor.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Profile</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Left Details & Right Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Doctor Profile & Qualifications */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
                />
                {doctor.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-brand-600 text-white p-1.5 rounded-full shadow-md ring-4 ring-white" title="Verified Licensed Professional">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {doctor.name}
                  </h1>
                  {doctor.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Specialist
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-brand-700">{doctor.title}</p>

                {/* Rating, Experience, Location */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{doctor.rating.toFixed(2)}</span>
                    <span className="text-slate-400 font-normal">({doctor.reviewCount} client reviews)</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-700 font-medium">
                    <Award className="w-4 h-4 text-brand-600" />
                    <span>{doctor.experience} Years Experience</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{doctor.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialization Badges */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Clinical Specializations & Areas of Practice
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.specializations.map((spec, i) => (
                  <span key={i} className="badge-tag text-xs px-3 py-1">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Biography & Approach */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>About Dr. {doctor.name.split(' ')[1] || doctor.name}</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {doctor.bio}
            </p>
          </div>

          {/* Education & Clinical Background */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-6">
            <h2 className="text-lg font-bold text-slate-900">
              Credentials, Education & Practice
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 border border-brand-200">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Education & Residency</h4>
                  <p className="text-slate-700 mt-0.5">{doctor.education}</p>
                </div>
              </div>

              {doctor.hospitalAffiliation && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Hospital / Clinic Affiliation</h4>
                    <p className="text-slate-700 mt-0.5">{doctor.hospitalAffiliation}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Languages Spoken</h4>
                  <p className="text-slate-700 mt-0.5">{doctor.languages.join(', ')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Consultation Formats</h4>
                  <p className="text-slate-700 mt-0.5">{doctor.consultationModes.join(' • ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking & Protected Contact Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            
            {/* Price Header */}
            <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 p-6 text-white text-center space-y-1">
              <span className="text-xs uppercase font-bold tracking-widest text-teal-200">Standard Consultation Rate</span>
              <div className="text-3xl font-extrabold text-white flex items-center justify-center">
                <span>{formatFee(doctor.consultationFee, doctor.currency)}</span>
                <span className="text-xs text-teal-200 font-normal ml-1.5">/ session</span>
              </div>
            </div>

            {/* Availability & Hours */}
            <div className="p-6 space-y-6">
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Calendar className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Consultation Days</span>
                    <span>{doctor.availableDays.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Office Hours</span>
                    <span>{doctor.availableHours}</span>
                  </div>
                </div>
              </div>

              {/* Status Section: Unlocked vs Locked */}
              {unlocked ? (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Payment Confirmed</span>
                      <span>You can contact the professional directly for your consultation.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href={`tel:${doctor.phone}`}
                      className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>

                    <a
                      href={`mailto:${doctor.email}?subject=HealConnect%20Consultation%20Inquiry%20-%20${encodeURIComponent(doctor.name)}`}
                      className="py-3 px-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Email</span>
                    </a>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
                    <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Direct Contact Information:</p>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-mono font-bold text-slate-900">{doctor.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-mono font-bold text-slate-900 truncate max-w-[170px]">{doctor.email}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Privacy policy notice */}
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs text-amber-900 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Protected Professional Contact</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-800">
                      Transfer the consultation fee via CBE, Bank of Abyssinia, or Telebirr. Once the admin confirms your payment, you will see the professional&apos;s contact details here.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Book & Unlock Contact Info</span>
                  </button>

                  {/* Check status button */}
                  <button
                    onClick={refreshUnlockStatus}
                    disabled={checkingUnlock}
                    className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${checkingUnlock ? 'animate-spin' : ''}`} />
                    <span>{checkingUnlock ? 'Checking...' : 'Check Payment Status'}</span>
                  </button>

                  {/* Masked Preview */}
                  <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Contact Status:</p>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Phone:</span>
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        {maskPhone(doctor.phone)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Email:</span>
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        {maskEmail(doctor.email)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Consultation Security note */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-800 mb-0.5">Transparent & Direct Care</p>
                <p>Fees are stated in {doctor.currency}. Zero platform middleman markup. All credentials verified by HealConnect.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      <ContactModal
        doctor={doctor}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onBookingSubmitted={refreshUnlockStatus}
      />
    </div>
  );
}
