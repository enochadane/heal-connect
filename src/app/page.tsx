'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HeartHandshake, 
  Search, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  CalendarCheck, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Stethoscope, 
  Lock, 
  MessageSquare,
  BadgeCheck,
  ChevronRight,
  Headphones,
  Award,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { Doctor } from '@/lib/types';
import { INITIAL_DOCTORS, SPECIALIZATIONS_LIST } from '@/lib/mockData';
import DoctorCard from '@/components/DoctorCard';
import ContactModal from '@/components/ContactModal';

export default function HomePage() {
  const router = useRouter();
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>(INITIAL_DOCTORS.slice(0, 4));
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [quickSpec, setQuickSpec] = useState('');
  const [quickCurrency, setQuickCurrency] = useState('');

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        if (data.doctors && data.doctors.length > 0) {
          setFeaturedDoctors(data.doctors.slice(0, 4));
        }
      })
      .catch((err) => console.warn('Using initial doctor list on home page:', err));
  }, []);

  const handleOpenContact = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (quickSearch) params.set('search', quickSearch);
    if (quickSpec && quickSpec !== 'All Specializations') params.set('specialization', quickSpec);
    if (quickCurrency) params.set('currency', quickCurrency);
    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. Hero Section: Meet Compassionate Psychiatrists on Your Terms */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-brand-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-teal-100/50 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top Primary Headline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold shadow-sm tracking-wide animate-fade-in uppercase">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>FIND THE RIGHT MENTAL HEALTH PROFESSIONAL FOR YOU</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Meet Compassionate <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-700 via-brand-600 to-teal-500">
                Psychiatrists
              </span>{' '}
              on Your Terms
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              HealConnect connects you directly with verified psychiatrists. Explore transparent consultation fees in <strong>ETB</strong> or <strong>USD</strong>, review clinical backgrounds, and book consultations securely.
            </p>

            {/* Psychiatrist Discovery Launcher Card */}
            <div className="pt-4 max-w-3xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-1 relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    placeholder="Search doctor, condition (ADHD, Depression)..."
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-xl"
                  />
                </div>

                <div className="sm:w-44 relative border-t sm:border-t-0 sm:border-l border-slate-100 flex items-center">
                  <select
                    value={quickSpec}
                    onChange={(e) => setQuickSpec(e.target.value)}
                    className="w-full py-3 pl-3 pr-8 text-sm text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">All Specialties</option>
                    {SPECIALIZATIONS_LIST.filter((s) => s !== 'All Specializations').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:w-36 relative border-t sm:border-t-0 sm:border-l border-slate-100 flex items-center">
                  <select
                    value={quickCurrency}
                    onChange={(e) => setQuickCurrency(e.target.value)}
                    className="w-full py-3 pl-3 pr-8 text-sm text-slate-700 bg-transparent focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="">ETB & USD</option>
                    <option value="ETB">ETB (Birr)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Discover</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Trust Markers Strip */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>100% Verified Medical Licenses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-brand-600" />
                <span>Fees Stated in ETB or USD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-brand-600" />
                <span>Protected Contact Info (Unlocked After Payment)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Psychiatrist Discovery & How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
            Psychiatrist Discovery Process
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How HealConnect Works
          </h3>
          <p className="mt-3 text-sm text-slate-600">
            A safe, transparent, and private journey to finding the right psychiatric support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="glass-card p-8 rounded-2xl border border-slate-200/80 shadow-subtle relative flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 font-extrabold text-lg flex items-center justify-center mb-6 border border-brand-200">
              01
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Explore Psychiatrists</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Filter licensed specialists by mental health condition, clinical background, session format (Video, In-Person), and consultation fee in ETB or USD.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card p-8 rounded-2xl border border-slate-200/80 shadow-subtle relative flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 font-extrabold text-lg flex items-center justify-center mb-6 border border-teal-200">
              02
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Review Background & Pricing</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Read comprehensive clinical bios, university medical education, verified credentials, and transparent fees stated clearly in Ethiopian Birr (ETB) or US Dollars (USD).
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card p-8 rounded-2xl border border-slate-200/80 shadow-subtle relative flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center mb-6 border border-emerald-200">
              03
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Complete Payment & Access Contact</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Professional phone numbers and email addresses remain hidden until payment is completed. After payment, you immediately access the doctor’s direct phone and email to coordinate your service.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Psychiatrists */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
              Verified Specialists
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Psychiatrists
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Leading clinicians ready to support your mental wellness journey with fees in ETB and USD.
            </p>
          </div>

          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors"
          >
            <span>View All Doctors ({INITIAL_DOCTORS.length}+)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} onBookClick={handleOpenContact} />
          ))}
        </div>
      </section>

      {/* 4. Explore Psychiatrists by Condition & Specialty */}
      <section id="specializations" className="bg-slate-900 text-white py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">
            Specialized Care
          </h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            Explore Psychiatrists by Condition & Specialty
          </h3>
          <p className="mt-3 text-sm text-slate-300">
            Psychiatrists specialize in diagnosing and treating complex mental health conditions through psychological, behavioral, and medical approaches.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {SPECIALIZATIONS_LIST.filter((s) => s !== 'All Specializations').map((spec) => (
            <Link
              key={spec}
              href={`/doctors?specialization=${encodeURIComponent(spec)}`}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-brand-900/60 border border-slate-700/80 hover:border-brand-500/50 transition-all text-left group"
            >
              <h4 className="font-bold text-sm text-white group-hover:text-brand-300 transition-colors">
                {spec}
              </h4>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <span>Browse specialists</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Policy & Security: Fees & Protected Contact Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Transparent Pricing & Privacy Protection</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Professional Privacy & Direct Access Policy
            </h3>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We ensure a smooth, professional relationship between customers and clinicians by maintaining strict standards around consultation fees and privacy.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Fees Stated in ETB or USD</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Consultation fees may be stated in Ethiopian Birr (ETB) or US Dollars (USD). Patients can pay locally or internationally with no unexpected currency exchange surprises.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Protected Professional Contact Details</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Professional phone numbers and email addresses will remain hidden from customers until payment is completed. After payment, the customer may access the professional’s contact information for the scheduled service.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Verified Board-Certified Specialists</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Every psychiatrist undergoes administrative verification before publishing their profile on HealConnect.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-50 to-teal-50 border border-brand-200/60 shadow-lg relative space-y-6">
            <div className="p-5 rounded-2xl bg-white border border-brand-100 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
                How Payment Unlocks Access
              </span>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Before Payment: Doctor phone & email are protected</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>After Payment: Immediate unlock of direct phone, email, and booking intake</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Verified Patient Experience</span>
              <p className="text-base italic text-slate-700 leading-relaxed">
                “Finding a psychiatrist who understands both local and international contexts was seamless. I chose Dr. Dawit Abebe with the fee stated in ETB, completed the booking, and got his direct intake line immediately.”
              </p>
              <div className="pt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
                  B
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">Bethlehem T.</h5>
                  <p className="text-xs text-slate-500">Verified Patient • Addis Ababa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
            Got Questions?
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              How and when do I get the psychiatrist’s phone number and email?
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Professional phone numbers and email addresses will remain hidden from customers until payment is completed. After payment, the customer may access the professional’s contact information for the scheduled service.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              What currencies are supported for consultation fees?
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fees may be stated in <strong>ETB (Ethiopian Birr)</strong> or <strong>USD (US Dollars)</strong>. You can filter the directory by your preferred currency and complete payment via local methods (such as Telebirr, CBE Birr, Chapa) or international cards.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Are online (telehealth) and in-person sessions supported?
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Yes! Most of our featured doctors offer secure Video Consultation alongside phone and in-person sessions. You can filter the directory by consultation mode to suit your preferences.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-100 text-xs font-semibold">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>FIND THE RIGHT PROFESSIONAL FOR YOU</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to begin your journey to mental wellness?
            </h3>
            <p className="text-sm text-brand-100 leading-relaxed">
              Explore verified psychiatrist profiles, view transparent fees in ETB or USD, and book your confidential consultation today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/doctors"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-brand-50 text-brand-800 text-sm font-bold rounded-xl shadow-lg transition-all text-center"
            >
              Browse All Psychiatrists
            </Link>
            <Link
              href="/admin/login"
              className="w-full sm:w-auto px-5 py-3.5 bg-brand-900/60 hover:bg-brand-900 text-white text-sm font-semibold rounded-xl border border-brand-500/40 transition-colors text-center"
            >
              Doctor Onboarding Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Booking & Payment Access Modal */}
      <ContactModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
