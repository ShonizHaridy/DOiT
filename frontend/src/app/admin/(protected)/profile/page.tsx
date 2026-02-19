'use client'

import { useState } from 'react'
import { Edit2, Lock1, LogoutCurve, ProfileCircle } from 'iconsax-reactjs'
import { useAdminProfile, useUpdateAdminProfile } from '@/hooks/useAdminProfile'
import { useLogout } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useAdminProfile()
  const { mutateAsync, isPending } = useUpdateAdminProfile()
  const logout = useLogout()

  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const openEdit = () => {
    if (!profile) return
    setFullName(profile.fullName ?? '')
    setEmail(profile.email ?? '')
    setPhoneNumber(profile.phoneNumber ?? '')
    setIsEditing(true)
  }

  const cancelEdit = () => {
    if (profile) {
      setFullName(profile.fullName ?? '')
      setEmail(profile.email ?? '')
      setPhoneNumber(profile.phoneNumber ?? '')
    }
    setIsEditing(false)
  }

  const saveEdit = async () => {
    await mutateAsync({
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
    })
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 text-sm text-neutral-500">Loading profile...</div>
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 text-sm text-red-600">Failed to load admin profile.</div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg max-w-4xl p-6">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 mb-5">
            <Edit2 size={30} className="text-neutral-500" />
            <h1 className="text-3xl font-semibold text-neutral-900">Edit Profile</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xl font-medium text-neutral-900 mb-2">Name</label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full h-11 rounded border border-neutral-200 px-3 text-base text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                placeholder="Enter name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xl font-medium text-neutral-900 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full h-11 rounded border border-neutral-200 px-3 text-base text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-xl font-medium text-neutral-900 mb-2">Phone Number</label>
                <input
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="w-full h-11 rounded border border-neutral-200 px-3 text-base text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <button
              type="button"
              onClick={cancelEdit}
              className="h-12 rounded-xl border border-neutral-900 text-neutral-900 text-xl font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEdit}
              disabled={isPending}
              className="h-12 rounded-xl bg-neutral-900 text-white text-xl font-semibold disabled:opacity-60 cursor-pointer"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg max-w-4xl p-6">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 mb-5">
          <ProfileCircle size={30} className="text-neutral-500" />
          <h1 className="text-3xl font-semibold text-neutral-900">My Profile</h1>
        </div>

        <div className="flex items-center gap-6 mb-6">
          {/* <div className="w-40 h-40 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
            <ProfileCircle size={96} className="text-neutral-500" />
          </div> */}

          <div>
            <h2 className="text-5xl font-semibold text-neutral-900">{profile.fullName || profile.adminId}</h2>
            <span className="inline-flex items-center mt-2 px-3 py-1 rounded-md bg-neutral-100 text-neutral-700 text-2xl">
              {profile.role || 'Supervisor'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            type="button"
            onClick={openEdit}
            className="h-12 px-6 rounded-xl border border-neutral-900 text-neutral-900 text-xl font-medium cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            type="button"
            className="h-12 px-6 rounded-xl border border-neutral-900 text-neutral-900 text-xl font-medium cursor-pointer inline-flex items-center gap-2"
            onClick={() => undefined}
          >
            <Lock1 size={18} />
            Reset Password
          </button>
          <button
            type="button"
            onClick={logout}
            className="h-12 px-6 rounded-xl border border-red-400 text-primary text-xl font-medium cursor-pointer inline-flex items-center gap-2"
          >
            <LogoutCurve size={18} />
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xl">
          <div className="flex items-center gap-3">
            <span className="text-neutral-900">Email</span>
            <span className="font-semibold text-neutral-500">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-neutral-900">Phone Number</span>
            <span className="font-semibold text-neutral-500">{profile.phoneNumber || '---'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
