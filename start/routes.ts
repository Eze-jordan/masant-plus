import router from '@adonisjs/core/services/router'
import { promises as fs } from 'fs'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'
import {ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import OnlyFrontendMiddleware from '#middleware/only_frontend_middleware'
import AppKeyGuard from '#middleware/app_key_guard_middleware'
const DemandeController =new DemandeDocteurController()
import { throttle } from '#start/limiter'
import RegisterController from '#controllers/RegisterController'
import AuthController from '#controllers/auth_controller'
import PatientsController from '#controllers/patients_controller'
import ConsultationsController from '#controllers/consultations_controller'
import PaymentsController from '#controllers/payments_controller'
import DoctorsController from '#controllers/doctors_controller'
import swaggerSpec from './swagger.js'
const doctorAll   =  new   doctor_displays_controller()
import PasswordResetController from '#controllers/otps_controller'
import AccountDeletionController from '#controllers/account_deletions_controller'
import AccountManagementController from '#controllers/AccountManagementController'
import FeedbackController from '#controllers/FeedbackController'
import LikesController from '#controllers/likes_controller'
import SuggestionController from '#controllers/suggestions_controller'
import LivesController from '#controllers/lives_controller'
import MessagesController from '#controllers/MessagesController'
import PaiementsController from '#controllers/PaiementsController'
import NotificationController from '#controllers/notifications_controller'
import UsersController from '#controllers/UsersController'
import UsersControllers from '#controllers/users_controller'

import DisponibilitesController from '#controllers/disponibilities_controller'
import AppointmentController from '#controllers/appointments_controller'
import { verifyJwtToken } from '../app/Utils/verifytoken.js'
import User from '#models/user'
const patient   =  new    PatientController()
import update_users_controller from '#controllers/update_users_controller'
import live_for_users_controller from '#controllers/live_for_users_controller'
import retraits_controller from '#controllers/retraits_controller';
import Paiement from '#models/paiement';
import PatientController from '#controllers/PatientController';
import verify_emails_controller from '#controllers/verify_emails_controller';
import DemandeDocteurController from '#controllers/DemandeDocteurController';
import doctor_displays_controller from '#controllers/doctor_displays_controller';
const disponibilityuser  =  new    DisponibilitesController()
const userupdate    =  new   update_users_controller()
const emailverify = new verify_emails_controller()
 const  NotificationControllers  = new  NotificationController()
const  loginadmin = new  UsersControllers()
const controller = new MessagesController()
const user  = new  UsersController()
const livecontroller    = new  live_for_users_controller()
const appointmentController = new AppointmentController()
const livesController = new LivesController()
const paymentre   = new retraits_controller()
const doctorsController = new DoctorsController()
const feedbackController = new FeedbackController()
const deletecompte  = new AccountDeletionController()
const suggestionController = new SuggestionController()
const patientsController = new PatientsController()
const consultationsController = new ConsultationsController()
const admins   = new  AccountManagementController()
const authController = new AuthController()
const likesController = new LikesController()
const onlyFrontend = new OnlyFrontendMiddleware()
const appKeyGuard = new AppKeyGuard()
const registerController = new RegisterController()
const passwordResetController = new PasswordResetController()
// Upload route sécurisée et filtrée



/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Connexion utilisateur
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */

/**
 * @swagger
 * /paiements/solde/{userId}:
 *   get:
 *     tags:
 *       - Paiements
 *     summary: Obtenir le solde d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solde récupéré avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /medecins/{userId}/specialty:
 *   get:
 *     tags:
 *       - Médecins
 *     summary: Obtenir la spécialité d'un médecin
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Spécialité récupérée avec succès
 *       404:
 *         description: Médecin non trouvé
 */

/**
 * @swagger
 * /paiements/gains-mois/{userId}:
 *   get:
 *     tags:
 *       - Paiements
 *     summary: Obtenir les gains mensuels d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gains mensuels récupérés
 *       404:
 *         description: Données non trouvées
 */

/**
 * @swagger
 * /upload/image:
 *   post:
 *     tags:
 *       - Fichiers
 *     summary: Uploader une image
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: Fichier image à uploader
 *     responses:
 *       201:
 *         description: Image uploadée avec succès
 *       400:
 *         description: Aucun fichier fourni
 *       500:
 *         description: Erreur lors de l'upload
 */

/**
 * @swagger
 * /get-url:
 *   get:
 *     tags:
 *       - Fichiers
 *     summary: Obtenir l'URL signée d'un fichier
 *     parameters:
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL générée avec succès
 *       400:
 *         description: Nom de fichier manquant
 *       500:
 *         description: Erreur de configuration AWS
 */

/**
 * @swagger
 * /users/{id}/status:
 *   put:
 *     tags:
 *       - Utilisateurs
 *     summary: Mettre à jour le statut d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Utilisateurs
 *     summary: Obtenir les informations d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *   delete:
 *     tags:
 *       - Utilisateurs
 *     summary: Supprimer un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 *   put:
 *     tags:
 *       - Utilisateurs
 *     summary: Mettre à jour un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Enregistrer un nouvel utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur enregistré
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /patients/count/{userId}:
 *   get:
 *     tags:
 *       - Patients
 *     summary: Compter les patients d'un médecin
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nombre de patients
 *       404:
 *         description: Médecin non trouvé
 */

/**
 * @swagger
 * /consultations/{userId}:
 *   get:
 *     tags:
 *       - Consultations
 *     summary: Obtenir les consultations d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des consultations
 *       404:
 *         description: Aucune consultation trouvée
 */

/**
 * @swagger
 * /list-files/{prefix}:
 *   get:
 *     tags:
 *       - Fichiers
 *     summary: Lister les fichiers dans un dossier S3
 *     parameters:
 *       - in: path
 *         name: prefix
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des fichiers
 *       404:
 *         description: Aucun fichier trouvé
 */

/**
 * @swagger
 * /paiements/mobile-money:
 *   post:
 *     tags:
 *       - Paiements
 *     summary: Créer une facture Mobile Money
 *     responses:
 *       200:
 *         description: Facture créée
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /auth/request-reset:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Demander une réinitialisation de mot de passe
 *     responses:
 *       200:
 *         description: Demande envoyée
 *       400:
 *         description: Email invalide
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Réinitialiser le mot de passe
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *       400:
 *         description: Token ou mot de passe invalide
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Vérifier un OTP
 *     responses:
 *       200:
 *         description: OTP valide
 *       400:
 *         description: OTP invalide
 */

/**
 * @swagger
 * /account/delete/{userId}:
 *   post:
 *     tags:
 *       - Comptes
 *     summary: Supprimer un compte utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compte supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /account/all:
 *   get:
 *     tags:
 *       - Comptes
 *     summary: Lister tous les comptes
 *     responses:
 *       200:
 *         description: Liste des comptes
 */

/**
 * @swagger
 * /paiement/invoice-status/{billId}:
 *   get:
 *     tags:
 *       - Paiements
 *     summary: Obtenir le statut d'une facture
 *     parameters:
 *       - in: path
 *         name: billId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut de la facture
 *       404:
 *         description: Facture non trouvée
 */

/**
 * @swagger
 * /paiement/all:
 *   get:
 *     tags:
 *       - Paiements
 *     summary: Lister tous les paiements
 *     responses:
 *       200:
 *         description: Liste des paiements
 */

/**
 * @swagger
 * /admin/account/create:
 *   post:
 *     tags:
 *       - Administration
 *     summary: Créer un compte administrateur
 *     responses:
 *       201:
 *         description: Compte créé
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /admin/account/suspend/{userId}:
 *   put:
 *     tags:
 *       - Administration
 *     summary: Suspendre un compte
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compte suspendu
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/account/delete/{userId}:
 *   delete:
 *     tags:
 *       - Administration
 *     summary: Supprimer un compte administrateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compte supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/account/{userId}:
 *   get:
 *     tags:
 *       - Administration
 *     summary: Obtenir les détails d'un compte
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du compte
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/accounts:
 *   get:
 *     tags:
 *       - Administration
 *     summary: Lister tous les comptes
 *     responses:
 *       200:
 *         description: Liste des comptes
 */

/**
 * @swagger
 * /paiements/mobile-money:
 *   get:
 *     tags:
 *       - Paiements
 *     summary: Obtenir les paiements Mobile Money
 *     responses:
 *       200:
 *         description: Liste des paiements
 */

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     tags:
 *       - Feedbacks
 *     summary: Créer un feedback
 *     responses:
 *       201:
 *         description: Feedback créé
 *       400:
 *         description: Données invalides
 *   get:
 *     tags:
 *       - Feedbacks
 *     summary: Lister les feedbacks
 *     responses:
 *       200:
 *         description: Liste des feedbacks
 */

/**
 * @swagger
 * /feedbacks/{id}:
 *   put:
 *     tags:
 *       - Feedbacks
 *     summary: Mettre à jour un feedback
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback mis à jour
 *       404:
 *         description: Feedback non trouvé
 *   delete:
 *     tags:
 *       - Feedbacks
 *     summary: Supprimer un feedback
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback supprimé
 *       404:
 *         description: Feedback non trouvé
 */

/**
 * @swagger
 * /admin/feedbacks:
 *   get:
 *     tags:
 *       - Administration
 *     summary: Lister tous les feedbacks (admin)
 *     responses:
 *       200:
 *         description: Liste des feedbacks
 */

/**
 * @swagger
 * /admin/feedbacks/{id}:
 *   delete:
 *     tags:
 *       - Administration
 *     summary: Supprimer un feedback (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback supprimé
 *       404:
 *         description: Feedback non trouvé
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     tags:
 *       - Likes
 *     summary: Ajouter un like
 *     responses:
 *       201:
 *         description: Like ajouté
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /likes/doctor/{idDoctor}:
 *   get:
 *     tags:
 *       - Likes
 *     summary: Obtenir les likes d'un médecin
 *     parameters:
 *       - in: path
 *         name: idDoctor
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des likes
 *       404:
 *         description: Médecin non trouvé
 *   delete:
 *     tags:
 *       - Likes
 *     summary: Supprimer tous les likes d'un médecin
 *     parameters:
 *       - in: path
 *         name: idDoctor
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Likes supprimés
 *       404:
 *         description: Médecin non trouvé
 */

/**
 * @swagger
 * /lives:
 *   post:
 *     tags:
 *       - Lives
 *     summary: Créer un live
 *     responses:
 *       201:
 *         description: Live créé
 *       400:
 *         description: Données invalides
 *   get:
 *     tags:
 *       - Lives
 *     summary: Lister les lives
 *     responses:
 *       200:
 *         description: Liste des lives
 */

/**
 * @swagger
 * /lives/{id}:
 *   put:
 *     tags:
 *       - Lives
 *     summary: Mettre à jour un live
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live mis à jour
 *       404:
 *         description: Live non trouvé
 *   delete:
 *     tags:
 *       - Lives
 *     summary: Supprimer un live
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live supprimé
 *       404:
 *         description: Live non trouvé
 */

/**
 * @swagger
 * /suggestions:
 *   post:
 *     tags:
 *       - Suggestions
 *     summary: Créer une suggestion
 *     responses:
 *       201:
 *         description: Suggestion créée
 *       400:
 *         description: Données invalides
 *   get:
 *     tags:
 *       - Suggestions
 *     summary: Lister les suggestions
 *     responses:
 *       200:
 *         description: Liste des suggestions
 */

/**
 * @swagger
 * /suggestions/{id}:
 *   get:
 *     tags:
 *       - Suggestions
 *     summary: Obtenir une suggestion
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la suggestion
 *       404:
 *         description: Suggestion non trouvée
 *   put:
 *     tags:
 *       - Suggestions
 *     summary: Mettre à jour une suggestion
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion mise à jour
 *       404:
 *         description: Suggestion non trouvée
 *   delete:
 *     tags:
 *       - Suggestions
 *     summary: Supprimer une suggestion
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion supprimée
 *       404:
 *         description: Suggestion non trouvée
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Envoyer un message
 *     responses:
 *       201:
 *         description: Message envoyé
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /messages/user/{userId}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Obtenir les messages d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des messages
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /messages/discussion/{discussionId}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Obtenir les messages d'une discussion
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des messages
 *       404:
 *         description: Discussion non trouvée
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Supprimer tous les messages d'une discussion
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages supprimés
 *       404:
 *         description: Discussion non trouvée
 */

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     tags:
 *       - Messages
 *     summary: Mettre à jour un message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message mis à jour
 *       404:
 *         description: Message non trouvé
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Supprimer un message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message supprimé
 *       404:
 *         description: Message non trouvé
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Obtenir les notifications de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des notifications
 */

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Obtenir une notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la notification
 *       404:
 *         description: Notification non trouvée
 *   put:
 *     tags:
 *       - Notifications
 *     summary: Marquer une notification comme lue
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marquée comme lue
 *       404:
 *         description: Notification non trouvée
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Supprimer une notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification supprimée
 *       404:
 *         description: Notification non trouvée
 */

/**
 * @swagger
 * /notifications/{id}/readAll:
 *   put:
 *     tags:
 *       - Notifications
 *     summary: Marquer toutes les notifications comme lues
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Toutes les notifications marquées comme lues
 */

/**
 * @swagger
 * /appointments/doctor:
 *   get:
 *     tags:
 *       - Rendez-vous
 *     summary: Obtenir les rendez-vous d'un médecin
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     tags:
 *       - Rendez-vous
 *     summary: Créer un rendez-vous
 *     responses:
 *       201:
 *         description: Rendez-vous créé
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /disponibilites:
 *   get:
 *     tags:
 *       - Disponibilités
 *     summary: Lister les disponibilités
 *     responses:
 *       200:
 *         description: Liste des disponibilités
 *   post:
 *     tags:
 *       - Disponibilités
 *     summary: Créer une disponibilité
 *     responses:
 *       201:
 *         description: Disponibilité créée
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /disponibilites/{id}:
 *   get:
 *     tags:
 *       - Disponibilités
 *     summary: Obtenir une disponibilité
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la disponibilité
 *       404:
 *         description: Disponibilité non trouvée
 *   put:
 *     tags:
 *       - Disponibilités
 *     summary: Mettre à jour une disponibilité
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disponibilité mise à jour
 *       404
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     AppKey:
 *       type: apiKey
 *       in: header
 *       name: X-App-Key
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         specialty:
 *           type: string
 *         registrationNumber:
 *           type: string
 *         accountStatus:
 *           type: string
 *         profileImage:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /upload/{filePath}:
 *   get:
 *     tags: [Fichiers]
 *     summary: Télécharger un fichier PDF sécurisé
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filePath
 *         required: true
 *         schema:
 *           type: string
 *         description: Chemin du fichier à lire (PDF uniquement)
 *     responses:
 *       200:
 *         description: Le fichier PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Format non autorisé
 *       404:
 *         description: Fichier introuvable
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Authentification]
 *     summary: Connexion utilisateur
 *     security:
 *       - AppKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Identifiants invalides
 */

/**
 * @swagger
 * /paiements/solde/{userId}:
 *   get:
 *     tags: [Paiements]
 *     summary: Obtenir le solde d'un utilisateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solde récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 solde:
 *                   type: number
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /medecins/{userId}/specialty:
 *   get:
 *     tags: [Médecins]
 *     summary: Obtenir la spécialité d'un médecin
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Spécialité récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 specialty:
 *                   type: string
 *       404:
 *         description: Médecin non trouvé
 */

/**
 * @swagger
 * /paiements/gains-mois/{userId}:
 *   get:
 *     tags: [Paiements]
 *     summary: Obtenir les gains mensuels d'un utilisateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gains mensuels récupérés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gains:
 *                   type: number
 *       404:
 *         description: Données non trouvées
 */

/**
 * @swagger
 * /upload/image:
 *   post:
 *     tags: [Fichiers]
 *     summary: Uploader une image
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: Fichier image à uploader
 *     responses:
 *       201:
 *         description: Image uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Aucun fichier fourni
 *       500:
 *         description: Erreur lors de l'upload
 */

/**
 * @swagger
 * /get-url:
 *   get:
 *     tags: [Fichiers]
 *     summary: Obtenir l'URL signée d'un fichier
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL générée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       400:
 *         description: Nom de fichier manquant
 *       500:
 *         description: Erreur de configuration AWS
 */

/**
 * @swagger
 * /users/{id}/status:
 *   put:
 *     tags: [Utilisateurs]
 *     summary: Mettre à jour le statut d'un utilisateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Utilisateurs]
 *     summary: Obtenir les informations d'un utilisateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *   delete:
 *     tags: [Utilisateurs]
 *     summary: Supprimer un utilisateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 *   put:
 *     tags: [Utilisateurs]
 *     summary: Mettre à jour un utilisateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Authentification]
 *     summary: Enregistrer un nouvel utilisateur
 *     security:
 *       - AppKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur enregistré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /patients/count/{userId}:
 *   get:
 *     tags: [Patients]
 *     summary: Compter les patients d'un médecin
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nombre de patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       404:
 *         description: Médecin non trouvé
 */

/**
 * @swagger
 * /patients:
 *   get:
 *     tags: [Patients]
 *     summary: Lister tous les patients
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des patients récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /consultations/{userId}:
 *   get:
 *     tags: [Consultations]
 *     summary: Obtenir les consultations d'un utilisateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des consultations
 *       404:
 *         description: Aucune consultation trouvée
 */

/**
 * @swagger
 * /list-files/{prefix}:
 *   get:
 *     tags: [Fichiers]
 *     summary: Lister les fichiers dans un dossier S3
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prefix
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des fichiers
 *       404:
 *         description: Aucun fichier trouvé
 */

/**
 * @swagger
 * /paiements/mobile-money:
 *   post:
 *     tags: [Paiements]
 *     summary: Créer une facture Mobile Money
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               phone:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Facture créée
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /auth/request-reset:
 *   post:
 *     tags: [Authentification]
 *     summary: Demander une réinitialisation de mot de passe
 *     security:
 *       - AppKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Demande envoyée
 *       400:
 *         description: Email invalide
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Authentification]
 *     summary: Réinitialiser le mot de passe
 *     security:
 *       - AppKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *       400:
 *         description: Token ou mot de passe invalide
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     tags: [Authentification]
 *     summary: Vérifier un OTP
 *     security:
 *       - AppKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP valide
 *       400:
 *         description: OTP invalide
 */

/**
 * @swagger
 * /account/delete/{userId}:
 *   post:
 *     tags: [Utilisateurs]
 *     summary: Supprimer un compte utilisateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compte supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /account/all:
 *   get:
 *     tags: [Utilisateurs]
 *     summary: Lister tous les comptes
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des comptes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /paiement/invoice-status/{billId}:
 *   get:
 *     tags: [Paiements]
 *     summary: Obtenir le statut d'une facture
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: billId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut de la facture
 *       404:
 *         description: Facture non trouvée
 */

/**
 * @swagger
 * /paiement/all:
 *   get:
 *     tags: [Paiements]
 *     summary: Lister tous les paiements
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des paiements
 */

/**
 * @swagger
 * /admin/account/create:
 *   post:
 *     tags: [Administration]
 *     summary: Créer un compte administrateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Compte créé
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /admin/account/suspend/{userId}:
 *   put:
 *     tags: [Administration]
 *     summary: Suspendre un compte
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compte suspendu
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/account/delete/{userId}:
 *   delete:
 *     tags: [Administration]
 *     summary: Supprimer un compte administrateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compte supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/account/{userId}:
 *   get:
 *     tags: [Administration]
 *     summary: Obtenir les détails d'un compte
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du compte
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/accounts:
 *   get:
 *     tags: [Administration]
 *     summary: Lister tous les comptes
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des comptes
 */

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     tags: [Feedbacks]
 *     summary: Créer un feedback
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback créé
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /feedbacks/{id}:
 *   put:
 *     tags: [Feedbacks]
 *     summary: Mettre à jour un feedback
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback mis à jour
 *       404:
 *         description: Feedback non trouvé
 */

/**
 * @swagger
 * /admin/feedbacks:
 *   get:
 *     tags: [Administration]
 *     summary: Lister tous les feedbacks (admin)
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des feedbacks
 */

/**
 * @swagger
 * /admin/feedbacks/{id}:
 *   delete:
 *     tags: [Administration]
 *     summary: Supprimer un feedback (admin)
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback supprimé
 *       404:
 *         description: Feedback non trouvé
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     tags: [Likes]
 *     summary: Ajouter un like
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Like ajouté
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /likes/doctor/{idDoctor}:
 *   get:
 *     tags: [Likes]
 *     summary: Obtenir les likes d'un médecin
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idDoctor
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des likes
 *       404:
 *         description: Médecin non trouvé
 *   delete:
 *     tags: [Likes]
 *     summary: Supprimer tous les likes d'un médecin
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idDoctor
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Likes supprimés
 *       404:
 *         description: Médecin non trouvé
 */

/**
 * @swagger
 * /lives:
 *   post:
 *     tags: [Lives]
 *     summary: Créer un live
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Live créé
 *       400:
 *         description: Données invalides
 *   get:
 *     tags: [Lives]
 *     summary: Lister les lives
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des lives
 */

/**
 * @swagger
 * /lives/{id}:
 *   put:
 *     tags: [Lives]
 *     summary: Mettre à jour un live
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Live mis à jour
 *       404:
 *         description: Live non trouvé
 *   delete:
 *     tags: [Lives]
 *     summary: Supprimer un live
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live supprimé
 *       404:
 *         description: Live non trouvé
 */

/**
 * @swagger
 * /suggestions:
 *   post:
 *     tags: [Suggestions]
 *     summary: Créer une suggestion
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Suggestion créée
 *       400:
 *         description: Données invalides
 *   get:
 *     tags: [Suggestions]
 *     summary: Lister les suggestions
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des suggestions
 */

/**
 * @swagger
 * /suggestions/{id}:
 *   get:
 *     tags: [Suggestions]
 *     summary: Obtenir une suggestion
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion trouvée
 *       404:
 *         description: Suggestion non trouvée
 *   put:
 *     tags: [Suggestions]
 *     summary: Mettre à jour une suggestion
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Suggestion mise à jour
 *       404:
 *         description: Suggestion non trouvée
 *   delete:
 *     tags: [Suggestions]
 *     summary: Supprimer une suggestion
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion supprimée
 *       404:
 *         description: Suggestion non trouvée
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     tags: [Messages]
 *     summary: Envoyer un message
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *               receiverId:
 *                 type: string
 *               content:
 *                 type: string
 *               discussionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message envoyé
 *       400:
 *         description: Données invalides
 */

/**
 * @swagger
 * /messages/user/{userId}:
 *   get:
 *     tags: [Messages]
 *     summary: Obtenir les messages d'un utilisateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des messages
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /messages/discussion/{discussionId}:
 *   get:
 *     tags: [Messages]
 *     summary: Obtenir les messages d'une discussion
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des messages
 *       404:
 *         description: Discussion non trouvée
 *   delete:
 *     tags: [Messages]
 *     summary: Supprimer tous les messages d'une discussion
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages supprimés
 *       404:
 *         description: Discussion non trouvée
 */

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     tags: [Messages]
 *     summary: Mettre à jour un message
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message mis à jour
 *       404:
 *         description: Message non trouvé
 *   delete:
 *     tags: [Messages]
 *     summary: Supprimer un message
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message supprimé
 *       404:
 *         description: Message non trouvé
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Obtenir les notifications de l'utilisateur
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications
 */

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     tags: [Notifications]
 *     summary: Obtenir une notification
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification trouvée
 *       404:
 *         description: Notification non trouvée
 *   put:
 *     tags: [Notifications]
 *     summary: Marquer une notification comme lue
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marquée comme lue
 *       404:
 *         description: Notification non trouvée
 *   delete:
 *     tags: [Notifications]
 *     summary: Supprimer une notification
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification supprimée
 *       404:
 *         description: Notification non trouvée
 */

/**
 * @swagger
 * /notifications/{id}/readAll:
 *   put:
 *     tags: [Notifications]
 *     summary: Marquer toutes les notifications comme lues
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Toutes les notifications marquées comme lues
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /appointments/doctor:
 *   get:
 *     tags: [Rendez-vous]
 *     summary: Obtenir les rendez-vous d'un médecin
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     tags: [Rendez-vous]
 *     summary: Créer un rendez-vous
 *     security:
 *       - AppKey: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content

*/



router.post('/login', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return authController.login(ctx)
    })
  })
  
}).middleware([throttle])

