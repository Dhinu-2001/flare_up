import {z} from "zod";

const envSchema = z.object({
    VITE_map_key: z.string(),
    VITE_cloudinary_name: z.string(),
    VITE_cloudinary_upload_preset: z.string(),
})

export const env = envSchema.parse(import.meta.env);

