import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { renderPage } from 'inertia/app/ssr'

export default class PageController {
  public async index({ inertia }: HttpContextContract) {
    const page = 'Home'  // La page à rendre
    const props = {}      // Propriétés à partager avec la page

    // Rendu SSR de la page
    const { html, props: sharedProps } = await renderPage({ url: '/', props })

    return inertia.render(page, {
      ...sharedProps,  // Propriétés partagées pour Inertia
      html,             // HTML rendu par SSR
    })
  }
}
