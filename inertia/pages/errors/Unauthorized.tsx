// resources/js/Pages/Errors/Unauthorized.tsx

import React from 'react'
import { Head } from '@inertiajs/react'

type UnauthorizedProps = {
  message: string
}

const Unauthorized: React.FC<UnauthorizedProps> = ({ message }) => {
  return (
    <>
      <Head title="Accès refusé" />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-600">Erreur 401</h2>
          <p className="mt-4 text-lg text-gray-800">{message}</p>
        </div>
      </div>
    </>
  )
}

export default Unauthorized
