import type { PluginOption } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import unplugins from './unplugin'

export function setupVitePlugins(_viteEnv?: ImportMetaEnv, _isBuild?: boolean): PluginOption[] {
  const plugins = [
    ...unplugins,
    react(),
    mkcert(),
    TanStackRouterVite(),
  ]
  return plugins
}
