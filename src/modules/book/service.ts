import { MedusaService } from "@medusajs/framework/utils"
import Book  from "./models/book"
import BookOrder from "./models/book-order"
import BookMedia from "./models/book-media"

class BookModuleService extends MedusaService({
    Book,
    BookMedia,
    BookOrder,
}) {

}
export default BookModuleService