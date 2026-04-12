import { X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useProfileStore } from '../../store/profile-store'

export default function ProfileSettingsModal({ open, onClose }) {
  const { profile, updateProfile } = useProfileStore()
  const [form, setForm] = useState({
    username: profile.username || '',
    name: profile.name || '',
    email: profile.email || '',
    age: profile.age || '',
    role: profile.role || '',
    company: profile.company || '',
    location: profile.location || '',
    bio: profile.bio || '',
  })

  if (!open) {
    return null
  }

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSave(event) {
    event.preventDefault()
    updateProfile(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 px-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl rounded-[32px] shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
        <CardHeader className="flex flex-row items-start justify-between gap-4 p-8 pb-4">
          <div>
            <CardTitle className="text-2xl">Profile settings</CardTitle>
            <CardDescription>Update your name and a few personal details used across the workspace.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-8 pt-2">
          <form className="space-y-5" onSubmit={handleSave}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Username">
                <Input value={form.username} onChange={(event) => handleChange('username', event.target.value)} />
              </Field>
              <Field label="Full name">
                <Input value={form.name} onChange={(event) => handleChange('name', event.target.value)} />
              </Field>
              <Field label="Email">
                <Input type="email" value={form.email} onChange={(event) => handleChange('email', event.target.value)} />
              </Field>
              <Field label="Age">
                <Input type="number" min="13" value={form.age} onChange={(event) => handleChange('age', event.target.value)} />
              </Field>
              <Field label="Role">
                <Input value={form.role} onChange={(event) => handleChange('role', event.target.value)} />
              </Field>
              <Field label="Company">
                <Input value={form.company} onChange={(event) => handleChange('company', event.target.value)} />
              </Field>
              <Field label="Location">
                <Input value={form.location} onChange={(event) => handleChange('location', event.target.value)} />
              </Field>
            </div>

            <Field label="Bio">
              <Textarea value={form.bio} onChange={(event) => handleChange('bio', event.target.value)} />
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}
