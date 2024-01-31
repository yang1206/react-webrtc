import type { Config } from 'tailwindcss'
import { dynamicIconsPlugin, getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'

export default {
  darkMode: ['class'],
  daisyui: {
    themes: [
      'bumblebee',
      'business',
    ],
    darkTheme: 'business',
  },
  content: ['./src/**/*.{jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
        'phone': { raw: '(max-width: 768px)' },
        'desktop': { raw: '(min-width: 1024px)' },
        'tablet': { raw: '(max-width: 1023px)' },
      },
    },
  },
  plugins: [
    // eslint-disable-next-line ts/no-require-imports
    require('daisyui'),
    iconsPlugin({
      // Select the icon collections you want to use
      // You can also ignore this option to automatically discover all icon collections you have installed
      collections: getIconCollections(['line-md', 'carbon', 'heroicons-outline', 'svg-spinners']),
      scale: 1.25,
    }),
    dynamicIconsPlugin(),
  ],
} satisfies Config
