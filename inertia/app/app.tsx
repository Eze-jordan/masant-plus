/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css';
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title:string) => `${title} - ${appName}`,

  resolve: (name:string) => {
    return resolvePageComponent(
      `../pages/${name as string}.tsx`,
      import.meta.glob('../pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }) {
    
    hydrateRoot(el, <App {...props} />)
    
  },
});