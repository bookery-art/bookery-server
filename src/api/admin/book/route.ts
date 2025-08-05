import { 
    AuthenticatedMedusaRequest, 
    MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import createBookWorkflow from "../../../workflows/create-book"
import { CreateBookMediaInput } from "../../../workflows/create-book/steps/create-book-medias"
import { createBookSchema } from "../../validation-schemas"

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const { 
        fields, 
        limit = 20, 
        offset = 0,
    } = req.validatedQuery || {}
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { 
        data: book,
        metadata: { count, take, skip } = {},
    } = await query.graph({
        entity: "book",
        fields: [
            "*",
            "medias.*",
            "product_variant.*",
            ...(fields || []),
        ],
        pagination: {
            skip: offset,
            take: limit,
        },
    })

    res.json({
        book: book,
        count,
        limit: take,
        offset: skip,
    })
}


type CreateRequestBody = z.infer<
    typeof createBookSchema
>


export const POST = async (
    req: AuthenticatedMedusaRequest<CreateRequestBody>,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data: [shippingProfile] } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
    })

    const { result } = await createBookWorkflow(
        req.scope
    ).run({

        input: {
        book_: {
            title: req.validatedBody.title,
            author: req.validatedBody.author,
            cover: req.validatedBody.cover,
            series: req.validatedBody.series,
            series_num: req.validatedBody.series_num,
            summary: req.validatedBody.summary,
            genres: req.validatedBody.genres.map((genre) => (genre)),
            tags: req.validatedBody.genres.map((tag) => (tag)),
            cws: req.validatedBody.genres.map((cw) => (cw)),
            medias: req.validatedBody.medias.map((media) => ({
                        fileId: media.file_id,
                        mimeType: media.mime_type,
                        ...media,
                })) as Omit<CreateBookMediaInput, "book_id">[],
            },
        product: {
            ...req.validatedBody.product,
            shipping_profile_id: shippingProfile.id,
        },
    },
})


    res.json({
        book_: result.book_,
    })

}