import { assert } from '@japa/assert'
import app from '@adonisjs/core/services/app'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { apiClient } from '@japa/api-client'
import { inertiaApiClient } from '@adonisjs/inertia/plugins/api_client'
import { Config } from '@japa/runner/types'

export const plugins: Config['plugins'] = [
  assert(), 
  pluginAdonisJS(app),
  apiClient(),
  inertiaApiClient(app)
]
