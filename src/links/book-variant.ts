import BookModule from "../modules/book"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
    {
        linkable: BookModule.linkable.book,
        deleteCascade: true,
    },
    ProductModule.linkable.productVariant
)