'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Doctor } from '@/lib/types';
import { INITIAL_DOCTORS } from '@/lib/mockData';
import { 
  Users, 
  UserPlus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck, 
  Phone, 
  Mail, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors?all=true');
      if (res.ok) {
        const data = await res.json();
        if (data.doctors) setDoctors(data.doctors);
      }
    } catch (err) {
      console.warn('Using fallback list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleToggleActive = async (doctor: Doctor) => {
    try {
      const res = await fetch(`/api/doctors/${doctor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !doctor.isActive }),
      });

      if (res.ok) {
        setDoctors((prev) =>
          prev.map((d) => (d.id === doctor.id ? { ...d, isActive: !d.isActive } : d))
        );
        setActionMessage({
          text: `Doctor ${doctor.name} is now ${!doctor.isActive ? 'Active' : 'Inactive'}`,
          type: 'success',
        });
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      setActionMessage({ text: 'Failed to update status', type: 'error' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the platform?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/doctors/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDoctors((prev) => prev.filter((d) => d.id !== id));
        setActionMessage({ text: `Removed ${name} successfully`, type: 'success' });
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      setActionMessage({ text: 'Failed to delete doctor', type: 'error' });
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.email.toLowerCase().includes(search.toLowerCase()) ||
      doc.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    if (statusFilter === 'ACTIVE') return matchesSearch && doc.isActive;
    if (statusFilter === 'INACTIVE') return matchesSearch && !doc.isActive;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Psychiatrist Directory Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Full control to onboard, update information, and toggle visibility.
          </p>
        </div>

        <Link
          href="/admin/doctors/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard New Doctor</span>
        </Link>
      </div>

      {/* Action status notification */}
      {actionMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              : 'bg-red-950 text-red-300 border border-red-800'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-brand-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            All ({doctors.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'ACTIVE'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Active ({doctors.filter((d) => d.isActive).length})
          </button>
          <button
            onClick={() => setStatusFilter('INACTIVE')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'INACTIVE'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Inactive ({doctors.filter((d) => !d.isActive).length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/70 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-4">Doctor Details</th>
                <th className="p-4">Specialties</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Fee / Hours</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-750/40 transition-colors">
                    {/* Doctor Details */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-600"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{doc.name}</span>
                            {doc.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" title="Verified" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{doc.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{doc.location}</div>
                        </div>
                      </div>
                    </td>

                    {/* Specialties */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {doc.specializations.slice(0, 2).map((s, i) => (
                          <span
                            key={i}
                            className="bg-slate-900 text-brand-300 border border-slate-700 px-2 py-0.5 rounded-full text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                        {doc.specializations.length > 2 && (
                          <span className="text-[10px] text-slate-500">
                            +{doc.specializations.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Contact info */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1 text-slate-200 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{doc.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[140px]">{doc.email}</span>
                      </div>
                    </td>

                    {/* Fee & Hours */}
                    <td className="p-4 space-y-0.5">
                      <div className="font-bold text-white">
                        ${doc.consultationFee} <span className="text-[10px] text-slate-400 font-normal">{doc.currency}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {doc.availableDays.slice(0, 2).join(', ')}
                      </div>
                    </td>

                    {/* Active Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(doc)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                          doc.isActive
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                        }`}
                        title="Click to toggle visibility"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            doc.isActive ? 'bg-emerald-400' : 'bg-slate-500'
                          }`}
                        />
                        <span>{doc.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
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
                          title="Edit Profile"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(doc.id, doc.name)}
                          className="p-1.5 hover:bg-red-950 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                          title="Delete Doctor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No doctors match the current search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
