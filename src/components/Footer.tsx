import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Phone, Mail, ShieldAlert, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Emergency Crisis Resource Alert */}
        <div className="mb-12 p-5 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm md:text-base">In Immediate Crisis or Distress?</h4>
              <p className="text-xs md:text-sm text-slate-400">
                If you or a loved one are experiencing thoughts of self-harm or severe psychological crisis, immediate help is available.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:988"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-600/30 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call / Text 988</span>
            </a>
            <span className="text-xs text-slate-400">Free • 24/7 • Confidential</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Heal<span className="text-brand-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering individuals to discover verified, licensed psychiatrists and schedule consultations with ease and privacy.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct, transparent patient-doctor communication</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-white text-sm mb-4 tracking-wider uppercase">Find Care</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/doctors" className="hover:text-brand-300 transition-colors">
                  All Psychiatrists
                </Link>
              </li>
              <li>
                <Link href="/doctors?specialization=Depression" className="hover:text-brand-300 transition-colors">
                  Depression Specialists
                </Link>
              </li>
              <li>
                <Link href="/doctors?specialization=Adult+ADHD" className="hover:text-brand-300 transition-colors">
                  Adult ADHD Care
                </Link>
              </li>
              <li>
                <Link href="/doctors?specialization=PTSD+%26+Trauma" className="hover:text-brand-300 transition-colors">
                  PTSD & Trauma Therapy
                </Link>
              </li>
              <li>
                <Link href="/doctors?mode=Video+Consultation" className="hover:text-brand-300 transition-colors">
                  Telehealth Consultations
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h5 className="font-semibold text-white text-sm mb-4 tracking-wider uppercase">Platform</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/#how-it-works" className="hover:text-brand-300 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-brand-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-brand-300 transition-colors inline-flex items-center gap-1.5">
                  <span>Admin Onboarding Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h5 className="font-semibold text-white text-sm mb-4 tracking-wider uppercase">Support & Inquiries</h5>
            <p className="text-sm text-slate-400 mb-3">
              Need assistance finding a practitioner or onboarding as a medical professional?
            </p>
            <div className="space-y-2 text-sm text-slate-300">
              <a href="mailto:support@healconnect.med" className="flex items-center gap-2 hover:text-brand-300 transition-colors">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@healconnect.med</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+1 (800) 432-5266</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} HealConnect Platform. All rights reserved. Medical information provided for directory discovery.
          </p>
          <p className="max-w-xl text-center md:text-right text-slate-500">
            Disclaimer: HealConnect is an informational directory platform connecting patients with independent psychiatrists. Direct consultations, diagnosis, treatment, and payments are managed between patient and doctor.
          </p>
        </div>
      </div>
    </footer>
  );
}
