// Import necessary dependencies
import React from 'react';  // React is necessary for JSX syntax
import { createRoot } from 'react-dom/client';  // For rendering the app to the DOM
import { createInertiaApp } from '@inertiajs/react';  // Inertia.js app setup
import { resolvePageComponent } from '@adonisjs/inertia/helpers';  // Helper to resolve page components dynamically

// Define the app name, pulling from the environment or defaulting to 'AdonisJS'
const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS';

// Create the Inertia app
createInertiaApp({
  // Configure the progress bar color (for page navigation)
  progress: { color: '#5468FF' },

  // Set the document title dynamically
  title: (title:string) => `${title} - ${appName}`,

  // Resolving page components dynamically using import.meta.glob
  resolve: (name:string) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,  // Page component path
      import.meta.glob('./pages/**/*.tsx')  // Glob pattern for dynamic import
    );
  },

  // Setup the root app and render it into the DOM
  setup({ el, App, props }: { el: HTMLElement; App: React.ComponentType<any>; props: any }) {
    const root = createRoot(el);  // Ensure el is an HTMLElement
    root.render(React.createElement(App, props));  // Use React.createElement for type safety
  },
});
