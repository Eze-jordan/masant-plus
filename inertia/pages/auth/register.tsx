
"use client"

import { Head, useForm } from "@inertiajs/react"
import type { FormEventHandler } from "react"
import { useState } from "react"

type RegisterProps = {
  errors?: Record<string, string[]>
  old?: {
    name?: string
    email?: string
  }
}

export default function Register({ errors = {}, old = {} }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  const { data, setData, post, processing } = useForm({
    name: old.name || "",
    email: old.email || "",
    password: "",
    password_confirmation: "",
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post("/auth/register")
  }

  const getError = (field: string) => {
    return errors[field] ? errors[field][0] : null
  }

  return (
    <>
      <Head title="Inscription" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Inscription</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Créez votre compte pour commencer</p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <form className="space-y-6" onSubmit={submit}>
              {/* Champ Nom */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      getError("name")
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Votre nom complet"
                    disabled={processing}
                  />
                  {getError("name") && <p className="mt-2 text-sm text-red-600">{getError("name")}</p>}
                </div>
              </div>

              {/* Champ Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      getError("email")
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="votre@email.com"
                    disabled={processing}
                  />
                  {getError("email") && <p className="mt-2 text-sm text-red-600">{getError("email")}</p>}
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      getError("password")
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                    disabled={processing}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={processing}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                  {getError("password") && <p className="mt-2 text-sm text-red-600">{getError("password")}</p>}
                </div>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showPasswordConfirmation ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      getError("password_confirmation")
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                    disabled={processing}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    disabled={processing}
                  >
                    {showPasswordConfirmation ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                  {getError("password_confirmation") && (
                    <p className="mt-2 text-sm text-red-600">{getError("password_confirmation")}</p>
                  )}
                </div>
              </div>

              {/* Bouton d'inscription */}
              <div>
                <button
                  type="submit"
                  disabled={processing}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    processing ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {processing && (
                    <div className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  )}
                  {processing ? "Inscription..." : "Créer mon compte"}
                </button>
              </div>
            </form>

            {/* Liens supplémentaires */}
            <div className="mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Déjà un compte ?{" "}
                  <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Se connecter
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
