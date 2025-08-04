import BookModule from "../modules/book"
import OrderModule from "@medusajs/medusa/order"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: BookModule.linkable.bookOrder,
    deleteCascade: true,
  },
  OrderModule.linkable.order
)