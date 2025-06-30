import axios, { AxiosError } from 'axios'
import base64 from 'base-64';  // Changement ici : importation par défaut
const base64Encode = base64.encode; // Utilisation de `encode`

// 🔐 Récupération des credentials depuis .env
const username = process.env.EBILLING_USERNAME
const sharedkey = process.env.EBILLING_SHAREDKEY
const domain = process.env.EBILLING_DOMAIN


// 🔒 Encodage des credentials
const credentials = `${username}:${sharedkey}`
const encodedCredentials = base64Encode(credentials)

// Configuration Axios
const api = axios.create({
  baseURL: domain,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Basic ' + encodedCredentials,
  },
})

// Interfaces de données
export interface InvoiceData {
  amount: number
  payer_msisdn: string
  payer_email: string
  short_description: string
  external_reference: string
  description?: string
  expiry_period?: string
}

export interface PushUssdData {
  bill_id: string
  payer_msisdn: string
  payment_system_name: string // 'airtelmoney' | 'moovmoney'
}

// Créer une facture
export async function CreateInvoice(data: InvoiceData) {
  try {
    const response = await api.post('/merchant/e_bills.json', data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erreur lors de la création de la facture :', error.response?.data)
      throw error.response?.data
    } else {
      console.error('Erreur inattendue :', error)
      throw error
    }
  }
}

// Envoyer un push USSD
export async function MakePushUSSD(data: PushUssdData) {
  try {
    const { bill_id, payer_msisdn, payment_system_name } = data
    const response = await api.post(`/merchant/e_bills/${bill_id}/ussd_push`, {
      payer_msisdn,
      payment_system_name,
    })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Erreur lors de l'envoi du push USSD :", error.response?.data)
      throw error.response?.data
    } else {
      console.error('Erreur inattendue :', error)
      throw error
    }
  }
}

// Vérifier l’état d’une facture
export async function GetInvoice(bill_id: string) {
  try {
    const response = await api.get(`/merchant/e_bills/${bill_id}.json`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erreur lors de la récupération de la facture :', error.response?.data)
      throw error.response?.data
    } else {
      console.error('Erreur inattendue :', error)
      throw error
    }
  }
}
