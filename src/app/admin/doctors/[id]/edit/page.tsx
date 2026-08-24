'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Save, 
  Trash2,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { SPECIALIZATIONS_LIST, INITIAL_DOCTORS } from '@/lib/mockData';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ALL_MODES = ['Phone Call', 'Video Consultation', 'In-Person', 'Email'];

export default function EditDoctorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [customSpec, setCustomSpec] = useState('');
  const [experience, setExperience] = useState('10');
  const [education, setEducation] = useState('');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [location, setLocation] = useState('');
  const [consultationFee, setConsultationFee] = useState('150');
  const [currency, setCurrency] = useState('USD');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableHours, setAvailableHours] = useState('');
  const [consultationModes, setConsultationModes] = useState<string[]>([]);
  const [languages, setLanguages] = useState('English');
  const [image, setImage] = useState('');
  const [isVerified, setIsVerified] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/doctors/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const doc = data.doctor || INITIAL_DOCTORS.find((d) => d.id === id);
        if (doc) {
          setName(doc.name || '');
          setTitle(doc.title || '');
          setEmail(doc.email || '');
          setPhone(doc.phone || '');
          setBio(doc.bio || '');
          setSelectedSpecs(doc.specializations || []);
          setExperience(String(doc.experience || '5'));
          setEducation(doc.education || '');
          setHospitalAffiliation(doc.hospitalAffiliation || '');
          setLocation(doc.location || '');
          setConsultationFee(String(doc.consultationFee || '150'));
          setCurrency(doc.currency || 'USD');
          setAvailableDays(doc.availableDays || []);
          setAvailableHours(doc.availableHours || '');
          setConsultationModes(doc.consultationModes || []);
          setLanguages(Array.isArray(doc.languages) ? doc.languages.join(', ') : 'English');
          setImage(doc.image || '');
          setIsVerified(doc.isVerified !== undefined ? doc.isVerified : true);
          setIsActive(doc.isActive !== undefined ? doc.isActive : true);
          setIsFeatured(doc.isFeatured !== undefined ? doc.isFeatured : false);
        }
      })
      .catch((err) => {
        console.warn('Error loading doctor:', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

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
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/doctors/${id}`, {
        method: 'PUT',
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
        throw new Error(data.error || 'Failed to update doctor profile');
      }

      setSuccess('Doctor profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-xs">Loading doctor details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <Link
            href="/admin/doctors"
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Doctors Directory</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Edit Doctor Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Editing {name || 'Doctor'}
          </p>
        </div>

        <Link
          href={`/doctors/${id}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5 text-teal-400" />
          <span>View Public Profile</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Professional Title / Sub-specialty
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Direct Clinic Phone (for Bookings) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Direct Booking Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Location / City / Telehealth Coverage
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Biography & Treatment Philosophy <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 leading-relaxed"
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

          <div className="flex items-center gap-2 pt-2 max-w-sm">
            <input
              type="text"
              placeholder="Add other specialty..."
              value={customSpec}
              onChange={(e) => setCustomSpec(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-brand-500 flex-1"
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

        {/* Section 3: Credentials & Rates */}
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
                Consultation Fee ($)
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
                Currency
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Education & Residencies
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hospital Affiliation
              </label>
              <input
                type="text"
                value={hospitalAffiliation}
                onChange={(e) => setHospitalAffiliation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
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
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Languages Spoken
              </label>
              <input
                type="text"
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

        {/* Section 4: Image & Status */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400">
            4. Image URL & Status
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Profile Photo URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
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
              <span className="font-semibold">Verified Doctor Badge</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-brand-600 bg-slate-900 border-slate-700 rounded focus:ring-brand-500 cursor-pointer"
              />
              <span className="font-semibold">Active in Directory</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-brand-600 bg-slate-900 border-slate-700 rounded focus:ring-brand-500 cursor-pointer"
              />
              <span className="font-semibold">Featured on Home Page</span>
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
            disabled={saving}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Updates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
