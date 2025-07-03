import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { PageProps } from '@inertiajs/inertia'

// Explicitly type the App and props in the setup function
export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name: string) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      return pages[`../pages/${name}.tsx`]
    },
    setup: ({ App, props }: { App: React.ComponentType<PageProps>; props: PageProps }) => {
      // Ensure the correct type for App and props
      return <App {...props} />
    },
  })
}
