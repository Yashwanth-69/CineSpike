import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('Auth UI is ready, but backend login is not connected yet. For now, this takes you into the product shell.')
    window.setTimeout(() => {
      navigate('/dashboard')
    }, 700)
  }

  return (
    <Card className="rounded-[32px]">
      <CardHeader className="p-8 pb-4">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Welcome back</p>
        <CardTitle className="text-3xl">Log in to CineSpike</CardTitle>
        <CardDescription>
          Access your analysis workspace, campaign planning surface, and trailer history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-8 pt-2">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="login-email">
              Work email
            </label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@studio.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700" htmlFor="login-password">
                Password
              </label>
              <button type="button" className="text-sm text-indigo-600 transition hover:text-indigo-700">
                Forgot password?
              </button>
            </div>
            <Input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {message ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {message}
            </div>
          ) : null}

          <Button className="w-full" size="lg" type="submit">
            Log In
          </Button>
        </form>

        <div className="grid gap-3">
          <Button variant="secondary" size="lg" type="button">
            Continue with Google
          </Button>
          <Button variant="secondary" size="lg" type="button">
            Continue with Microsoft
          </Button>
        </div>

        <p className="text-center text-sm text-slate-500">
          New to CineSpike?{' '}
          <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/signup">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
