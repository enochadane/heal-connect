'use client';

import React, { useState, useEffect } from 'react';
import { Doctor } from '@/lib/types';
import { formatFee, maskPhone, maskEmail, setCustomerEmail } from '@/lib/formatters';
import { PAYMENT_ACCOUNTS, PaymentMethodKey } from '@/lib/paymentConfig';
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
  CheckCircle2,
  ArrowRight,
  Building2,
  AlertCircle,
  Landmark,
  Smartphone,
  ClipboardCopy,
  Loader2
} from 'lucide-react';

interface ContactModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSubmitted?: () => void;
}

export default function ContactModal({ doctor, isOpen, onClose, onBookingSubmitted }: ContactModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'submitted'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('telebirr');
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedAccount, setCopiedAccount] = useState('');

  useEffect(() => {
    if (doctor && isOpen) {
      setStep('details');
      setSelectedDay(doctor.availableDays[0] || '');
      setSelectedMode(doctor.consultationModes[0] || '');
      setPaymentMethod('telebirr');
      setSubmitError('');
      setTransactionRef('');
      setBookingRef('');
    }
  }, [doctor, isOpen]);

  if (!isOpen || !doctor) return null;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setSubmitError('Please fill in all required fields.');
      return;
    }
    setSubmitError('');
    setStep('payment');
  };

  const handleSubmitBooking = async () => {
    if (!transactionRef.trim()) {
      setSubmitError('Please enter your transaction reference number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          customerName,
          customerPhone,
          customerEmail,
          paymentMethod,
          transactionReference: transactionRef,
          consultationDay: selectedDay,
          consultationMode: selectedMode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking.');
      }

      setBookingRef(data.booking.id);
      setCustomerEmail(customerEmail);
      setStep('submitted');
      onBookingSubmitted?.();
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAccount = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(''), 2500);
  };

  const selectedAccount = PAYMENT_ACCOUNTS[paymentMethod];

  const paymentMethodIcons: Record<PaymentMethodKey, React.ReactNode> = {
    cbe: <Building2 className="w-5 h-5 text-blue-600" />,
    abyssinia: <Landmark className="w-5 h-5 text-purple-600" />,
    telebirr: <Smartphone className="w-5 h-5 text-emerald-600" />,
  };

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
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 'details' ? 'bg-brand-600 text-white' : 'bg-emerald-500 text-white'}`}>
              {step !== 'details' ? <Check className="w-3 h-3" /> : '1'}
            </span>
            Your Details
          </span>
          <span className="text-slate-300">→</span>
          <span className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-brand-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 'payment' ? 'bg-brand-600 text-white' : step === 'submitted' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {step === 'submitted' ? <Check className="w-3 h-3" /> : '2'}
            </span>
            Transfer Payment
          </span>
          <span className="text-slate-300">→</span>
          <span className={`flex items-center gap-1.5 ${step === 'submitted' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 'submitted' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
            Confirmation
          </span>
        </div>

        {/* Error display */}
        {submitError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Step 1: Customer Details */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-5">
            {/* Privacy Notice Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>How It Works:</strong> Transfer the consultation fee via CBE, Bank of Abyssinia, or Telebirr. Once the admin verifies your payment, you will be able to access the professional&apos;s contact information.
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
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
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
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 0911234567 or +251 91 123 4567"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your.email@example.com"
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
                  Professional Phone:
                </span>
                <span className="font-mono text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded">
                  {maskPhone(doctor.phone)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Professional Email:
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

        {/* Step 2: Manual Bank Transfer */}
        {step === 'payment' && (
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Fee summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Service:</span>
                <span className="font-semibold text-slate-900">Consultation ({selectedMode})</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Professional:</span>
                <span className="font-semibold text-slate-900">{doctor.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Preferred Day:</span>
                <span className="font-semibold text-slate-900">{selectedDay} ({doctor.availableHours})</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Amount to Transfer:</span>
                <span className="font-extrabold text-brand-700 text-lg">
                  {formatFee(doctor.consultationFee, doctor.currency)}
                </span>
              </div>
            </div>

            {/* Payment method selector */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Transfer Method
              </label>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {(Object.keys(PAYMENT_ACCOUNTS) as PaymentMethodKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPaymentMethod(key)}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === key
                        ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {paymentMethodIcons[key]}
                    <span className="text-[11px] leading-tight">{PAYMENT_ACCOUNTS[key].label.split('(')[0].trim()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer details for selected method */}
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-3">
              <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-2">
                {paymentMethodIcons[paymentMethod]}
                <span>Transfer to {selectedAccount.label}</span>
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-brand-100">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Account Name</span>
                    <span className="text-sm font-bold text-slate-900">{selectedAccount.accountName}</span>
                  </div>
                  <button
                    onClick={() => handleCopyAccount(selectedAccount.accountName, `${paymentMethod}-name`)}
                    className="p-1.5 hover:bg-brand-100 rounded-lg transition-colors"
                    title="Copy account name"
                  >
                    {copiedAccount === `${paymentMethod}-name` ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ClipboardCopy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-brand-100">
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      {paymentMethod === 'telebirr' ? 'Phone Number' : 'Account Number'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-mono">{selectedAccount.accountNumber}</span>
                  </div>
                  <button
                    onClick={() => handleCopyAccount(selectedAccount.accountNumber, `${paymentMethod}-number`)}
                    className="p-1.5 hover:bg-brand-100 rounded-lg transition-colors"
                    title="Copy account number"
                  >
                    {copiedAccount === `${paymentMethod}-number` ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ClipboardCopy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-brand-100">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Amount</span>
                    <span className="text-sm font-extrabold text-brand-700">{formatFee(doctor.consultationFee, doctor.currency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction reference input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transaction Reference / Receipt Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="Enter the reference number from your transfer receipt"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This is the reference or receipt number you received after completing the transfer.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                After submitting, an administrator will verify your payment. Once confirmed, you will be able to see the professional&apos;s contact details on their profile page.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setStep('details'); setSubmitError(''); }}
                className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSubmitBooking}
                disabled={isSubmitting || !transactionRef.trim()}
                className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Booking Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Booking Submitted - Awaiting Admin Confirmation */}
        {step === 'submitted' && (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Success Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-950">
                  Booking Request Submitted
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Your booking reference is <strong className="font-mono">{bookingRef}</strong>. An administrator will verify your payment shortly.
                </p>
              </div>
            </div>

            {/* What happens next */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                What Happens Next
              </h4>
              
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">1</div>
                  <div className="text-xs text-slate-700">
                    <strong>Admin Verification</strong> — Our team will verify your transfer using the transaction reference you provided.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">2</div>
                  <div className="text-xs text-slate-700">
                    <strong>Contact Unlocked</strong> — Once confirmed, visit the professional&apos;s profile page to see their phone number and email.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">3</div>
                  <div className="text-xs text-slate-700">
                    <strong>Schedule Your Session</strong> — Contact the professional directly to finalize your consultation appointment.
                  </div>
                </div>
              </div>
            </div>

            {/* Booking summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Professional:</span>
                <span className="font-semibold text-slate-900">{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Transferred:</span>
                <span className="font-semibold text-slate-900">{formatFee(doctor.consultationFee, doctor.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-semibold text-slate-900">{PAYMENT_ACCOUNTS[paymentMethod].label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Ref:</span>
                <span className="font-semibold text-slate-900 font-mono">{transactionRef}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Payment verification is typically completed within a few hours during business hours. You will see the contact information on the professional&apos;s profile once confirmed.
              </span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
