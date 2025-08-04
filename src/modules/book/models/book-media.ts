import { model } from "@medusajs/framework/utils"
import { MediaType } from "../types"
import Book from "./book"

const BookMedia = model.define("digital_product_media", {
    id: model.id().primaryKey(),
    type: model.enum(MediaType),
    fileId: model.text(),
    mimeType: model.text(),
    book: model.belongsTo(() => Book, {
        mappedBy: "medias",
    }),
})

export default BookMedia