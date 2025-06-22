import env from '#start/env'
import { defineConfig, services } from '@adonisjs/drive'
export default defineConfig({
  default: 's3',

  services: {
    s3: services.s3({
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },
      region: env.get('AWS_REGION', 'us-east-1'),
      bucket: env.get('S3_BUCKET'),
      endpoint: env.get('S3_ENDPOINT'),
      forcePathStyle: env.get('S3_FORCE_PATH_STYLE') === 'true',
      visibility: 'public',
    }),
  },
})