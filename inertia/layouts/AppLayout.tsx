
import React from 'react'
import { Link, usePage } from '@inertiajs/react'

type AppLayoutProps = {
  children: React.ReactNode
}

type User = {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
}

type InertiaPageProps = {
  user?: User | null
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { props } = usePage<InertiaPageProps>()
  const user = props.user

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Ma Santé+</h1>
          {user ? (
            <div className="text-sm text-gray-700">
              Bonjour, {user.email} | <Link href="/logout" className="text-blue-600">Déconnexion</Link>
            </div>
          ) : (
            <div className="space-x-4 text-sm">
              <Link href="/login" className="text-blue-600">Connexion</Link>
              <Link href="/register" className="text-blue-600">Créer un compte</Link>
            </div>
          )}
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
