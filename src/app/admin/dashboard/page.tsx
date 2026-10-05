'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Doctor } from '@/lib/types';
import { INITIAL_DOCTORS } from '@/lib/mockData';
import { 
  Users, 
  UserCheck, 
  Video, 
  DollarSign, 
  UserPlus, 
  Eye, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight,
  Stethoscope,
  ExternalLink,
  Edit
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/doctors?all=true')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized or fetch failed');
        return res.json();
      })
      .then((data) => {
        if (data.doctors) setDoctors(data.doctors);
      })
      .catch((err) => {
        console.warn('Dashboard using fallback list:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter((d) => d.isActive).length;
  const videoDoctors = doctors.filter((d) => d.consultationModes.includes('Video Consultation')).length;
  const avgFee = totalDoctors > 0
    ? Math.round(doctors.reduce((acc, d) => acc + d.consultationFee, 0) / totalDoctors)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage psychiatrist profiles, verify onboarding requests, and monitor directory metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/doctors"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/admin/doctors/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Doctor</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Doctors */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Psychiatrists</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalDoctors}</div>
          <p className="text-[11px] text-brand-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>All verified by admin</span>
          </p>
        </div>

        {/* Active Doctors */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active in Directory</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{activeDoctors}</div>
          <p className="text-[11px] text-emerald-400 font-medium">
            <span>{Math.round((activeDoctors / (totalDoctors || 1)) * 100)}% visible to patients</span>
          </p>
        </div>

        {/* Telehealth Providers */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Telehealth Capable</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{videoDoctors}</div>
          <p className="text-[11px] text-teal-400 font-medium">
            <span>Offer video consultations</span>
          </p>
        </div>

        {/* Average Fee */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Consultation Fee</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">${avgFee}</div>
          <p className="text-[11px] text-slate-400 font-medium">
            <span>Across all specialties</span>
          </p>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-900/70 via-slate-800 to-teal-900/60 border border-brand-700/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-white text-base">Want to onboard a new psychiatrist?</h3>
          <p className="text-xs text-slate-300">
            Fill out the onboarding form with their contact details, specialties, fees, and bio to publish immediately.
          </p>
        </div>
        <Link
          href="/admin/doctors/new"
          className="shrink-0 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Psychiatrist</span>
        </Link>
      </div>

      {/* Recent Psychiatrists Table */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Psychiatrist Onboarding Directory</h3>
            <p className="text-xs text-slate-400">Manage, edit, or deactivate published clinician profiles</p>
          </div>
          <Link
            href="/admin/doctors"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
          >
            <span>Full Directory ({doctors.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-4">Doctor</th>
                <th className="p-4">Primary Specialty</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Fee / Session</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {doctors.slice(0, 5).map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-750/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-600"
                      />
                      <div>
                        <div className="font-bold text-white">{doc.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{doc.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-900 text-brand-300 border border-slate-700 px-2 py-0.5 rounded-full text-[11px]">
                      {doc.specializations[0] || 'General'}
                    </span>
                  </td>
                  <td className="p-4 space-y-0.5">
                    <div className="font-mono text-slate-300">{doc.phone}</div>
                    <div className="text-slate-400 truncate max-w-[150px]">{doc.email}</div>
                  </td>
                  <td className="p-4 font-bold text-white text-xs">
                    {doc.currency?.toUpperCase() === 'ETB' ? `${doc.consultationFee.toLocaleString()} ETB` : `$${doc.consultationFee.toLocaleString()} USD`}
                  </td>
                  <td className="p-4">
                    {doc.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900 text-slate-400 border border-slate-700">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/doctors/${doc.id}`}
                        target="_blank"
                        className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                        title="View Public Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/doctors/${doc.id}/edit`}
                        className="p-1.5 hover:bg-slate-700 text-brand-400 hover:text-brand-300 rounded-lg transition-colors"
                        title="Edit Doctor"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
