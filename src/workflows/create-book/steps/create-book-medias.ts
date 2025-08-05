import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"
import BookModuleService from "../../../modules/book/service"
import { BOOK_MODULE } from "../../../modules/book"
import { MediaType } from "../../../modules/book/types"

export type CreateBookMediaInput = {
    type: MediaType
    fileId: string
    mimeType: string
    book_id: string
}

type CreateBookMediasStepInput = {
    medias: CreateBookMediaInput[]
}

const createBookMediasStep = createStep(
    "create-book-medias",
    async ({ 
        medias,
    }: CreateBookMediasStepInput, { container }) => {
    const BookModuleService: BookModuleService = 
        container.resolve(BOOK_MODULE)

        const BookMedias = await BookModuleService
        .createBookMedias(medias)

    return new StepResponse({
        book_medias: BookMedias,
    }, {
        book_medias: BookMedias,
    })
    },
    async ({ book_medias }, { container }) => {
        const BookModuleService: BookModuleService = 
            container.resolve(BOOK_MODULE)
        
        await BookModuleService.deleteBookMedias(
            book_medias.map((media) => media.id)
        )
    }
)

export default createBookMediasStep