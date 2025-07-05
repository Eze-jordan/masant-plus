import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async home({ inertia }: HttpContextContract) {
    return inertia.render('home')
  }
}
