/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css';
import { createSSRApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'masanteplus'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title}  ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue'),
    )
  },

  setup({ el, App, props, plugin }) {

<<<<<<< HEAD
    createApp({ render: () => h(App, props) })
=======
    createSSRApp({ render: () => h(App, props) })
>>>>>>> 6f506420a02e20676352333842b78602f55cbfe5

      .use(plugin)
      .mount(el)
  },
})
