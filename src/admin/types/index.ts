import { ProductVariantDTO } from "@medusajs/framework/types"

export enum MediaType {
    COVER = "cover",
    PREVIEW = "preview",
    EPUB = "epub",
    PDF = "pdf"
}

export type BookMedia = {
    id: string
    type: MediaType
    fileId: string
    mimeType: string
    book?: Book
}

export type Book = {
    id: string
    title: string
    medias?: BookMedia[]
    product_variant?:ProductVariantDTO
}