router.get('/paiements/solde/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new PaymentsController()
      return controller.getBalance(ctx)
    })
  })
}).middleware([throttle])



router.get('/medecins/:userId/specialty', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return doctorsController.getDoctorSpecialty(ctx)
    })
  })
}).middleware([throttle])

router.get('/paiements/gains-mois/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new PaymentsController()
      return controller.getMonthlyEarnings(ctx)  // méthode à créer dans ton controller
    })
  })
}).middleware([throttle])

router.post('/upload/image', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const { request, response } = ctx

      const file = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (!file || !file.tmpPath) {
        return response.badRequest({ message: 'Aucun fichier fourni.' })
      }

      try {
        const fileName = `${cuid()}.${file.extname}`
        const fileBuffer = await fs.readFile(file.tmpPath)

        // Upload vers S3
        await drive.use('s3').put(`uploads/${fileName}`, fileBuffer)

        // Construire l'URL publique (à adapter selon ta config)
        const s3BaseUrl = process.env.S3_ENDPOINT?.replace(/\/$/, '') || ''
        const bucket = process.env.S3_BUCKET || ''
        const publicUrl = `${s3BaseUrl}/${bucket}/uploads/${fileName}`

        return response.created({
          message: 'Image envoyée avec succès',
          url: publicUrl,
        })
      } catch (error) {
        console.error(error)
        return response.internalServerError({ message: "Erreur lors de l'envoi de l'image" })
      }
    })
  })
})
router.get('/get-url', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const fileName = ctx.request.qs().fileName as string | undefined;

      if (!fileName) {
        ctx.response.status(400).json({ message: 'Nom du fichier manquant.' });
        return;
      }

      const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
      const region = process.env.AWS_REGION;
      const endpoint = process.env.S3_ENDPOINT;
      const bucket = process.env.S3_BUCKET;
      const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true';

      if (!accessKeyId || !secretAccessKey || !region || !endpoint || !bucket) {
        ctx.response.status(500).json({ message: 'Configuration AWS incomplète.' });
        return;
      }

      try {
        const s3 = new S3Client({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
          endpoint,
          forcePathStyle,
        });

        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: fileName,  // clé complète, par ex: 'users/gxuswb2bhpr1xgppkr72l6pl.jpg'
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 604800 }) // max 7 jours

        ctx.response.status(200).json({ url });
      } catch (error) {
        console.error(error);
        ctx.response.status(500).json({ message: "Erreur lors de la génération de l'URL." });
      }
    });
  });
});




