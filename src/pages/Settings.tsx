import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useMe, useUpdateProfile } from '../hooks/useUser';
import type { UpdateProfilePayload } from '../types/user';

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

const Settings: React.FC = () => {
  const { data: profile, isLoading: profileLoading } = useMe();
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState<UpdateProfilePayload>({
    name: '',
    avatarUrl: null,
    bio: null,
    website: null,
    location: null,
    dailyGoal: 20,
    difficultyPreference: 'intermediate',
    notificationsEnabled: true,
    publicProfile: false,
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name ?? '',
      avatarUrl: profile.avatarUrl ?? null,
      bio: profile.bio ?? null,
      website: profile.website ?? null,
      location: profile.location ?? null,
      dailyGoal: profile.dailyGoal ?? 20,
      difficultyPreference: profile.difficultyPreference ?? 'intermediate',
      notificationsEnabled: profile.notificationsEnabled ?? true,
      publicProfile: profile.publicProfile ?? false,
    });
  }, [profile]);

  const handleChange = (field: keyof UpdateProfilePayload) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    if (field === 'dailyGoal') {
      setForm((prev) => ({ ...prev, dailyGoal: parseInt(value, 10) || 0 }));
    } else if (field === 'notificationsEnabled' || field === 'publicProfile') {
      setForm((prev) => ({ ...prev, [field]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value === '' ? null : value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(form);
  };

  if (profileLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-gray-900';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-blue-100">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Cài đặt</h1>
          <p className="text-gray-600">Chỉnh sửa thông tin cá nhân và tùy chọn học tập</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin cá nhân</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            <div>
              <label className={labelClass}>Tên hiển thị</label>
              <input
                type="text"
                value={form.name ?? ''}
                onChange={handleChange('name')}
                className={inputClass}
                placeholder="Tên của bạn"
                maxLength={100}
              />
            </div>
            <div>
              <label className={labelClass}>Ảnh đại diện (URL)</label>
              <input
                type="url"
                value={form.avatarUrl ?? ''}
                onChange={handleChange('avatarUrl')}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Giới thiệu ngắn (bio)</label>
            <textarea
              value={form.bio ?? ''}
              onChange={handleChange('bio')}
              className={`${inputClass} min-h-[80px] resize-y`}
              placeholder="Vài dòng về bạn..."
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            <div>
              <label className={labelClass}>Website</label>
              <input
                type="url"
                value={form.website ?? ''}
                onChange={handleChange('website')}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className={labelClass}>Vị trí</label>
              <input
                type="text"
                value={form.location ?? ''}
                onChange={handleChange('location')}
                className={inputClass}
                placeholder="Thành phố, quốc gia"
                maxLength={100}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Tùy chọn học tập</h3>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              <div>
                <label className={labelClass}>Mục tiêu từ/ngày</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={form.dailyGoal ?? 20}
                  onChange={handleChange('dailyGoal')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Độ khó ưu tiên</label>
                <select
                  value={form.difficultyPreference ?? 'intermediate'}
                  onChange={handleChange('difficultyPreference')}
                  className={inputClass}
                >
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notificationsEnabled ?? true}
                onChange={handleChange('notificationsEnabled')}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Bật thông báo</span>
            </label>
            <label  className="flex items-center gap-3 cursor-pointer hidden">
              <input
                type="checkbox"
                checked={form.publicProfile ?? false}
                onChange={handleChange('publicProfile')}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Hiển thị profile công khai</span>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="px-6 py-2.5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {updateProfile.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
