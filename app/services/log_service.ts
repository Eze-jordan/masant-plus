import ActionLog from '#models/action_log'
import type { HttpContext } from '@adonisjs/core/http'

export default class LogService {
  /**
   * Champs sensibles à masquer
   */
  private static sensitiveFields = [
    'password',
    'motDePasse',
    'password_confirmation',
    'token',
    'authorization',
    'oldPassword',
    'newPassword',
    'otp',
    'code',
  ]

  /**
   * Nettoyage du payload
   */
  private static cleanPayload(payload: any) {
    if (!payload) return {}

    const cleaned = JSON.parse(JSON.stringify(payload))

    for (const field of this.sensitiveFields) {
      if (cleaned[field] !== undefined) {
        cleaned[field] = '***'
      }
    }

    if (cleaned.file) cleaned.file = '[FILE-UPLOADED]'
    if (cleaned.files) cleaned.files = '[FILES-UPLOADED]'

    return cleaned
  }

  /**
   * ➤ Méthode pour récupérer tous les logs (utilisée dans ton controller)
   */
  public async all() {
    return ActionLog.query().orderBy('created_at', 'desc')
  }

  /**
   * ➤ Méthode statique pour enregistrer un log automatiquement
   */
  public static async log(
    request: HttpContext['request'],
    action: string,
    statusCode: number | null = null
  ) {
    const ctx = request.ctx
    const user = ctx?.auth?.user
    const payload = this.cleanPayload(request.body() || {})

    await ActionLog.create({
      userId: user?.id ? Number(user.id) : null,
      action,
      method: request.method(),
      payload,
      ipAddress: request.ip(),
      userAgent: request.header('user-agent'),
      statusCode,
    })
  }
}