router.get('/docs', async ({ view }) => {
  return view.render('welcome')
})


// Swagger JSON (servi dynamiquement)
router.get('/docs/swagger.json', async ({ response }) => {
  response.type('application/json')
  return response.send(swaggerSpec)
})
// Endpoint racine

// Route PUT pour la mise à jour du statut de l'utilisateur
router.put('/users/:id/status', async (ctx) => {
  console.log('[PUT /users/:id/status] Début de traitement')
  console.log('[PUT /users/:id/status] Params:', JSON.stringify(ctx.request.params(), null, 2))

  // On commence par exécuter un middleware frontend pour vérifier la requête
  await onlyFrontend.handle(ctx, async () => {
    // Vérifier l'API key avant de permettre la mise à jour
    await appKeyGuard.handle(ctx, async () => {
      // Appel au contrôleur pour mettre à jour le statut
      console.log('[PUT /users/:id/status] Avant appel controller updateStatus')
      return userupdate.updateStatus(ctx)  // Méthode dans le contrôleur pour mettre à jour le statut de l'utilisateur
    })
  })
}).middleware([throttle])  // Middleware pour limiter les requêtes (précaution supplémentaire)


router.get('/users/:id', async (ctx) => {
  console.log('[GET /users/:id] Début de traitement')
  console.log('[GET /users/:id] Params:', JSON.stringify(ctx.request.params(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[GET /users/:id] Avant appel controller show')
      return user.show(ctx)  // Méthode pour récupérer l'utilisateur
    })
  })
}).middleware([throttle])


