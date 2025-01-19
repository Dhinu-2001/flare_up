// import {z} from "zod";

// const envSchema = z.object({
//     VITE_map_key: z.string(),
//     VITE_cloudinary_name: z.string(),
//     VITE_cloudinary_upload_preset: z.string(),
//     VITE_stripe: z.string(),
//     VITE_googleOauthClientId: z.string(),
//     VITE_gateway_svc: z.string(),
//     VITE_notification_svc: z.string(),
// })

// export const env = envSchema.parse(import.meta.env);
export const env = import.meta.env;

