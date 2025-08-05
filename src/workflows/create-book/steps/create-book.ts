import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"
import BookModuleService from "../../../modules/book/service"
import { BOOK_MODULE } from "../../../modules/book"

export type CreateBookStepInput = {
    name: string
}

const createBookStep = createStep(
    "create-book-step",
    async (data: CreateBookStepInput, { container }) => {
        const BookModuleService: BookModuleService = 
        container.resolve(BOOK_MODULE)

        const book = await BookModuleService
        .createBooks(data)
    
        return new StepResponse({
        book_: book,
        }, {
        book_: book,
        })
    },
    async ({ book_ }, { container }) => {
        const BookModuleService: BookModuleService = 
        container.resolve(BOOK_MODULE)
        
        await BookModuleService.deleteBooks(
        book_.id
        )
    }
)

export default createBookStep