router.delete('/users/:id', async (ctx) => {
  console.log('[GET /users/:id] Début de traitement')
  console.log('[GET /users/:id] Params:', JSON.stringify(ctx.request.params(), null, 2))

  await onlyFrontend.handle(ctx, async () => {

    await appKeyGuard.handle(ctx, async () => {
      console.log('[GET /users/:id] Avant appel controller show')
      return user.destroy(ctx)  // Méthode pour récupérer l'utilisateur
    })
  })
}).middleware([throttle])

router.put('/user/:id', async (ctx) => {
  console.log('[GET /users/:id] Début de traitement')
  console.log('[GET /users/:id] Params:', JSON.stringify(ctx.request.params(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[GET /users/:id] Avant appel changePassword controller show')
      return user.update(ctx)  // Méthode pour récupérer l'utilisateur
    })
  })
}).middleware([throttle])



router.put('/users/:id/change-password', async (ctx) => {
  console.log('[PUT /users/:id/change-password] Débutz de traitement')
  console.log('[PUT /users/:id/change-password] Params:', JSON.stringify(ctx.request.params(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[PUT /users/:id/change-password] Avant appel controller changePassword')
      return user.changePassword(ctx)  // Méthode pour changer le mot de passe
    })
  })
}).middleware([throttle])

