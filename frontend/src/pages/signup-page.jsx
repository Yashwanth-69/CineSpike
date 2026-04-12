import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
  })
  const [message, setMessage] = useState('')

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('Sign-up UI is ready, but backend account creation is not connected yet. For now, this takes you into the product shell.')
    window.setTimeout(() => {
      navigate('/dashboard')
    }, 700)
  }

  return (
    <Card className="rounded-[32px]">
      <CardHeader className="p-8 pb-4">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Create account</p>
        <CardTitle className="text-3xl">Start your CineSpike workspace</CardTitle>
        <CardDescription>
          Set up an account for trailer analysis, audience mapping, and campaign planning.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-8 pt-2">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="signup-name">
                Full name
              </label>
              <Input
                id="signup-name"
                placeholder="Ava Johnson"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="signup-company">
                Studio or team
              </label>
              <Input
                id="signup-company"
                placeholder="Northlight Pictures"
                value={form.company}
                onChange={(event) => updateField('company', event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="signup-email">
              Work email
            </label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@studio.com"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="signup-password">
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Create a secure password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              required
            />
          </div>

          {message ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {message}
            </div>
          ) : null}

          <Button className="w-full" size="lg" type="submit">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/login">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
