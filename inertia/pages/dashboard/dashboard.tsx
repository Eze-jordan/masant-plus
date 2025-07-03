import { Head } from '@inertiajs/react'
import AppLayout from '../../layouts/AppLayout'

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
    <>
      <AppLayout>
        <Head title="Dashboard" />

        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">

          {/* Section utilisateur connecté */}
          <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
              Bienvenue, {user.firstName} {user.lastName} 👋
            </h1>
            <p className="text-gray-600 mb-4">Voici vos informations personnelles :</p>
            <div className="border-t border-gray-200 pt-4">
              <ul className="space-y-3 text-gray-800 text-base">
                <li>
                  <span className="font-medium text-gray-700">📧 Email :</span> {user.email}
                </li>
                <li>
                  <span className="font-medium text-gray-700">🆔 ID :</span> {user.id}
                </li>
              </ul>
            </div>
          </div>

          {/* Section liste des utilisateurs */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Liste des utilisateurs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {users.map((u) => (
                <div key={u.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-2">{u.firstName} {u.lastName}</h3>
                  <p><strong>Email:</strong> {u.email}</p>
                  <p><strong>ID:</strong> {u.id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  )
}