// Register route
router.put('/users/:id', async (ctx) => {
  console.log('[PUT /users/:id] Début de traitement')
  console.log('[PUT /users/:id] Headers:', JSON.stringify(ctx.request.headers(), null, 2))
  console.log('[PUT /users/:id] Query Params:', JSON.stringify(ctx.request.qs(), null, 2))
  console.log('[PUT /users/:id] Body:', JSON.stringify(ctx.request.body(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[PUT /users/:id] Avant appel controller update')
      return registerController.update(ctx)  // Ton controller update ici
    })
  })
}).middleware([throttle])


// Route GET /disponibilites (Liste toutes les disponibilités)
router.get('/disponibilites', async (ctx) => {
  console.log('[GET /disponibilites] Début')
  
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return disponibilityuser.index(ctx)
    })
  })
}).middleware([throttle])

// Route GET /disponibilites/:id (Affiche une disponibilité spécifique par ID)
router.get('/disponibilites/:id', async (ctx) => {
  console.log(`[GET /disponibilites/${ctx.params.id}] Début`)
  
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return  disponibilityuser.getByDoctor(ctx)
    })
  })
}).middleware([throttle])

// Route POST /disponibilites (Créer une nouvelle disponibilité)
router.post('/disponibilites', async (ctx) => {
  console.log('[POST /disponibilites] Début')
  console.log('[Body]', ctx.request.body())

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return disponibilityuser.store(ctx)
    })
  })
}).middleware([throttle])

