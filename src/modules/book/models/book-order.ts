import { model } from "@medusajs/framework/utils"
import { OrderStatus } from "../types"
import Book from "./book"

const BookOrder = model.define("book_order", {
    id: model.id().primaryKey(),
    status: model.enum(OrderStatus),
    products: model.manyToMany(() => Book, {
        mappedBy: "orders",
        pivotTable: "book_bookorders",
    }),
})

export default BookOrder