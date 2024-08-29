import { z } from 'zod'

const envsSchema = z.object({
    DATABASE_URL: z.string().url(),
    WEB_BASE_URL: z.string().url(),
    API_BASE_URL: z.string().url(),
    PORT: z.coerce.number().default(4000),
    USER_EMAIL: z.string(),
    PASSWORD_MAIL: z.string(),
})

export const env = envsSchema.parse(process.env)