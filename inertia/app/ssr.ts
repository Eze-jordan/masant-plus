import { createInertiaApp} from '@inertiajs/vue3'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { DefineComponent } from 'vue'
import { Page } from '@inertiajs/core'
import { PageProps } from './types'

// Si tu as une définition de type pour PageProps dans ton projet, assure-toi de l'importer ici

// Mettre à jour la signature de la fonction render
export default function render(page: Page<PageProps>) {  // Utiliser le type Page<PageProps>
  return createInertiaApp({
    page,
    render: renderToString,  // Utilisation de renderToString pour SSR
    resolve: (name: string) => {  // Assurez-vous que `name` est bien une chaîne
      const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue')
      return pages[`../pages/${name}.vue`]().then((module) => module.default)
    },
    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) }).use(plugin)
    },
  })
}