// Route PUT /disponibilites/:id (Met à jour une disponibilité par ID)
router.put('/disponibilites/:id', async (ctx) => {
  console.log(`[PUT /disponibilites/${ctx.params.id}] Début`)
  
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return disponibilityuser.update(ctx)
    })
  })
}).middleware([throttle])

// Route DELETE /disponibilites/:id (Supprime une disponibilité par ID)
router.delete('/disponibilites/:id', async (ctx) => {
  console.log(`[DELETE /disponibilites/${ctx.params.id}] Début`)
  
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return  disponibilityuser.destroy(ctx)
    })
  })
}).middleware([throttle])


router.get('/paiements/retraits-mois/:id', async (ctx) => {
  console.log(`[GET /paiements/retraits-mois/${ctx.params.id}] Début`)

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      // Passage de ctx avec un type explicite
      return  paymentre.retraitsParUser({
        params: { id: ctx.params.id }, // On cast explicitement le type de `params`
        response: ctx.response
      })
    })
  })
}).middleware([throttle])


router.post('/registerdocteur', async (ctx) => {
  console.log('[POST /register] Début de traitement')
  console.log('[POST /register] Headers:', JSON.stringify(ctx.request.headers(), null, 2))
  console.log('[POST /register] Query Params:', JSON.stringify(ctx.request.qs(), null, 2))
  console.log('[POST /register] Body:', JSON.stringify(ctx.request.body(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[POST /register] Avant appel controller')
      return registerController.registerDocteur(ctx)
    })
  })
}).middleware([throttle])


router.post('/registerclient', async (ctx) => {
  console.log('[POST /register] Début de traitement')
  console.log('[POST /register] Headers:', JSON.stringify(ctx.request.headers(), null, 2))
  console.log('[POST /register] Query Params:', JSON.stringify(ctx.request.qs(), null, 2))
  console.log('[POST /register] Body:', JSON.stringify(ctx.request.body(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[POST /register] Avant appel controller')
      return registerController.registerPatient(ctx)
    })
  })
}).middleware([throttle])


// Login route



router.get('/patients/count/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patientsController.index(ctx)
    })
  })
}).middleware([throttle])

router.get('/patients', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patientsController.index(ctx)
    })
  })
}).middleware([throttle])

router.get('/patientsuser/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patient.show(ctx)
    })
  })
}).middleware([throttle])

// Consultations count route


router.get('/consultations/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return consultationsController.list(ctx)
    })
  })
}).middleware([throttle])



const bucket = process.env.S3_BUCKET;

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_ENDPOINT || !process.env.S3_BUCKET) {
  throw new Error("Variables d'environnement AWS/S3 manquantes !");
}

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.S3_ENDPOINT!,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
});

