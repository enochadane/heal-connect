'use client';

import React from 'react';
import Link from 'next/link';
import { Doctor } from '@/lib/types';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Video, 
  Calendar, 
  Award,
  ArrowRight
} from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onBookClick?: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, onBookClick }: DoctorCardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/90 shadow-subtle flex flex-col justify-between group">
      <div>
        {/* Top Header Card Info */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            {/* Avatar image */}
            <div className="relative shrink-0">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-100 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              {doctor.isVerified && (
                <div 
                  className="absolute -bottom-1.5 -right-1.5 bg-brand-600 text-white p-1 rounded-full shadow-sm ring-2 ring-white"
                  title="Verified Licensed Practitioner"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Doctor Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Link 
                  href={`/doctors/${doctor.id}`}
                  className="text-lg font-bold text-slate-900 hover:text-brand-600 transition-colors truncate block"
                >
                  {doctor.name}
                </Link>
              </div>
              <p className="text-xs font-medium text-brand-700 -mt-0.5 truncate">{doctor.title}</p>

              {/* Rating & Experience */}
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 flex-wrap">
                <div className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{doctor.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({doctor.reviewCount})</span>
                </div>

                <div className="flex items-center gap-1 text-slate-600 font-medium">
                  <Award className="w-3.5 h-3.5 text-brand-600" />
                  <span>{doctor.experience}+ yrs exp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Hospital */}
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.location}</span>
          </div>

          {/* Bio Preview */}
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {doctor.bio}
          </p>

          {/* Specialization Tags */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {doctor.specializations.slice(0, 3).map((spec, i) => (
              <span key={i} className="badge-tag">
                {spec}
              </span>
            ))}
            {doctor.specializations.length > 3 && (
              <span className="text-[11px] font-medium text-slate-400 self-center px-1">
                +{doctor.specializations.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Consultation details strip */}
        <div className="px-6 py-3 bg-slate-50/80 border-t border-b border-slate-100/90 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span className="truncate">Days: {doctor.availableDays.slice(0, 2).join(', ')}{doctor.availableDays.length > 2 ? '...' : ''}</span>
          </div>

          <div className="text-right font-bold text-slate-900">
            <span className="text-brand-700 text-sm">${doctor.consultationFee}</span>
            <span className="text-[10px] text-slate-500 font-normal"> / session</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 px-6 bg-white flex items-center gap-2.5">
        <Link
          href={`/doctors/${doctor.id}`}
          className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors text-center inline-flex items-center justify-center gap-1"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </Link>

        <button
          onClick={() => onBookClick && onBookClick(doctor)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm hover:shadow-md shadow-brand-600/20 transition-all text-center inline-flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3 h-3" />
          <span>Contact / Book</span>
        </button>
      </div>
    </div>
  );
}
