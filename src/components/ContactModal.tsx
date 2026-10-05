'use client';

import React, { useState, useEffect } from 'react';
import { Doctor } from '@/lib/types';
import { formatFee, maskPhone, maskEmail, isDoctorUnlocked, unlockDoctor } from '@/lib/formatters';
import { 
  X, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  Lock,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Building2,
  AlertCircle
} from 'lucide-react';

interface ContactModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export default function ContactModal({ doctor, isOpen, onClose, onPaymentSuccess }: ContactModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'unlocked'>('details');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (doctor && isOpen) {
      if (isDoctorUnlocked(doctor.id)) {
        setStep('unlocked');
        setBookingRef(`HC-${Math.floor(100000 + Math.random() * 900000)}`);
      } else {
        setStep('details');
        setSelectedDay(doctor.availableDays[0] || 'Monday');
        setSelectedMode(doctor.consultationModes[0] || 'Video Consultation');
        setPaymentMethod(doctor.currency === 'ETB' ? 'Telebirr' : 'Card');
      }
    }
  }, [doctor, isOpen]);

  if (!isOpen || !doctor) return null;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Please enter your full name');
      return;
    }
    setStep('payment');
  };

  const handleExecutePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const ref = `HC-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(ref);
      unlockDoctor(doctor.id);
      setStep('unlocked');
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    }, 1200);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(doctor.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(doctor.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Generate mailto link
  const emailSubject = encodeURIComponent(`Consultation Booking [Ref: ${bookingRef}] - ${patientName || 'Patient'}`);
  const emailBody = encodeURIComponent(
    `Hello Dr. ${doctor.name},\n\n` +
    `I have completed payment on HealConnect for a scheduled consultation (Booking Ref: ${bookingRef}).\n\n` +
    `Patient Name: ${patientName || 'Patient'}\n` +
    `Contact Phone: ${patientPhone}\n` +
    `Preferred Day: ${selectedDay}\n` +
    `Consultation Format: ${selectedMode}\n\n` +
    `Please confirm the intake paperwork and appointment link.\n\nThank you!`
  );
  const mailtoLink = `mailto:${doctor.email}?subject=${emailSubject}&body=${emailBody}`;

  const isETB = doctor.currency?.toUpperCase() === 'ETB';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Doctor Summary */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-teal-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-brand-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white truncate">{doctor.name}</h3>
                {doctor.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-brand-500/30 border border-brand-300/40 text-brand-100 text-[11px] px-2 py-0.5 rounded-full shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-100 truncate">{doctor.title}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-teal-200 font-medium">
                <span className="flex items-center gap-1 font-semibold">
                  <CreditCard className="w-3.5 h-3.5" />
                  {formatFee(doctor.consultationFee, doctor.currency)} / session
                </span>
                <span>•</span>
                <span className="truncate">{doctor.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className={`flex items-center gap-1.5 ${step === 'details' ? 'text-brand-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 'details' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
            Schedule Details
          </span>
          <span className="text-slate-300">→</span>
          <span className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-brand-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 'payment' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
            Payment ({doctor.currency})
          </span>
          <span className="text-slate-300">→</span>
          <span className={`flex items-center gap-1.5 ${step === 'unlocked' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 'unlocked' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
            Access Contact Info
          </span>
        </div>

        {/* Step 1: Details */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-5">
            {/* Privacy Notice Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Professional Privacy Policy:</strong> Professional phone numbers and email addresses will remain hidden from customers until payment is completed. After payment, you will immediately access the professional’s contact information for the scheduled service.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder={isETB ? "+251 91 234 5678" : "+1 (212) 555-0199"}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Consultation Day
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
                  >
                    {doctor.availableDays.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Consultation Format
                  </label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
                  >
                    {doctor.consultationModes.map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Hidden Contact Preview Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Doctor Phone:
                </span>
                <span className="font-mono text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded">
                  {maskPhone(doctor.phone)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Doctor Email:
                </span>
                <span className="font-mono text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded">
                  {maskEmail(doctor.email)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Payment ({formatFee(doctor.consultationFee, doctor.currency)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <div className="p-6 space-y-5">
            {/* Fee summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Service:</span>
                <span className="font-semibold text-slate-900">Psychiatric Consultation ({selectedMode})</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Clinician:</span>
                <span className="font-semibold text-slate-900">{doctor.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Scheduled Day:</span>
                <span className="font-semibold text-slate-900">{selectedDay} ({doctor.availableHours})</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Consultation Fee:</span>
                <span className="font-extrabold text-brand-700 text-lg">
                  {formatFee(doctor.consultationFee, doctor.currency)}
                </span>
              </div>
            </div>

            {/* Payment method selector */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Payment Method ({doctor.currency})
              </label>

              {isETB ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Telebirr')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${paymentMethod === 'Telebirr' ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Telebirr</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CBE Birr')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${paymentMethod === 'CBE Birr' ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>CBE Birr</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Chapa')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${paymentMethod === 'Chapa' ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    <CreditCard className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Chapa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${paymentMethod === 'Card' ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Debit / Credit Card</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${paymentMethod === 'Card' ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Credit / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Stripe')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${paymentMethod === 'Stripe' ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Stripe Checkout</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct, secure processing. Contact information unlocks immediately.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessingPayment}
                className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Payment & Unlock Contact</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Unlocked Contact Info */}
        {step === 'unlocked' && (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Success Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-950">
                  Payment Completed • Contact Access Unlocked
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Your consultation booking is registered. Booking Reference: <strong className="font-mono">{bookingRef}</strong>. You now have full access to {doctor.name}’s direct contact information.
                </p>
              </div>
            </div>

            {/* Revealed Contact Options */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Clinician Contact Information
              </h4>

              {/* Direct Phone */}
              <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Direct Professional Phone
                    </span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">
                      {doctor.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${doctor.phone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Clinician</span>
                  </a>
                  <button
                    onClick={handleCopyPhone}
                    className="p-2 border border-emerald-300 hover:bg-white text-emerald-800 rounded-xl transition-colors"
                    title="Copy phone number"
                  >
                    {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Direct Email */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 block">
                      Direct Intake Email
                    </span>
                    <span className="text-sm font-bold text-slate-900 truncate block font-mono">
                      {doctor.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={mailtoLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Email Doctor</span>
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
                    title="Copy email address"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Clinic hours info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700">
                <div>
                  <span className="font-semibold text-slate-900 block">Consultation Days</span>
                  <span>{doctor.availableDays.join(', ')}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Office Hours</span>
                  <span>{doctor.availableHours}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 text-xs text-slate-600">
              <p className="font-semibold text-slate-800 mb-0.5">Next Steps for Your Session:</p>
              <p>You can call the clinician directly or click &quot;Email Doctor&quot; to send your intake details with your booking reference code.</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Close & Return to Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