router.get('/list-files/:prefix?', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const prefixParam = ctx.params.prefix || "";
      const prefix = prefixParam ? prefixParam + "/" : "";

      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
      });

      try {
        const data = await s3.send(command);

        if (!data.Contents || data.Contents.length === 0) {
          ctx.response.status(404).json({ message: `Aucun fichier trouvé dans '${prefix}'` });
          return;
        }

        const files = data.Contents.map(item => item.Key);

        ctx.response.json({
          prefix,
          files,
        });
      } catch (err) {
        console.error("Erreur lors de la liste des fichiers :", err);
        ctx.response.status(500).json({ message: "Erreur interne lors de la récupération des fichiers." });
      }
    });
  });
}).middleware([throttle]);


router.post('/paiements/mobile-money', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      // Créer une instance du contrôleur
      const paiementsController = new PaiementsController()
      
      // Appeler la méthode d'instance sur l'objet paiementsController
      return await paiementsController.createMobileMoneyInvoice(ctx)
    })
  })
}).middleware([throttle])

router.post('/auth/request-reset', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return passwordResetController.requestReset(ctx)
    })
  })
})

router.post('/auth/reset-password', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return passwordResetController.resetPassword(ctx)
    })
  })
})
///auth/verify-otp


router.post('/verify-email', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return emailverify.checkDoctorEmail(ctx)
    })
  })
})

router.post('/auth/verify-otp', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return passwordResetController.verifyOtp(ctx)
    })
  })
})

router.post('/account/delete/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return   deletecompte.deleteAccount(ctx)
    })
  })
}).middleware([throttle])

router.get('/account/all', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getAllUsers(ctx)
    })
  })
}).middleware([throttle])

router.get('/paiement/invoice-status/:billId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.checkInvoiceStatus(ctx)
    })
  })
}).middleware([throttle])


router.get('/paiement/all', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getAllPayments(ctx)
    })
  })
}).middleware([throttle])


// Créer un utilisateur (patient ou docteur)
router.post('/admin/account/create', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.createAccount(ctx)
    })
  })
})

// Suspendre un utilisateur
router.put('/admin/account/suspend/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.suspendAccount(ctx)
    })
  })
})

// Supprimer un utilisateur
router.delete('/admin/account/delete/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.deleteAccount(ctx)
    })
  })
})

router.get('/admin/account/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getUserDetails(ctx)
    })
  })
})

// Récupérer tous les utilisateurs (patients et docteurs)
router.get('/admin/accounts', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getAllUsers(ctx)
    })
  })
})

// Récupérer les paiements Mobile Money
router.get('/paiements/mobile-money', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getMobileMoneyPayments(ctx)
    })
  })
}).middleware([throttle])


router.post('/feedbacks', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await feedbackController.create(ctx)
    })
  })
})

router.put('/feedbacks/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await feedbackController.update(ctx)
    })
  })
})


// Récupérer tous les feedbacks
router.get('/admin/feedbacks', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getAll(ctx)
    })
  })
})

// Supprimer un feedback
router.delete('/admin/feedbacks/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.delete(ctx)
    })
  })
})


router.post('/likes', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await likesController.create(ctx)
    })
  })
})


// Récupérer tous les likes pour un docteur donné
router.get('/likes/doctor/:idDoctor', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await likesController.getLikesForDoctor(ctx)
    })
  })
})

// Supprimer tous les likes d'un docteur


router.put('/lives/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await livesController.update(ctx)
    })
  })
})


router.delete('/lives/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await livesController.delete(ctx)
    })
  })
})



router.delete('/likes/doctor/:idDoctor', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await likesController.deleteLikesForDoctor(ctx)
    })
  })
})
router.post('/suggestions', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await suggestionController.create(ctx);
    });
  });
});

// Mettre à jour une suggestion par son ID
router.put('/suggestions/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await suggestionController.update(ctx);
    });
  });
});

// Supprimer une suggestion par son ID
router.delete('/suggestions/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await suggestionController.delete(ctx);
    });
  });
});

// Récupérer toutes les suggestions
router.get('/suggestions', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await suggestionController.getAll(ctx);
    });
  });
});

// Récupérer une suggestion par son ID
router.get('/suggestions/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await suggestionController.getById(ctx);
    });
  });
});




// Messages routes
router.post('/messages', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.create(ctx);
    });
  });
});

router.get('/messages/user/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.getByUser(ctx)
    })
  })
})


router.get('/messages/discussion/:discussionId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.getByDiscussion(ctx);
    });
  });
});

router.put('/messages/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.update(ctx);
    });
  });
});

router.delete('/messages/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.delete(ctx);
    });
  });
});


// Récupérer toutes les notifications de l'utilisateur authentifié

// Récupérer toutes les notifications de l'utilisateur authentifié


// Récupérer une notification spécifique par ID
router.get('/notifications/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await NotificationControllers.index(ctx)
    })
  })
})

// Marquer une notification comme lue
router.put('/notifications/:id/read', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await NotificationControllers.markAsRead(ctx);
    });
  });
});


// routes.ts

router.put('/notifications/:id/readAll', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      // Passer l'ID utilisateur dans les paramètres à la méthode `markAllAsRead`
      await NotificationControllers.markAllAsRead(ctx);
    });
  });
});




// Supprimer une notification spécifique par ID
router.delete('/notifications/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await NotificationControllers.destroy(ctx)
    })
  })
})
router.delete('/messages/discussion/:discussionId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.deleteAllByDiscussion(ctx);
    });
  });
});

// Lives routes
router.post('/lives', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await livesController.create(ctx);
    });
  });
});

router.get('/lives', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await livesController.index(ctx);
    });
  });
});


router.get('/appointments/doctor', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await appointmentController.getAppointmentsForDoctor(ctx)
    })
  })
})

router.post('/appointments', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await appointmentController.create(ctx)
    })
  })
})

router.on('/').renderInertia('home')
router.get('/auth', async ({ inertia }) => {
  return inertia.render('auth/login') // => resources/js/Pages/auth/login.tsx
})

router.get('/register', async ({ inertia }) => {
  return inertia.render('auth/register') // assure-toi que ce composant existe
})

