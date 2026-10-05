'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UserPlus, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Upload, 
  Sparkles, 
  Image as ImageIcon,
  ShieldCheck
} from 'lucide-react';
import { SPECIALIZATIONS_LIST } from '@/lib/mockData';

const PRESET_AVATARS = [
  { label: 'Dr. Jenkins (Female, MD)', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80' },
  { label: 'Dr. Vance (Male, MD)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80' },
  { label: 'Dr. Rostova (Female, MD)', url: 'https://images.unsplash.com/photo-1594824813533-46953a0058b2?w=500&auto=format&fit=crop&q=80' },
  { label: 'Dr. Abebe (Male, MD)', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80' },
  { label: 'Dr. Chen (Male, MD)', url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80' },
];

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ALL_MODES = ['Phone Call', 'Video Consultation', 'In-Person', 'Email'];

export default function OnboardDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Board-Certified Psychiatrist');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(['Depression', 'Anxiety & Panic']);
  const [customSpec, setCustomSpec] = useState('');
  const [experience, setExperience] = useState('10');
  const [education, setEducation] = useState('MD in Psychiatry, Board Certified');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [location, setLocation] = useState('New York, NY (Telehealth available)');
  const [consultationFee, setConsultationFee] = useState('175');
  const [currency, setCurrency] = useState('USD');
  const [availableDays, setAvailableDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday']);
  const [availableHours, setAvailableHours] = useState('9:00 AM - 5:00 PM EST');
  const [consultationModes, setConsultationModes] = useState<string[]>(['Phone Call', 'Video Consultation']);
  const [languages, setLanguages] = useState('English');
  const [image, setImage] = useState(PRESET_AVATARS[0].url);
  const [isVerified, setIsVerified] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleAddCustomSpec = () => {
    if (customSpec.trim() && !selectedSpecs.includes(customSpec.trim())) {
      setSelectedSpecs([...selectedSpecs, customSpec.trim()]);
      setCustomSpec('');
    }
  };

  const toggleDay = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleMode = (mode: string) => {
    setConsultationModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name || !email || !phone || !bio) {
      setError('Please provide Doctor Name, Email, Phone Number, and Biography.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          title,
          email,
          phone,
          bio,
          specializations: selectedSpecs,
          experience: Number(experience),
          education,
          hospitalAffiliation: hospitalAffiliation || null,
          location,
          consultationFee: Number(consultationFee),
          currency,
          availableDays,
          availableHours,
          consultationModes,
          languages: languages.split(',').map((l) => l.trim()),
          image,
          isVerified,
          isActive,
          isFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to onboard doctor');
      }

      router.push('/admin/doctors');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <Link
            href="/admin/doctors"
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Doctors Directory</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Onboard New Psychiatrist
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fill in doctor credentials and contact info to publish them on HealConnect.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Basic Identity & Contact */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400">
            1. Identity & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Doctor Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Jennifer Hayes, MD"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Professional Title / Sub-specialty
              </label>
              <input
                type="text"
                placeholder="e.g. Adult & Adolescent Psychiatrist"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Direct Clinic Phone (Protected until payment) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +251 91 123 4567 or +1 (212) 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Phone number remains hidden until customer completes payment.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Direct Booking Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. dr.hayes@clinic.med"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Location / City / Telehealth Coverage
            </label>
            <input
              type="text"
              placeholder="e.g. Boston, MA (In-Person & Nationwide Telehealth)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Biography & Treatment Philosophy <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe doctor’s clinical experience, patient philosophy, and specialties..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Clinical Specialties */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400">
            2. Psychiatric Specializations
          </h2>

          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS_LIST.filter((s) => s !== 'All Specializations').map((spec) => {
              const isSelected = selectedSpecs.includes(spec);
              return (
                <button
                  type="button"
                  key={spec}
                  onClick={() => toggleSpecialization(spec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white border border-brand-400 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                  {spec}
                </button>
              );
            })}
          </div>

          {/* Add custom specialization */}
          <div className="flex items-center gap-2 pt-2 max-w-sm">
            <input
              type="text"
              placeholder="Add other specialty..."
              value={customSpec}
              onChange={(e) => setCustomSpec(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 flex-1"
            />
            <button
              type="button"
              onClick={handleAddCustomSpec}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg"
            >
              Add
            </button>
          </div>
        </div>

        {/* Section 3: Credentials, Education & Rates */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400">
            3. Education, Rates & Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Consultation Fee Amount
              </label>
              <input
                type="number"
                min="0"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Currency (ETB or USD)
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="ETB">ETB - Ethiopian Birr</option>
                <option value="USD">USD - US Dollar ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Education & Residencies
              </label>
              <input
                type="text"
                placeholder="e.g. Harvard Medical School (MD), Columbia Residency"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hospital / Health Center Affiliation
              </label>
              <input
                type="text"
                placeholder="e.g. Mass General Brigham"
                value={hospitalAffiliation}
                onChange={(e) => setHospitalAffiliation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Available Days for Appointments
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => {
                const isSelected = availableDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white border border-brand-400'
                        : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Office Hours
              </label>
              <input
                type="text"
                placeholder="e.g. 9:00 AM - 5:00 PM EST"
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Languages Spoken (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. English, Spanish"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Consultation Formats
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_MODES.map((mode) => {
                const isSelected = consultationModes.includes(mode);
                return (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => toggleMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white border border-teal-400'
                        : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Profile Avatar & Status */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400">
            4. Profile Photo & Publishing Status
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Preset Professional Doctor Photo or Enter URL
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
              {PRESET_AVATARS.map((preset) => (
                <button
                  type="button"
                  key={preset.url}
                  onClick={() => setImage(preset.url)}
                  className={`p-2 rounded-xl border text-left flex flex-col items-center gap-2 transition-all ${
                    image === preset.url
                      ? 'border-brand-500 bg-brand-950/60 ring-2 ring-brand-500'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <span className="text-[10px] text-slate-300 text-center font-medium line-clamp-1">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="url"
              placeholder="Or enter custom image URL (https://...)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-700/80">
            <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="w-4 h-4 text-brand-600 bg-slate-900 border-slate-700 rounded focus:ring-brand-500 cursor-pointer"
              />
              <span className="font-semibold">Display &quot;Verified Doctor&quot; Badge</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-brand-600 bg-slate-900 border-slate-700 rounded focus:ring-brand-500 cursor-pointer"
              />
              <span className="font-semibold">Publish Immediately (Active)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-brand-600 bg-slate-900 border-slate-700 rounded focus:ring-brand-500 cursor-pointer"
              />
              <span className="font-semibold">Feature on Home Page</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/doctors"
            className="px-5 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Publishing Doctor...' : 'Publish Psychiatrist Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
