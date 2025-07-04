import { Head } from '@inertiajs/react'
import AppLayout from '../../layouts/AppLayout.js'

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type DashboardProps = {
  user: User
  users: User[]
}

export default function Dashboard({ user, users }: DashboardProps) {
  return (
    <AppLayout>
      <Head title="Dashboard" />

      <main className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Profil utilisateur connecté */}
        <section
          aria-labelledby="user-info-heading"
          className="bg-white shadow-md rounded-lg p-8 max-w-3xl mx-auto"
        >
          <h1 id="user-info-heading" className="text-3xl font-bold text-gray-900 mb-4">
            Bienvenue, {user.firstName} {user.lastName} 👋
          </h1>
          <p className="text-gray-600 mb-6">Voici vos informations personnelles :</p>
          <ul className="space-y-2 text-gray-800 text-base border-t border-gray-200 pt-4">
            <li>
              <span className="font-semibold text-gray-700">📧 Email :</span> {user.email}
            </li>
            <li>
              <span className="font-semibold text-gray-700">🆔 ID :</span> {user.id}
            </li>
          </ul>
        </section>

        {/* Liste des utilisateurs */}
        <section aria-labelledby="user-list-heading">
          <h2 id="user-list-heading" className="text-2xl font-semibold text-gray-900 mb-6">
            Liste des utilisateurs ({users.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6"
              >
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  {u.firstName} {u.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {u.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>ID:</strong> {u.id}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  )
}
