import ActionLog from '#models/action_log'
import LogService from '#services/log_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class LogsController {
  private logService = new LogService()

  /**
   * ➤ PAGE INERTIA (Dashboard admin)
   */
  public async index({ request, inertia }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const search = request.input('search', '').trim()
      const method = request.input('method', '').trim()
      const userId = request.input('userId', '').trim()

      const query = ActionLog.query().orderBy('created_at', 'desc')

      if (search) query.whereILike('action', `%${search}%`)
      if (method) query.where('method', method.toUpperCase())
      if (userId && Number(userId) > 0) query.where('user_id', Number(userId))

      const logs = await query.paginate(page, 20)

      return inertia.render('Logs/Index', {
        logs: logs.serialize(),
        filters: { search, method, userId },
      })
    } catch (error) {
      console.error('Erreur LogsController.index :', error)
      throw error
    }
  }

  /**
   * ➤ PAGE DETAILS INERTIA
   */
  public async show({ params, inertia }: HttpContext) {
    try {
      const log = await ActionLog.findOrFail(params.id)
      return inertia.render('Logs/Show', { log })
    } catch (error) {
      console.error('Erreur LogsController.show :', error)
      throw error
    }
  }

  /**
   * ➤ API JSON pour Postman (paginated)
   */
  public async api({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const limit = Number(request.input('limit', 100))
      const search = request.input('search', '').trim()

      const query = ActionLog.query().orderBy('created_at', 'desc')

      if (search) {
        query.where((q) => {
          q.whereILike('action', `%${search}%`)
            .orWhereILike('method', `%${search}%`)
            .orWhereILike('ip_address', `%${search}%`)
            .orWhereILike('user_agent', `%${search}%`)

          // Recherche par ID (si c'est un nombre valide)
          if (Number(search) > 0) {
            q.orWhere('user_id', Number(search))
          }
        })
      }

      const logs = await query.paginate(page, limit)
      return response.ok(logs.toJSON())
    } catch (error) {
      console.error('Erreur LogsController.api :', error)
      return response.status(500).send({
        message: 'Erreur lors de la récupération des logs.',
        error: error.message,
      })
    }
  }

  /**
   * ➤ API JSON : TOUT récupérer (sans pagination)
   */
  public async all({ response }: HttpContext) {
    try {
      const logs = await this.logService.all()
      return response.ok(logs)
    } catch (error) {
      console.error('Erreur LogsController.all :', error)
      return response.status(500).send({
        message: 'Erreur lors de la récupération complète des logs.',
        error: error.message,
      })
    }
  }
}
