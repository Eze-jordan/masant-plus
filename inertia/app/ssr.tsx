import ReactDOMServer from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';

// Define the types for the setup function
export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    
    // Adding type for `name` parameter
    resolve: (name: string) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true });
      return pages[`../pages/${name}.tsx`];
    },

    // Adding types for `App` and `props` in `setup`
    setup: ({ App, props }: { App: React.ComponentType<any>; props: any }) => <App {...props} />,
  });
}
