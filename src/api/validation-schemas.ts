import { 
    AdminCreateProduct,
} from "@medusajs/medusa/api/admin/products/validators"
import { z } from "zod"
import { MediaType } from "../modules/book/types"

export const createBookSchema = z.object({
    title: z.string(),
    author: z.string(),
    series: z.string(),
    series_num: z.string(),
    summary: z.string(),
    genres: z.array(z.string()),
    tags: z.array(z.string()),
    cws: z.array(z.string()),
    price: z.number(),
    status: z.string(),
    slug: z.string(),
    medias: z.array(z.object({
        type: z.nativeEnum(MediaType),
        file_id: z.string(),
        mime_type: z.string(),
    })),
    product: AdminCreateProduct(),
})