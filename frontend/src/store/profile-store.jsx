import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'cinespike-profile'

const defaultProfile = {
  username: '',
  name: '',
  email: '',
  age: '',
  role: '',
  company: '',
  location: '',
  bio: '',
}

const ProfileStoreContext = createContext(null)

export function ProfileStoreProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultProfile
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  function updateProfile(updates) {
    setProfile((current) => ({ ...current, ...updates }))
  }

  function resetProfile() {
    setProfile(defaultProfile)
  }

  function hydrateProfileFromAuth(updates) {
    setProfile((current) => ({
      ...current,
      ...updates,
    }))
  }

  return (
    <ProfileStoreContext.Provider value={{ hydrateProfileFromAuth, profile, resetProfile, updateProfile }}>
      {children}
    </ProfileStoreContext.Provider>
  )
}

export function useProfileStore() {
  const context = useContext(ProfileStoreContext)
  if (!context) {
    throw new Error('useProfileStore must be used inside ProfileStoreProvider')
  }
  return context
}
