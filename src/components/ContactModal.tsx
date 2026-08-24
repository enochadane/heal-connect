'use client';

import React, { useState } from 'react';
import { Doctor } from '@/lib/types';
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
  ExternalLink,
  MessageSquareCheck
} from 'lucide-react';

interface ContactModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ doctor, isOpen, onClose }: ContactModalProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPreferredDay, setPatientPreferredDay] = useState('');
  const [patientMessage, setPatientMessage] = useState('');

  if (!isOpen || !doctor) return null;

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

  // Generate mailto link with prefilled subject and body
  const emailSubject = encodeURIComponent(`Consultation Booking Inquiry - ${doctor.name}`);
  const emailBody = encodeURIComponent(
    `Hello ${doctor.name},\n\n` +
    `I found your profile on HealConnect and would like to schedule a psychiatric consultation.\n\n` +
    `Patient Name: ${patientName || '[Your Name]'}\n` +
    `Preferred Day/Time: ${patientPreferredDay || doctor.availableDays.join(', ')}\n` +
    `Reason for Consultation: ${patientMessage || 'Initial psychiatric evaluation / consultation'}\n\n` +
    `Please let me know your earliest availability and intake procedure.\n\n` +
    `Thank you!`
  );
  const mailtoLink = `mailto:${doctor.email}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
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
              className="w-16 h-16 rounded-xl object-cover border-2 border-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
                {doctor.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-brand-500/30 border border-brand-300/40 text-brand-100 text-xs px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-brand-100">{doctor.title}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-teal-200 font-medium">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  ${doctor.consultationFee} {doctor.currency} / consultation
                </span>
                <span>•</span>
                <span>{doctor.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Availability & Fee Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">Available Days</span>
                <span>{doctor.availableDays.join(', ')}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">Office Hours</span>
                <span>{doctor.availableHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquareCheck className="w-4 h-4 text-brand-600" />
              Choose How to Connect
            </h4>

            {/* Phone Call Option */}
            <div className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 transition-all bg-white hover:shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-emerald-800 tracking-wider block">Call Directly for Appointments</span>
                    <span className="text-base font-bold text-slate-900">{doctor.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${doctor.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>
                  <button
                    onClick={handleCopyPhone}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
                    title="Copy phone number"
                  >
                    {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Email Consultation Option */}
            <div className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 transition-all bg-white hover:shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 border border-brand-200">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-brand-800 tracking-wider block">Email Consultation Request</span>
                    <span className="text-base font-bold text-slate-900">{doctor.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={mailtoLink}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Email App</span>
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
                    title="Copy email address"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Optional interactive email template builder */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2 font-medium">
                  Optional: Fill in details to pre-fill your email draft:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. John Doe)"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <input
                    type="text"
                    placeholder="Preferred day/time (e.g. Tuesday morning)"
                    value={patientPreferredDay}
                    onChange={(e) => setPatientPreferredDay(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Booking note */}
          <div className="p-3.5 rounded-lg bg-teal-50/60 border border-teal-200/60 text-xs text-teal-900">
            <p className="font-semibold mb-1">Appointment Process & Consultation Notes</p>
            <p className="text-teal-800 leading-relaxed">
              When contacting the doctor, mention that you found their profile on HealConnect. Doctor will confirm appointment slot, intake documentation, and their accepted payment methods directly with you.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/80 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