router.get('/login', async ({ inertia }) => {
  return inertia.render('auth/login') // correspond à resources/js/Pages/auth/login.tsx
})





router.get('/auth/rest-password', async ({ inertia }) => {
  return inertia.render('auth/rest-password')
})

// routes.ts
router.get('/logins', async ({ inertia }) => {
  return inertia.render('auth/login') // => resources/js/Pages/auth/login.tsx
})

router.get('/registers', async ({ inertia }) => {
  return inertia.render('auth/register') // assure-toi que ce composant existe
})



router.post('/logins', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await loginadmin.login(ctx)
    })
  })
})

router.get('/doctors', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await doctorAll.getUserInfo(ctx)
    })
  })
})

router.get('/csrf-check', async ({ response }) => {
  return response.ok({ status: 'ok' })
})


router.get('/dashboard', async ({ request, response, inertia }) => {
  const token = request.cookie('token');

  if (!token) {
    return response.redirect('/login');
  }

  try {
    // ✅ Vérification du JWT
    const payload = verifyJwtToken(token) as { id: string; email: string };
    const currentUser = await User.query().where('id', payload.id).preload('role').first();

    if (!currentUser) {
      return response.redirect('/login');
    }

    // ✅ Charger tous les utilisateurs avec leur rôle
    const users = await User.query().preload('role');

    // ✅ Filtrage des patients et docteurs
    const patients = users.filter((u) => u.role && u.role.label.toLowerCase() === 'patient');
    const doctors = users.filter(
      (u) => u.role && ['doctor', 'medecin'].includes(u.role.label.toLowerCase())
    );

    // ✅ Statistiques docteurs
    const totalDoctors = doctors.length;
    const activeDoctors = doctors.filter(
      (u) => u.accountStatus?.toLowerCase() === 'active'
    ).length;
    const inactiveDoctors = totalDoctors - activeDoctors;
    const doctorPercentActive = totalDoctors
      ? Math.round((activeDoctors / totalDoctors) * 100)
      : 0;

    // ✅ Statistiques patients
    const totalPatients = patients.length;
    const activePatients = patients.filter(
      (p) => p.accountStatus?.toLowerCase() === 'active'
    ).length;
    const inactivePatients = totalPatients - activePatients;
    const patientPercentActive = totalPatients
      ? Math.round((activePatients / totalPatients) * 100)
      : 0;

    // ✅ Récupérer tous les paiements validés et calculer la somme
    const totalPaiements = await Paiement.query()
      .where('statut', 'valide') // tu peux enlever ce filtre si tu veux TOUT
      .sum('montant as total');

    const montantTotalPlateforme = totalPaiements[0].$extras.total || 0;

    // ✅ Version "safe" des utilisateurs (sans mot de passe ou infos sensibles)
    const safeUsers = users.map((user) => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      specialty: user.specialites, 
      accountStatus: user.accountStatus,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role ? user.role.label : null,
    }));

    // ✅ Rendu Inertia
    return inertia.render('dashboard/dashboard', {
      user: {
        id: currentUser.id,
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
        email: currentUser.email,
        phone: currentUser.phone,
      
        accountStatus: currentUser.accountStatus,
        profileImage: currentUser.profileImage,
        createdAt: currentUser.createdAt,
        updatedAt: currentUser.updatedAt,
        role: currentUser.role ? currentUser.role.label : null,
      },
      users: safeUsers,
      stats: {
        totalPatients,
        activePatients,
        inactivePatients,
        percentActive: patientPercentActive,
        totalDoctors,
        activeDoctors,
        inactiveDoctors,
        percentDoctorsActive: doctorPercentActive,
        montantTotalPlateforme, // 💰 Montant total envoyé au frontend
      },
    });
  } catch (error: any) {
    console.error('[Dashboard] Erreur JWT :', error.message);
    return response.redirect('/login');
  }
});



router.get('/logout', async (ctx) => {
  await authController.logout(ctx) // ctx contient { request, response, ... }
  return ctx.response.redirect('/')
})

router.get('/404', async ({ inertia }) => {
  return inertia.render('errors/not_found')
})




// Route fallback - doit être la dernière route
router.get('*', async ({ inertia }) => {
  return inertia.render('errors/not_found', { status: 404 })
})


router.get('/doctor', async ({ inertia }) => {
  return inertia.render('/dashboard/docteurs')
})



// Route protégée pour afficher les docteurs en attente
router.get('/ListeDemande', async ({ request, response, auth, inertia }) => {
  const token = request.cookie('token')

  if (!token) {
    return response.redirect('/login')
  }

  try {
    const payload = verifyJwtToken(token) as { id: string; email: string }
    const currentUser = await User.find(payload.id)

    if (!currentUser) {
      return response.redirect('/login')
    }

    // Appeler la méthode index du controller
    const controller = new UsersController()
    return await controller.show({ request, response, auth, inertia })

  } catch (error: any) {
    console.error('[Demandes] Erreur JWT :', error.message)
    return response.redirect('/login')
  }
})



router.group(() => {
  // Route pour créer un live
  router.post('/lives/create/:idDiscussion', async (ctx) => {
    await appKeyGuard.handle(ctx, async () => {
      return livecontroller.createLive(ctx)
    })
  })

  // Route pour récupérer les lives d'un utilisateur
  router.get('/lives/user/:userId', async (ctx) => {
    await appKeyGuard.handle(ctx, async () => {
      return livecontroller.getLivesByUser(ctx)
    })
  })

  // Route pour récupérer les utilisateurs d'un live
  router.get('/lives/:liveId/users', async (ctx) => {
    await appKeyGuard.handle(ctx, async () => {
      return livecontroller.getUsersByLive(ctx)
    })
  })
})


//route pour les demandes des docteurs 
router.post('/DemandeDocteur', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await DemandeController.store(ctx)
    })
  })
})


