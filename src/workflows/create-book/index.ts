import { 
    createWorkflow,
    transform,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
    CreateProductWorkflowInputDTO,
} from "@medusajs/framework/types"
import { 
    createProductsWorkflow,
    createRemoteLinkStep,
} from "@medusajs/medusa/core-flows"
import { 
    Modules,
} from "@medusajs/framework/utils"
import createBookStep, { 
    CreateBookStepInput,
} from "./steps/create-book"
import createBookMediasStep, { 
    CreateBookMediaInput,
} from "./steps/create-book-medias"
import { BOOK_MODULE } from "../../modules/book"

type CreateBookWorkflowInput = {
    book_: CreateBookStepInput & {
    medias: Omit<CreateBookMediaInput, "book_id">[]
    }
    product: CreateProductWorkflowInputDTO
}

const createBookWorkflow = createWorkflow(
    "create-book",
    (input: CreateBookWorkflowInput) => {
        const { medias, ...BookData } = input.book_

        const product = createProductsWorkflow.runAsStep({
            input: {
                products: [input.product],
            },
        })

    const { book_ } = createBookStep(
        BookData
    )

    const { book_medias } = createBookMediasStep(
        transform({
            book_,
            medias,
        },
        (data) => ({
            medias: data.medias.map((media) => ({
            ...media,
            book_id: data.book_.id,
            })),
        })
        )
    )

    createRemoteLinkStep([{
        [BOOK_MODULE]: {
            book__id: book_.id,
        },
        [Modules.PRODUCT]: {
            product_variant_id: product[0].variants[0].id,
        },
    }])

    return new WorkflowResponse({
        book_: {
            ...book_,
            medias: book_medias,
        },
        })
    }
)

export default createBookWorkflow