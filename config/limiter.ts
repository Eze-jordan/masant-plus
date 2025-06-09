import { defineConfig, stores } from '@adonisjs/limiter'
import type { InferLimiters } from '@adonisjs/limiter/types'

const limiterConfig = defineConfig({
  default: 'memory', // Utilise mémoire uniquement

  stores: {
    memory: stores.memory({}),

    // 🔴 Ne surtout pas utiliser cette ligne si Redis n'est pas installé
    // redis: stores.redis({}),
  },
})

export default limiterConfig

declare module '@adonisjs/limiter/types' {
  export interface LimitersList extends InferLimiters<typeof limiterConfig> {}
}
