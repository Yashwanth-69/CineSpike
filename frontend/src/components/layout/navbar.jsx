import { LogOut, Menu, Search, Settings, UserCircle2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useProfileStore } from '../../store/profile-store'
import ProfileSettingsModal from './profile-settings-modal'
import { getHealthStatus } from '../../services/analysis-service'

export default function Navbar() {
  const navigate = useNavigate()
  const { profile, resetProfile } = useProfileStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function checkBackendStatus() {
      try {
        const health = await getHealthStatus()
        if (!isMounted) return
        setBackendStatus(health?.status === 'ok' ? 'connected' : 'disconnected')
      } catch {
        if (!isMounted) return
        setBackendStatus('disconnected')
      }
    }

    checkBackendStatus()
    const intervalId = setInterval(checkBackendStatus, 30000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  const displayName = profile.name || profile.username || 'N/A'
  const displayEmail = profile.email || 'N/A'
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'NA'

  function displayValue(value) {
    return value?.toString().trim() ? value : 'N/A'
  }

  function backendStatusLabel() {
    if (backendStatus === 'connected') return 'Backend connected'
    if (backendStatus === 'disconnected') return 'Backend disconnected'
    return 'Checking backend...'
  }

  function backendStatusClassName() {
    if (backendStatus === 'connected') {
      return 'hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 sm:block'
    }
    if (backendStatus === 'disconnected') {
      return 'hidden rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700 sm:block'
    }
    return 'hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700 sm:block'
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="secondary" size="icon" type="button" aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-sm font-semibold text-slate-950">CineSpike</p>
            <p className="text-xs text-slate-500">Modern trailer intelligence</p>
          </div>
        </div>

        <div className="hidden max-w-md flex-1 lg:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-10" placeholder="Search analyses, campaigns, or communities" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className={backendStatusClassName()}>
            {backendStatusLabel()}
          </div>
          <Button variant="secondary" type="button" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:scale-[1.02] hover:shadow-md"
              aria-label="Open profile menu"
            >
              <span className="text-sm font-semibold text-slate-700">{initials}</span>
            </button>

            {menuOpen ? (
              <div className="absolute right-0 top-14 z-40 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.22)]">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-pink-500 via-violet-500 to-sky-500 text-sm font-semibold text-white shadow-sm">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{displayName}</p>
                      <p className="text-sm text-slate-500">{displayEmail}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                      <p className="text-slate-500">Username</p>
                      <p className="mt-1 font-medium text-slate-900">{displayValue(profile.username)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                      <p className="text-slate-500">Role</p>
                      <p className="mt-1 font-medium text-slate-900">{displayValue(profile.role)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                      <p className="text-slate-500">Age</p>
                      <p className="mt-1 font-medium text-slate-900">{displayValue(profile.age)}</p>
                    </div>
                    <div className="col-span-2 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                      <p className="text-slate-500">Company</p>
                      <p className="mt-1 font-medium text-slate-900">{displayValue(profile.company)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      setSettingsOpen(true)
                    }}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      resetProfile()
                      navigate('/login')
                    }}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        </div>
      </header>

      {settingsOpen ? <ProfileSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} /> : null}
    </>
  )
}
