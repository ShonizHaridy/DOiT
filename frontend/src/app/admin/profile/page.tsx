'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { 
  User, 
  Edit2, 
  Lock1, 
  LogoutCurve,
  GalleryEdit
} from 'iconsax-reactjs'

interface UserProfile {
  name: string
  role: string
  email: string
  phone: string
  avatar?: string
}

// Sample user data
const userProfile: UserProfile = {
  name: 'Ahemd Ashraf',
  role: 'Supervisor',
  email: 'ahmed@doit.com',
  phone: '01018128987',
  avatar: '/avatars/admin.jpg'
}

export default function ProfilePage() {
  return (
    <AdminLayout>
      <div className="p-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 pb-4">
            <User size={24} variant="Linear" className="text-neutral-600" />
            <h1 className="text-xl font-semibold text-neutral-900">My Profile</h1>
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar and Info */}
            <div className="flex items-center gap-6 mb-6">
              {/* Avatar with Edit Overlay */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-neutral-200 overflow-hidden">
                  {/* Placeholder avatar */}
                  <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-neutral-500">
                      <circle cx="24" cy="18" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 44C8 35.1634 15.1634 28 24 28C32.8366 28 40 35.1634 40 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                {/* Edit overlay button */}
                <button 
                  className="absolute bottom-1 right-1 w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors border border-neutral-200"
                  title="Change photo"
                >
                  <GalleryEdit size={16} variant="Linear" className="text-neutral-600" />
                </button>
              </div>

              {/* Name and Role */}
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">{userProfile.name}</h2>
                <span className="inline-block mt-1 px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-full">
                  {userProfile.role}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-8">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                Edit Profile
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                Reset Password
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-red-200 rounded-lg text-sm font-medium text-primary hover:bg-red-50 transition-colors">
                <LogoutCurve size={18} variant="Linear" />
                Log Out
              </button>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-12">
              <div>
                <span className="text-sm font-medium text-neutral-900">Email</span>
                <p className="text-sm text-neutral-500 mt-0.5">{userProfile.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-neutral-900">Phone Number</span>
                <p className="text-sm text-neutral-500 mt-0.5">{userProfile.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
