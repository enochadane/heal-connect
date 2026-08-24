'use client';

import React from 'react';
import { Search, MapPin, Stethoscope, DollarSign, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { SPECIALIZATIONS_LIST, CONSULTATION_MODES } from '@/lib/mockData';

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  specialization: string;
  setSpecialization: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  maxFee: string;
  setMaxFee: (value: string) => void;
  mode: string;
  setMode: (value: string) => void;
  onReset: () => void;
}

export default function SearchBar({
  search,
  setSearch,
  specialization,
  setSpecialization,
  location,
  setLocation,
  maxFee,
  setMaxFee,
  mode,
  setMode,
  onReset,
}: SearchBarProps) {
  const hasActiveFilters = Boolean(search || specialization || location || maxFee || mode);

  return (
    <div className="bg-white rounded-2xl shadow-subtle border border-slate-200/90 p-5 md:p-6 space-y-4">
      {/* Primary Search Bar Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Name / Keyword Search */}
        <div className="md:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-brand-600" />
          </div>
          <input
            type="text"
            placeholder="Search by doctor name, specialty, or condition (e.g. ADHD, Depression)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>

        {/* Specialization selector */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Stethoscope className="w-4 h-4 text-brand-600" />
          </div>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full pl-10 pr-8 py-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer"
          >
            {SPECIALIZATIONS_LIST.map((spec) => (
              <option key={spec} value={spec === 'All Specializations' ? '' : spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Location selector */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <MapPin className="w-4 h-4 text-brand-600" />
          </div>
          <input
            type="text"
            placeholder="City, State, or Telehealth"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>
      </div>

      {/* Secondary Filter Row */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            Quick Filters:
          </span>

          {/* Consultation Mode */}
          <div className="flex items-center gap-1.5">
            {CONSULTATION_MODES.map((m) => {
              const val = m === 'All Modes' ? '' : m;
              const isSelected = mode === val;
              return (
                <button
                  key={m}
                  onClick={() => setMode(isSelected ? '' : val)}
                  className={`px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* Max Price Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600">Max Fee:</span>
            <select
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              className="bg-transparent border-none text-slate-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">Any Fee</option>
              <option value="150">Under $150</option>
              <option value="180">Under $180</option>
              <option value="200">Under $200</option>
              <option value="250">Under $250</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-700 font-medium px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
