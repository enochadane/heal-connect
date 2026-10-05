'use client';

import React, { useState, useEffect } from 'react';
import { BookingRequest } from '@/lib/types';
import { formatFee } from '@/lib/formatters';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  AlertCircle,
  Loader2,
  Building2,
  Landmark,
  Smartphone,
  RefreshCw
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) setBookings(data.bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirm = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/bookings/${id}/confirm`, { method: 'POST' });
      if (res.ok) {
        await fetchBookings();
      }
    } catch (err) {
      console.error('Error confirming booking:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/bookings/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        await fetchBookings();
      }
    } catch (err) {
      console.error('Error rejecting booking:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const rejectedCount = bookings.filter((b) => b.status === 'rejected').length;

  const paymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cbe': return 'CBE';
      case 'abyssinia': return 'Abyssinia';
      case 'telebirr': return 'Telebirr';
      default: return method;
    }
  };

  const paymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cbe': return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'abyssinia': return <Landmark className="w-3.5 h-3.5 text-purple-400" />;
      case 'telebirr': return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Payment & Booking Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review pending payments, confirm transfers, and manage customer booking requests.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pending Review</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{pendingCount}</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Confirmed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{confirmedCount}</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Rejected</span>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{rejectedCount}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'pending', 'confirmed', 'rejected'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === filter
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {filter === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-slate-900 rounded-full text-[10px] font-bold">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-6 h-6 text-brand-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-700 text-slate-500 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-400">No {statusFilter === 'all' ? '' : statusFilter} bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Professional</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Transaction Ref</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-750/50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-[11px] text-slate-400">{booking.id}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-white">{booking.customerName}</div>
                        <div className="text-[11px] text-slate-400">{booking.customerPhone}</div>
                        <div className="text-[11px] text-slate-400">{booking.customerEmail}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{booking.doctorName}</div>
                      <div className="text-[11px] text-slate-400">{booking.consultationDay} • {booking.consultationMode}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        {paymentMethodIcon(booking.paymentMethod)}
                        <span className="font-semibold text-white">{paymentMethodLabel(booking.paymentMethod)}</span>
                      </div>
                      <div className="font-bold text-brand-300">
                        {formatFee(booking.amount, booking.currency)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm font-bold text-white bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                        {booking.transactionReference}
                      </span>
                    </td>
                    <td className="p-4">
                      {booking.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-400 border border-amber-800">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {booking.status === 'confirmed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Confirmed
                        </span>
                      )}
                      {booking.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-950 text-red-400 border border-red-800">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {booking.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleConfirm(booking.id)}
                            disabled={actionLoading === booking.id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {actionLoading === booking.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            disabled={actionLoading === booking.id}
                            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-[11px] font-bold rounded-lg border border-red-800 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                      {booking.status === 'confirmed' && booking.confirmedAt && (
                        <span className="text-[11px] text-slate-400">
                          {new Date(booking.confirmedAt).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
