import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: false
  },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#07080c' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Pianight' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      googleClientId: ''
    }
  },
  css: [
    '~/assets/css/global.css'
  ],
  future: {
    compatibilityVersion: 4
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-svgo',
    'shadcn-nuxt'
  ],
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Fraunces', provider: 'google', weights: [400, 500, 600, 700, 800], italic: true }
    ]
  },
  i18n: {
    restructureDir: 'app',
    langDir: 'i18n/locales',
    defaultLocale: 'es',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'es', name: 'Spanish', file: 'es.json' }
    ]
  }
})
