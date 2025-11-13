
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

