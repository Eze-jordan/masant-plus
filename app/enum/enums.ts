// Statut d'un utilisateur
export const Status = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
} as const
export type Status = (typeof Status)[keyof typeof Status]

// Statut d'un rendez-vous
export const EtatRDV = {
  PENDING: 'PENDING',
  ANNULE: 'ANNULE',
  CONFIRME: 'CONFIRME',
} as const
export type EtatRDV = (typeof EtatRDV)[keyof typeof EtatRDV]

// Type de rendez-vous
export const TypeRDV = {
  APPEL: 'APPEL',
  VIDEO: 'VIDEO',
  PHYSIQUE: 'PHYSIQUE',
} as const
export type TypeRDV = (typeof TypeRDV)[keyof typeof TypeRDV]

// Statut d’un paiement
export const StatusPaiement = {
  EN_ATTENTE: 'EN_ATTENTE',
  PAYE: 'PAYE',
  ECHOUE: 'ECHOUE',
} as const
export type StatusPaiement = (typeof StatusPaiement)[keyof typeof StatusPaiement]

// Statut de traitement d'une suggestion
export const StatutSuggestion = {
  NON_TRAITE: 'NON_TRAITE',
  EN_COURS: 'EN_COURS',
  TRAITE: 'TRAITE',
} as const
export type StatutSuggestion = (typeof StatutSuggestion)[keyof typeof StatutSuggestion]
