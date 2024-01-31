import type { ProxyOptions } from 'vite'

export function createViteProxy(isUseProxy = true, proxyType: ProxyType) {
  if (!isUseProxy)
    return undefined

  const proxyConfig = getProxyConfig(proxyType)

  const proxy: Record<string, string | ProxyOptions> = {
    [proxyConfig.prefix]: {
      target: proxyConfig.target,
      ws: true,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^${proxyConfig.prefix}`), '/'),
    },
  }
  return proxy
}
const proxyConfigMappings: Record<ProxyType, ProxyConfig> = {
  dev: {
    prefix: '/socket',
    target: 'http://localhost:3000',
  },
  test: {
    prefix: '/api',
    target: 'https://api.github.com',
  },
  prod: {
    prefix: '/api',
    target: 'https://api.github.com',
  },
}

export function getProxyConfig(envType: ProxyType = 'dev'): ProxyConfig {
  return proxyConfigMappings[envType]
}
